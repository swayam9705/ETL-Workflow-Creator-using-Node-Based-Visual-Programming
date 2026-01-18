import React, { type FC } from "react";
import { type WorkflowNode } from "../../types";
import "./Edge.css"

interface EdgeProps {
    source: WorkflowNode
    target: WorkflowNode
}

const Edge: FC<EdgeProps> = ({ source, target }) => {
    // offset to center the line on the ports (assume node width/height)
    // might want to pass node dimensions or use refs to get exact port locations
    const sourceX = source.position.x + 300 // Assuming node width
    const sourceY = source.position.y + 25  // Center height
    const targetX = target.position.x
    const targetY = target.position.y + 25

    // curvature logic (bezier curve cubic)
    const curvature = 75
    const pathData = `M ${sourceX} ${sourceY} C ${sourceX + curvature} ${sourceY}, ${targetX - curvature} ${targetY}, ${targetX} ${targetY}`
    
    const handleClick = (e: React.MouseEvent) => {
        console.log(e.type)
    }

    return (
        <path
            onClick={handleClick}
            className="edge"
            d={pathData}
            strokeDasharray="5,5"
        />
    )
}

export default Edge