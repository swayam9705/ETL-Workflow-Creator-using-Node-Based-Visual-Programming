<<<<<<< HEAD
import { useState, type FC } from "react";
import type { NodeProps } from "../../types";
import { MdDownload } from "react-icons/md";
import "./OutputNode.css"

const OutputNode: FC<NodeProps> = ({ node }) => {
    const fileName = "output.csv"
    return (
        <div className="common-node-body outputnode-body">
            <div className="common-node-output-file-container">
                <span className="common-node-output-file">{ fileName }</span>
                <button
                    className="common-node-button" 
                ><MdDownload /></button>
            </div>
        </div>
=======
import type { FC } from "react";
import type { NodeProps } from "../../types";

const OutputNode: FC<NodeProps> = ({ node }) => {
    return (
        <>
            this is output node:  {node._id} 
        </>
>>>>>>> 105a1b92e8841836cf971b7309f0fba1dffb7fa9
    )
}

export default OutputNode