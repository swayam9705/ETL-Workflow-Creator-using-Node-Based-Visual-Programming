import { useEffect, useState, type FC } from "react";
import { TransformType, type NodeProps } from "../../types";
import { useWorkflow } from "../../contexts/WorkflowContext";

const TransformNode: FC<NodeProps> = ({ node }) => {
    
    const { updateNode } = useWorkflow()

    const [ transform, setTransform ] = useState({
        transformType: 'NA',
        columnName: '',
        condition: '',
        targetValue: ''
    })

    const handleTransformChange = (e: React.ChangeEvent<HTMLSelectElement|HTMLInputElement>) => {
        setTransform(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
        updateNode(node._id, {
            [e.target.name]: e.target.value
        })
    }

    const transformations = Object.values(TransformType).map(type => type)

    return (
        <div className="common-node-body transformnode-body">
            <div className="common-node-select-container">
                <label htmlFor="transformType" className="common-node-label">Select Transformation</label>
                <select
                    name="transformType"
                    className="common-node-select"
                    defaultValue="transform"
                    onChange={handleTransformChange}
                >
                    {
                        transformations.map(type => <option key={type} value={type}>{ type }</option>)
                    }
                </select>
            </div>
            <div className="common-node-input-container">
                <label htmlFor="columnName" className="common-node-label">Column Name</label>
                <input
                    className="common-node-input"
                    type="text"
                    name="columnName"
                    placeholder="Eg. `salary`"
                    onChange={handleTransformChange}
                />
            </div>
            <div className="common-node-input-container">
                <label htmlFor="condition" className="common-node-label">Condition</label>
                <input
                    className="common-node-input"
                    type="text"
                    name="condition"
                    placeholder="Eg. age >= 20"
                    onChange={handleTransformChange}
                />
            </div>
        </div>
    )
}

export default TransformNode