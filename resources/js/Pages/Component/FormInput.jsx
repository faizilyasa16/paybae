import React from "react";

export default function FormInput({ 
    label, 
    labelRight,
    type = "text", 
    placeholder, 
    value, 
    onChange, 
    error,
    required = false
}) {
    return (
        <div>
            {(label || labelRight) && (
                <div className="flex justify-between items-center mb-1.5">
                    {label && (
                        <label className="block text-sm font-semibold text-slate-700">
                            {label} {required && <span className="text-red-500">*</span>}
                        </label>
                    )}
                    {labelRight && <div>{labelRight}</div>}
                </div>
            )}
            <input 
                type={type} 
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all bg-slate-50 focus:bg-white ${
                    error ? 'border-red-500' : 'border-slate-200'
                }`}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}
