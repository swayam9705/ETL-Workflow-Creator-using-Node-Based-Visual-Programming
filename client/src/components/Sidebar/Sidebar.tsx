import { useState } from "react"
import Logo from "../../images/logo.svg"

import "./Sidebar.css"

import { LuFileInput } from "react-icons/lu"
import { IoSettingsOutline } from "react-icons/io5"
import { HiLightningBolt } from "react-icons/hi"
import { type NodeType } from "../../engine/workflow"

interface SidebarProps {
  onSelectNodeType?: (type: NodeType) => void
}

const Sidebar = ({ onSelectNodeType }: SidebarProps) => {
  const [open] = useState<boolean>(true)

  return (
    <div className={open ? "sidebar" : "sidebar close"}>
      <div className="sidebar-btn" />
      <div className="sidebar-logo logo-container">
        <img src={Logo} alt="" />
        <span className="navbar-logo-name">NodeFlow</span> <br />
      </div>
      <div className="sidebar-contents">
        <div className="sidebar-part">
          <div className="sidebar-part-title">Input</div>
          <ul className="sidebar-part-nodes">
            <li className="sidebar-part-node-item">
              <button
                type="button"
                onClick={() => onSelectNodeType && onSelectNodeType("csvInput")}
              >
                <span className="icon">
                  <LuFileInput />
                </span>
                File Input Node
              </button>
            </li>
          </ul>
        </div>

        <div className="sidebar-part">
          <div className="sidebar-part-title">Transformation</div>
          <ul className="sidebar-part-nodes">
            <li className="sidebar-part-node-item">
              <button
                type="button"
                onClick={() => onSelectNodeType && onSelectNodeType("filter")}
              >
                <span className="icon">
                  <IoSettingsOutline />
                </span>
                Filter
              </button>
            </li>
          </ul>
        </div>

        <div className="sidebar-part">
          <div className="sidebar-part-title">Output</div>
          <ul className="sidebar-part-nodes">
            <li className="sidebar-part-node-item">
              <button
                type="button"
                onClick={() => onSelectNodeType && onSelectNodeType("output")}
              >
                <span className="icon">
                  <HiLightningBolt />
                </span>
                Result
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
