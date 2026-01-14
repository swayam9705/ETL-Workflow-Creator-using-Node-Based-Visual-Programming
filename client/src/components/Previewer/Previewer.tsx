import { useState } from "react"
import "./Previewer.css"

import { type ExecutionResult } from "../../engine/workflow"

interface PreviewerProps {
  executionResult: ExecutionResult | null
}

const Previewer = ({ executionResult }: PreviewerProps) => {
  const [open, setOpen] = useState(true)

  const outputEntries =
    executionResult?.nodeOutputs ? Object.entries(executionResult.nodeOutputs) : []

  const firstOutputFrame =
    outputEntries.length > 0 && outputEntries[outputEntries.length - 1][1][0]
      ? outputEntries[outputEntries.length - 1][1][0]
      : null

  return (
    <div className={open ? "previewer" : "previewer close"}>
      <div className="previewer-btn">
        <button
          className="toggle-btn"
          onClick={() => setOpen(!open)}
        >
          {open ? ">>" : "<<"}
        </button>
      </div>
      <div className="previewer-content">
        {firstOutputFrame ? (
          <pre>{JSON.stringify(firstOutputFrame, null, 2)}</pre>
        ) : (
          <span>No execution result yet</span>
        )}
      </div>
    </div>
  )
}

export default Previewer
