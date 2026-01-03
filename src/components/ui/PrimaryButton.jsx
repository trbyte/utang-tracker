export default function PrimaryButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={
                `inline-flex items-center gap-2 rounded-full bg-[#ce2727] px-6 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-red-900/20 transition duration-150 ease-in-out hover:bg-red-600 hover:shadow-red-600/40 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900 active:bg-red-700 ${
                    disabled && 'opacity-25 cursor-not-allowed'
                } ` + className
            }
        >
            {children}
        </button>
    );
}