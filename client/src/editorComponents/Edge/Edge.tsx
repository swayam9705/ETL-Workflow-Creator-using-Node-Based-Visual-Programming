<<<<<<< HEAD
import React, { type FC } from "react";
=======
import { type FC } from "react";
>>>>>>> 105a1b92e8841836cf971b7309f0fba1dffb7fa9
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
<<<<<<< HEAD
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
=======
    const curvature = 100
    const pathData = `M ${sourceX} ${sourceY} C ${sourceX + curvature} ${sourceY}, ${targetX - curvature} ${targetY}, ${targetX} ${targetY}`
    

    return (
        <path
            className="edge"
            d={pathData}
            fill="none"
            stroke="var(--color-accent-2)"
            strokeWidth="2"
            strokeDasharray="20,2"
>>>>>>> 105a1b92e8841836cf971b7309f0fba1dffb7fa9
        />
    )
}

export default Edge