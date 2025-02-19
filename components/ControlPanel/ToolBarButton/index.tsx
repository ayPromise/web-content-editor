import React from "react";

interface ToolbarButtonProps {
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ isActive, onClick, children }) => {
    return (
        <span className={`stylingButton ${isActive ? "active" : ""}`} onClick={onClick}>
            {children}
        </span>
    );
};

export default ToolbarButton;
