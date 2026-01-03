import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div 
                className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[32px] shadow-2xl shadow-black/50 border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-8 pt-8 pb-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="inline-flex items-center gap-2 rounded-full bg-[#ce2727]/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#ce2727] ring-1 ring-[#ce2727]/30">
                           Security
                        </div>
                        <button 
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                        {title}
                    </h2>
                </div>

                {/* Content */}
                <div className="px-8 pb-8">
                    {children}
                </div>
            </div>
        </div>
    );
}