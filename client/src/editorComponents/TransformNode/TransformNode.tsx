import { useEffect, useState, useRef, type FC } from "react";
import { TransformType, Operator, type NodeProps } from "../../types";
import { useWorkflow } from "../../contexts/WorkflowContext";
import { HiMiniChevronUpDown } from "react-icons/hi2";

import "./TransformNode.css"
import { useInputFile } from "../../contexts/InputFileContext";

const TransformNode: FC<NodeProps> = ({ node }) => {
    
    const { workflow, updateNode } = useWorkflow()
    const { file, getCSVColumns } = useInputFile()
    const [ min, setMin ] = useState(false)

    const [ transform, setTransform ] = useState({
        transformType: 'NA',
        columnName: '',
        condition: '',
        targetValue: ''
    })

    const [ columnNames, setColumns ] = useState<string[]>([])

    const handleTransformChange = (e: React.ChangeEvent<HTMLSelectElement|HTMLInputElement>) => {
        setTransform(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
        updateNode(node._id, {
            [e.target.name]: e.target.value
        })
    }

    const toggleNode = (e: React.MouseEvent<HTMLButtonElement>) => {
        setMin(prev => !prev)
    }

    useEffect(() => {
        if (file) {
            getCSVColumns()
                .then(data => setColumns(data))
                .catch(err => console.log(err))
        }
    }, [file])

    return (
        <div
            className={`common-node-body transformnode-body ${min && 'close'}`}
        >
            <div className="common-node-select-container">
                <label
                    htmlFor="transformType"
                    className="common-node-label"
                >Select Transformation</label>
                <select
                    name="transformType"
                    // id="transformtype"
                    className="common-node-select"
                    defaultValue="transform"
                    onChange={handleTransformChange}
                >
                    {
                        Object.values(TransformType).map(type => <option key={type} value={type}>{ type }</option>)
                    }
                </select>
            </div>
            <div className="common-node-input-container">
                <label
                    htmlFor="columnName"
                    className="common-node-label"
                >Column Name</label>
                <select
                    name="columnName"
                    id="columnName"
                    className="common-node-select"
                >
                    {
                        file && columnNames.map(col => <option key={col} value={col}>{ col }</option>)
                    }
                </select>
            </div>
            <div className="common-node-select-container">
                <label
                    htmlFor="columnType"
                    className="common-node-label"
                >Column Type</label>
                <select
                    name="columnType"
                    id="columnType"
                    className="common-node-select"
                    defaultValue="string"
                    onChange={handleTransformChange}
                >
                    <option value="string">String</option>
                    <option value="numeric">Numeric</option>
                </select>
            </div>
            <div className="common-node-input-container">
                <label htmlFor="targetValue">Target Value</label>
                <input
                    type="text"
                    name="targetValue"
                    className="common-node-input"
                    onChange={handleTransformChange}
                />
            </div>
            <button
                onClick={toggleNode} 
                className="transformnode-body-toggle-btn"
            ><HiMiniChevronUpDown /></button>
        </div>
    )
}

export default TransformNode