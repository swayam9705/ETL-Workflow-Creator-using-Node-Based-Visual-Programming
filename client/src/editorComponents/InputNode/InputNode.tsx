import React, { type FC, useState, useRef } from "react"
import type { NodeProps } from "../../types"
import { useWorkflow } from "../../contexts/WorkflowContext"
import "./InputNode.css"

import { MdOutlineFileUpload } from "react-icons/md"
import { ImCross } from "react-icons/im"

const InputNode: FC<NodeProps> = ({ node }) => {
    
    // node file state
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [ file, setFile ] = useState<File | null>(null)

    const { updateNode } = useWorkflow()

    

    const handleDeleteFile = (e: React.MouseEvent) => {
        e.stopPropagation()
        setFile(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
        updateNode(node._id, {
            fileData: {
                filename: '',
                fileContent: '',
                fileFormat: 'NA',
                file: null
            }
        })
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files[0])
        updateNode(node._id, {
            fileData: {
                file: e.target.files[0]
            }
        })
    }

    return (
        <div className="common-node-body inputnode-body">
            {
                file ? 
                <div className="inputnode-file-details">
                    <span className="inputnode-file-name">{file.name}</span>
                    <button
                        className="common-node-button"
                        onClick={handleDeleteFile}
                    ><ImCross /></button>
                </div> :
            
                <div className="common-node-upload">
                    <input
                        ref={fileInputRef}
                        type="file"
                        name={`file-input-${node._id}`}
                        id={`file-input-${node._id}`}
                        className="common-node-file-input"
                        onChange={handleFileChange}
                    />
                    <div
                        className="inputnode-file-info"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <span className="common-node-icon"><MdOutlineFileUpload /></span>
                        <span className="inputnode-upload-text">No file uploaded</span>
                    </div>
                </div>
            }
            {/* <select className="common-node-select" defaultValue="file format">
                <option value="">file format</option>
                <option value="csv">csv</option>
                <option value="json">json</option>
                <option value="xml">xml</option>
            </select> */}
        </div>
    )

}

export default InputNode