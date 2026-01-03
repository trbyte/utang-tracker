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
            <style>{`
                /* 1. LIGHT MODE (Default) */
                /* We use box-shadow to "paint" over the browser's yellow autofill background */
                input:-webkit-autofill,
                input:-webkit-autofill:hover, 
                input:-webkit-autofill:focus, 
                input:-webkit-autofill:active {
                    -webkit-box-shadow: 0 0 0 30px #f3f4f6 inset !important; /* Matches bg-gray-100 */
                    -webkit-text-fill-color: #0f172a !important; /* Matches text-slate-900 */
                    caret-color: #0f172a !important;
                }

                /* 2. DARK MODE (Applied when .dark class is present) */
                .dark input:-webkit-autofill,
                .dark input:-webkit-autofill:hover, 
                .dark input:-webkit-autofill:focus, 
                .dark input:-webkit-autofill:active {
                    -webkit-box-shadow: 0 0 0 30px #0f172a inset !important; /* Matches bg-slate-900 */
                    -webkit-text-fill-color: white !important;
                    caret-color: white !important;
                }
            `}</style>

            <input
                {...props}
                type={type}
                className={
                    // Layout & Base Styles
                    'rounded-md shadow-sm transition-all duration-200 py-3 px-4 w-full block ' +
                    
                    // LIGHT MODE: bg-gray-100 (#f3f4f6) matches the box-shadow above
                    'border-slate-300 bg-gray-100 text-slate-900 placeholder:text-slate-400 ' +
                    
                    // FOCUS STATE
                    'focus:outline-none focus:border-[#ce2727] focus:ring-[#ce2727] focus:ring-1 ' +

                    // DARK MODE: bg-slate-900 (#0f172a) matches the box-shadow above
                    'dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 ' +
                    'dark:focus:border-[#ce2727] dark:focus:ring-[#ce2727] ' +
                    
                    className
                }
                ref={localRef}
            />
        </>
    );
});