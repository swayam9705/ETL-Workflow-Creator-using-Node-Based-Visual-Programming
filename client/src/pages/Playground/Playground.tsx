
import { useState } from "react"
import "./Playground.css"

import Sidebar from "../../components/Sidebar/Sidebar"
import PlayCanvas from "../../components/PlayCanvas/PlayCanvas"
import Previewer from "../../components/Previewer/Previewer"
import { type ExecutionResult, type NodeType } from "../../engine/workflow"

const Playground = () => {
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null)
  const [selectedNodeType, setSelectedNodeType] = useState<NodeType | null>(null)

  return (
    <div className="playground">
      <div className="playground-container">
        <Sidebar onSelectNodeType={setSelectedNodeType} />
        <PlayCanvas
          selectedNodeType={selectedNodeType}
          onExecutionResultChange={setExecutionResult}
          onNodeTypeConsumed={() => setSelectedNodeType(null)}
        />
        <Previewer executionResult={executionResult} />
      </div>
    </div>
  )
}

export default Playground
