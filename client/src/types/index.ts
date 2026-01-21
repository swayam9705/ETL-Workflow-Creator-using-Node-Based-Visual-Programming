export type NodeType = 'input' | 'transform' | 'output'

export type FileFormat = 'csv' | 'json' | 'xml' | 'NA'

<<<<<<< HEAD
export enum TransformType {
    FILTER = "FILTER",
    DROP_COLUMN = "DROP_COLUMN",
    RENAME_COLUMN = "RENAME_COLUMN",
    NORMALIZE = "NORMALIZE",
    FILL_NA = "FILL_NA",
    TRIM = "TRIM",
    TO_UPPER = "TO_UPPER",
    TO_LOWER = "TO_LOWER"
}
=======
export type TransformType = 'normalize' | 'filter' | 'map' | 'drop_column' | 'NA'
>>>>>>> 105a1b92e8841836cf971b7309f0fba1dffb7fa9

export interface Position {
    x: number
    y: number
}

export interface IFile {
    filename: string,
    fileContent: string,
    fileFormat: string
}

export interface InputNodeData {
    file: IFile
}

export interface TransformNodeData {
    transformType: TransformType
<<<<<<< HEAD
    columnName: string
    condition?: string // Used for operations like 'filter'
    targetValue?: string // Used for RENAME or FILL_NA
=======
    column: string
    condition: string
>>>>>>> 105a1b92e8841836cf971b7309f0fba1dffb7fa9
}

export interface OutputNodeData {
    file: IFile
}

// this interface is common for all the nodes
export interface WorkflowNode {
    readonly _id: string
    type: NodeType
    position: Position
    data: InputNodeData | TransformNodeData | OutputNodeData
}

// only to be passed as the argument for FC
export interface NodeProps {
    node: WorkflowNode
}

export interface WorkflowEdge {
    readonly _id: string
    source: WorkflowNode
    target: WorkflowNode
}

export interface WorkflowDefinition {
    nodes: WorkflowNode[]
    edges: WorkflowEdge[]
}

export interface Workflow {
    readonly _id: string
    name: string
<<<<<<< HEAD
    selectedNode?: WorkflowNode | null
=======
>>>>>>> 105a1b92e8841836cf971b7309f0fba1dffb7fa9
    activeSourceNode: WorkflowNode | null
    definition: WorkflowDefinition
}