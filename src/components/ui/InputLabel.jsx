export default function InputLabel({ value, className = '', children, ...props }) {
    return (
        <label 
            {...props} 
            className={
                `block text-xs font-bold uppercase tracking-wider mb-1 ` +
                `text-slate-700 dark:text-slate-400 ` + 
                className
            }
        >
            {value ? value : children}
        </label>
    );
}