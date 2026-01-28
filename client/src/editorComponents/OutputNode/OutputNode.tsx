import { useState, type FC } from "react";
import type { NodeProps } from "../../types";
import { MdDownload } from "react-icons/md";
import "./OutputNode.css"

const OutputNode: FC<NodeProps> = ({ node }) => {
    const fileName = "output.csv"
    return (
        <div className="common-node-body outputnode-body">
            <div className="common-node-output-file-container">
                <span className="common-node-output-file">{ node.data.fileData?.file && node.data.fileData?.file.name }</span>
                {
                    node.data.fileData?.file ? 
                    (<button
                        className="common-node-button" 
                    ><MdDownload /></button>)
                    : <span className="common-node-output-">No file available</span>
                }
            </div>
        </div>
    )
}

export default OutputNode