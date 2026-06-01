import React from "react";

export default function FormTextArea({ 
    label, 
    placeholder, 
    value, 
    onChange, 
    error,
    rows = 3,
    required = false
}) {
    return (
        <div className="sm:col-span-2">
            {label && (
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <textarea 
                placeholder={placeholder}
                rows={rows}
                value={value}
                onChange={onChange}
                className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 resize-none ${
                    error ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                }`}
            ></textarea>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}
