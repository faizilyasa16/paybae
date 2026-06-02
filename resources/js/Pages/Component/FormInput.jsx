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
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
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
                className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#52933e] transition-all bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500/70 ${
                    error ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                }`}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}
