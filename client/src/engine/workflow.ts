export type NodeType =
  | "csvInput"
  | "jsonInput"
  | "xmlInput"
  | "filter"
  | "map"
  | "normalize"
  | "dropColumns"
  | "dropRows"
  | "output"
  | "visualization"

export interface Position {
  x: number
  y: number
}

export interface NodeData {
  [key: string]: unknown
}

export interface WorkflowNode {
  id: string
  type: NodeType
  data: NodeData
  position: Position
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
}

export interface WorkflowDefinition {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}

export interface Workflow {
  _id: string
  name: string
  definition: WorkflowDefinition
}

export type Row = Record<string, unknown>

export type DataFrame = Row[]

export interface NodeExecutionContext {
  log(message: string): void
}

export abstract class BaseNodeRuntime {
  readonly id: string
  readonly type: NodeType
  readonly config: NodeData

  constructor(id: string, type: NodeType, config: NodeData) {
    this.id = id
    this.type = type
    this.config = config
  }

  abstract execute(inputs: DataFrame[], ctx: NodeExecutionContext): Promise<DataFrame[]>
}

class CsvInputNodeRuntime extends BaseNodeRuntime {
  async execute(inputs: DataFrame[], ctx: NodeExecutionContext): Promise<DataFrame[]> {
    ctx.log(`Executing csvInput node ${this.id}`)
    const sample: DataFrame = [
      { id: 1, name: "Alice", age: 25 },
      { id: 2, name: "Bob", age: 17 },
      { id: 3, name: "Charlie", age: 32 }
    ]
    return [sample]
  }
}

class FilterNodeRuntime extends BaseNodeRuntime {
  async execute(inputs: DataFrame[], ctx: NodeExecutionContext): Promise<DataFrame[]> {
    ctx.log(`Executing filter node ${this.id}`)
    const input = inputs[0] ?? []
    const condition = String(this.config.condition ?? "")
    const match = condition.match(/^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*>\s*(\d+)\s*$/)
    if (!match) {
      return [input]
    }
    const [, field, thresholdStr] = match
    const threshold = Number(thresholdStr)
    const filtered = input.filter(row => {
      const value = row[field]
      if (typeof value === "number") {
        return value > threshold
      }
      if (typeof value === "string") {
        const numeric = Number(value)
        if (!Number.isNaN(numeric)) {
          return numeric > threshold
        }
      }
      return false
    })
    return [filtered]
  }
}

class OutputNodeRuntime extends BaseNodeRuntime {
  async execute(inputs: DataFrame[], ctx: NodeExecutionContext): Promise<DataFrame[]> {
    ctx.log(`Executing output node ${this.id}`)
    const input = inputs[0] ?? []
    ctx.log(`Output rows: ${input.length}`)
    return [input]
  }
}

const nodeRegistry: Record<NodeType, new (id: string, type: NodeType, config: NodeData) => BaseNodeRuntime> =
  {
    csvInput: CsvInputNodeRuntime,
    jsonInput: CsvInputNodeRuntime,
    xmlInput: CsvInputNodeRuntime,
    filter: FilterNodeRuntime,
    map: FilterNodeRuntime,
    normalize: FilterNodeRuntime,
    dropColumns: FilterNodeRuntime,
    dropRows: FilterNodeRuntime,
    output: OutputNodeRuntime,
    visualization: OutputNodeRuntime
  }

export interface ExecutionResult {
  nodeOutputs: Record<string, DataFrame[]>
}

export class WorkflowExecutionEngine {
  async execute(definition: WorkflowDefinition, ctx: NodeExecutionContext): Promise<ExecutionResult> {
    const nodesById = new Map(definition.nodes.map(n => [n.id, n]))
    const runtimeNodes = new Map<string, BaseNodeRuntime>()

    for (const node of definition.nodes) {
      const ctor = nodeRegistry[node.type]
      if (!ctor) {
        throw new Error(`No runtime registered for node type ${node.type}`)
      }
      runtimeNodes.set(node.id, new ctor(node.id, node.type, node.data))
    }

    const adjacency = new Map<string, string[]>()
    const indegree = new Map<string, number>()

    for (const node of definition.nodes) {
      adjacency.set(node.id, [])
      indegree.set(node.id, 0)
    }

    for (const edge of definition.edges) {
      const list = adjacency.get(edge.source)
      if (!list) {
        throw new Error(`Invalid source node ${edge.source}`)
      }
      list.push(edge.target)
      indegree.set(edge.target, (indegree.get(edge.target) ?? 0) + 1)
    }

    const queue: string[] = []
    for (const [nodeId, deg] of indegree.entries()) {
      if (deg === 0) {
        queue.push(nodeId)
      }
    }

    const nodeInputs = new Map<string, DataFrame[]>()
    const nodeOutputs: Record<string, DataFrame[]> = {}

    for (const nodeId of nodesById.keys()) {
      nodeInputs.set(nodeId, [])
    }

    let processedCount = 0

    while (queue.length > 0) {
      const nodeId = queue.shift() as string
      const runtimeNode = runtimeNodes.get(nodeId)
      if (!runtimeNode) {
        throw new Error(`Missing runtime node for id ${nodeId}`)
      }

      const inputs = nodeInputs.get(nodeId) ?? []
      const outputs = await runtimeNode.execute(inputs, ctx)
      nodeOutputs[nodeId] = outputs

      const neighbors = adjacency.get(nodeId) ?? []
      for (const neighbor of neighbors) {
        const neighborInputs = nodeInputs.get(neighbor)
        if (!neighborInputs) {
          throw new Error(`Missing inputs map for node ${neighbor}`)
        }
        neighborInputs.push(...outputs)

        const updatedDegree = (indegree.get(neighbor) ?? 0) - 1
        indegree.set(neighbor, updatedDegree)
        if (updatedDegree === 0) {
          queue.push(neighbor)
        }
      }

      processedCount += 1
    }

    if (processedCount !== definition.nodes.length) {
      throw new Error("Workflow contains cycles or unreachable nodes")
    }

    return { nodeOutputs }
  }
}

export class WorkflowEditorState {
  private workflow: WorkflowDefinition

  constructor(initial: WorkflowDefinition) {
    this.workflow = structuredClone(initial)
  }

  getDefinition(): WorkflowDefinition {
    return structuredClone(this.workflow)
  }

  addNode(node: WorkflowNode): void {
    this.workflow.nodes.push(node)
  }

  updateNode(id: string, partial: Partial<Omit<WorkflowNode, "id">>): void {
    const node = this.workflow.nodes.find(n => n.id === id)
    if (!node) {
      return
    }
    if (partial.type !== undefined) {
      node.type = partial.type
    }
    if (partial.data !== undefined) {
      node.data = { ...node.data, ...partial.data }
    }
    if (partial.position !== undefined) {
      node.position = partial.position
    }
  }

  removeNode(id: string): void {
    this.workflow.nodes = this.workflow.nodes.filter(n => n.id !== id)
    this.workflow.edges = this.workflow.edges.filter(
      e => e.source !== id && e.target !== id
    )
  }

  addEdge(edge: WorkflowEdge): void {
    const exists = this.workflow.edges.some(e => e.id === edge.id)
    if (!exists) {
      this.workflow.edges.push(edge)
    }
  }

  removeEdge(id: string): void {
    this.workflow.edges = this.workflow.edges.filter(e => e.id !== id)
  }

  moveNode(id: string, position: Position): void {
    const node = this.workflow.nodes.find(n => n.id === id)
    if (!node) {
      return
    }
    node.position = position
  }
}

export abstract class BaseNode {
  readonly id: string
  readonly type: NodeType
  position: Position
  data: NodeData

  constructor(id: string, type: NodeType, position: Position, data: NodeData) {
    this.id = id
    this.type = type
    this.position = position
    this.data = data
  }

  abstract getDisplayName(): string
}

export abstract class BaseEdge {
  readonly id: string
  readonly sourceId: string
  readonly targetId: string

  constructor(id: string, sourceId: string, targetId: string) {
    this.id = id
    this.sourceId = sourceId
    this.targetId = targetId
  }

  abstract isDirected(): boolean
}


