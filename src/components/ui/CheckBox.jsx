export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-[#ce2727]/30 bg-slate-800/60 text-[#ce2727] shadow-sm focus:ring-[#ce2727]/50 focus:border-[#ce2727]/50 ' +
                className
            }
        />
    );
}