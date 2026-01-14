import type React from "react"
import { useMemo, useState } from "react"

import {
  type ExecutionResult,
  type DataFrame,
  type WorkflowDefinition,
  type NodeType,
  type WorkflowNode,
  WorkflowExecutionEngine
} from "../../engine/workflow"

import "./PlayCanvas.css"

interface PlayCanvasProps {
  selectedNodeType: NodeType | null
  onExecutionResultChange?: (result: ExecutionResult | null) => void
  onNodeTypeConsumed?: () => void
}

const PlayCanvas = ({
  selectedNodeType,
  onExecutionResultChange,
  onNodeTypeConsumed
}: PlayCanvasProps) => {
  const [isGrabbing, setGrabbing] = useState<boolean>(false)
  const [lastResult, setLastResult] = useState<ExecutionResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null)
  const [connectingFromNodeId, setConnectingFromNodeId] = useState<string | null>(null)

  const initialDefinition: WorkflowDefinition = useMemo(
    () => ({
      nodes: [],
      edges: []
    }),
    []
  )

  const [definition, setDefinition] = useState<WorkflowDefinition>(initialDefinition)

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (selectedNodeType) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const newNode: WorkflowNode = {
        id: `n-${Date.now()}`,
        type: selectedNodeType,
        data: {},
        position: { x, y }
      }
      setDefinition(prev => ({
        ...prev,
        nodes: [...prev.nodes, newNode]
      }))
      if (onNodeTypeConsumed) {
        onNodeTypeConsumed()
      }
      return
    }
    setGrabbing(true)
  }

  const handleNodeMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    nodeId: string
  ) => {
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const offsetY = e.clientY - rect.top
    setDraggingNodeId(nodeId)
    setDragOffset({ x: offsetX, y: offsetY })
  }

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (draggingNodeId && dragOffset) {
      const canvasRect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - canvasRect.left - dragOffset.x
      const y = e.clientY - canvasRect.top - dragOffset.y
      setDefinition(prev => ({
        ...prev,
        nodes: prev.nodes.map(node =>
          node.id === draggingNodeId ? { ...node, position: { x, y } } : node
        )
      }))
      return
    }

    if (!isGrabbing) {
      return
    }
    const board = e.currentTarget
    const docWidth = document.documentElement.clientWidth
    const docHeight = document.documentElement.clientHeight

    if (board.offsetLeft <= 0) {
      board.style.left = `${e.movementX + board.offsetLeft}px`
    } else {
      board.style.left = "0px"
    }

    if (board.offsetLeft >= docWidth - 2000) {
      board.style.left = `${e.movementX + board.offsetLeft}px`
    } else {
      board.style.left = `${docWidth - 2000}px`
    }

    if (board.offsetTop <= 0) {
      board.style.top = `${e.movementY + board.offsetTop}px`
    } else {
      board.style.top = "0px"
    }

    if (board.offsetTop > docHeight - 2000) {
      board.style.top = `${e.movementY + board.offsetTop}px`
    } else {
      board.style.top = `${docHeight - 2000}px`
    }
  }

  const handleCanvasMouseUp = () => {
    setGrabbing(false)
    setDraggingNodeId(null)
    setDragOffset(null)
  }

  const handlePortMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    nodeId: string,
    kind: "source" | "target"
  ) => {
    e.stopPropagation()
    if (kind === "source") {
      setConnectingFromNodeId(nodeId)
      return
    }
    if (kind === "target" && connectingFromNodeId && connectingFromNodeId !== nodeId) {
      const edgeId = `e-${connectingFromNodeId}-${nodeId}-${Date.now()}`
      setDefinition(prev => ({
        ...prev,
        edges: [...prev.edges, { id: edgeId, source: connectingFromNodeId, target: nodeId }]
      }))
      setConnectingFromNodeId(null)
    }
  }

  const handleExecute = async () => {
    setIsRunning(true)
    try {
      const engine = new WorkflowExecutionEngine()
      const logs: string[] = []
      const ctx = {
        log: (message: string) => {
          logs.push(message)
        }
      }
      const result = await engine.execute(definition, ctx)
      const outputNodeIds = definition.nodes
        .filter(n => n.type === "output")
        .map(n => n.id)
      const outputs: Record<string, DataFrame> = {}
      for (const nodeId of outputNodeIds) {
        const frames = result.nodeOutputs[nodeId]
        if (frames && frames.length > 0) {
          outputs[nodeId] = frames[0]
        }
      }
      const enriched: ExecutionResult = {
        nodeOutputs: result.nodeOutputs
      }
      setLastResult(enriched)
      if (onExecutionResultChange) {
        onExecutionResultChange(enriched)
      }
      console.log("Workflow logs:", logs)
      console.log("Workflow outputs:", outputs)
    } catch (error) {
      console.error("Workflow execution failed", error)
      setLastResult(null)
      if (onExecutionResultChange) {
        onExecutionResultChange(null)
      }
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="playcanvas-container">
      <div
        className={isGrabbing ? "playcanvas grabbing" : "playcanvas"}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
      >
        <button
          type="button"
          className="execute-btn"
          onClick={handleExecute}
          disabled={isRunning}
        >
          {isRunning ? "Executing..." : "Execute Workflow"}
        </button>
        {lastResult && (
          <div className="last-result-summary">
            <span>Executed nodes: {Object.keys(lastResult.nodeOutputs).length}</span>
          </div>
        )}
        <svg className="edges-layer">
          {definition.edges.map(edge => {
            const source = definition.nodes.find(n => n.id === edge.source)
            const target = definition.nodes.find(n => n.id === edge.target)
            if (!source || !target) {
              return null
            }
            const x1 = source.position.x + 100
            const y1 = source.position.y + 20
            const x2 = target.position.x
            const y2 = target.position.y + 20
            return (
              <line
                key={edge.id}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className="edge-line"
              />
            )
          })}
        </svg>
        {definition.nodes.map(node => (
          <div
            key={node.id}
            className="node"
            style={{ left: node.position.x, top: node.position.y }}
            onMouseDown={e => handleNodeMouseDown(e, node.id)}
          >
            <div className="node-title">{node.type}</div>
            <div className="node-ports">
              <div
                className="node-port node-port-out"
                onMouseDown={e => handlePortMouseDown(e, node.id, "source")}
              />
              <div
                className="node-port node-port-in"
                onMouseDown={e => handlePortMouseDown(e, node.id, "target")}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PlayCanvas
