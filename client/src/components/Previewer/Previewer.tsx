import { useState } from "react"
import "./Previewer.css"

const Previewer = () => {
    const [ open, setOpen ] = useState(true)

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
                <p className="previewer-guide">Select a Node to preview</p>
            </div>
        </div>
    )
}

export default Previewer