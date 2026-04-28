import React from "react";

export default function PrimaryButton({ 
    children, 
    disabled, 
    type = "submit",
    className = ""
}) {
    return (
        <button 
            type={type} 
            disabled={disabled}
            className={`w-full bg-gradient-to-r from-[#61a94a] to-[#4e8d3b] hover:from-[#5b9e45] hover:to-[#467d35] text-white font-bold py-4 rounded-xl shadow-lg shadow-green-600/30 hover:shadow-green-600/40 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
        >
            {children}
        </button>
    );
}
