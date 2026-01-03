import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <>
            {/* 1. Global Override for Browser Autofill (Blue background fix) */}
            <style>{`
                input:-webkit-autofill,
                input:-webkit-autofill:hover, 
                input:-webkit-autofill:focus, 
                input:-webkit-autofill:active {
                    -webkit-box-shadow: 0 0 0 30px #0f172a inset !important; /* Dark Slate Background */
                    -webkit-text-fill-color: white !important; /* Force White Text */
                    transition: background-color 5000s ease-in-out 0s;
                    caret-color: white !important;
                }
            `}</style>

            <input
                {...props}
                type={type}
                className={
                    // 2. LAYOUT: 'w-full' makes it stretch to full width
                    'rounded-md shadow-sm transition-all duration-200 py-3 px-4 w-full block ' +
                    
                    // LIGHT MODE
                    'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 ' +
                    
                    // ACTIVE / FOCUS STATE (Red Highlight)
                    'focus:outline-none ' +
                    'focus:border-[#ce2727] ' + 
                    'focus:ring-[#ce2727] ' +   
                    'focus:ring-1 ' +

                    // DARK MODE
                    'dark:border-slate-700 dark:bg-slate-900/50 dark:text-white dark:placeholder:text-slate-500 ' +
                    'dark:focus:border-[#ce2727] dark:focus:ring-[#ce2727] ' +
                    'dark:focus:bg-slate-900 ' + 
                    
                    className
                }
                ref={localRef}
            />
        </>
    );
});