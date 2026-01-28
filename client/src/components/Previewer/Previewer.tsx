import { useState } from "react"
import "./Previewer.css"
import { useWorkflow } from "../../contexts/WorkflowContext"

const Previewer = () => {
    const [ open, setOpen ] = useState(true)
    const { workflow } = useWorkflow()

    return (
        <div className={open ? "previewer" : "previewer close"}>
            <div className="previewer-btn">
                <button
                    className="toggle-btn"
                    onClick={() => setOpen(!open)} 
                >
                    { open ? ">>" : "<<"}
                </button>
            </div>
            <div className="previewer-title">Previewer</div>
            <div className="previewer-body">
                {
                    workflow.selectedNode ? 
                    (
                        <p>{ workflow.selectedNode._id }</p>
                    )
                    :
                    (<p className="previewer-guide">Select a Node to preview</p>)
                }
            </div>
        </div>
    )
}

export default Previewer