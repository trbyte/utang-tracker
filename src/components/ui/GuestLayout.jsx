import { motion } from 'framer-motion';

export default function GuestLayout({ children, isDarkMode, toggleDarkMode }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 py-6 transition-colors duration-300 flex items-center justify-center relative">
            
            {/* Theme Toggle Button (Top Right) */}
            <button 
                onClick={toggleDarkMode}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/80 dark:bg-slate-800/80 shadow-lg backdrop-blur ring-1 ring-slate-200 dark:ring-slate-700 text-slate-600 dark:text-yellow-400 hover:scale-110 transition-all z-50"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
                <span className="material-symbols-outlined text-xl font-bold">
                    {isDarkMode ? 'light_mode' : 'dark_mode'}
                </span>
            </button>

            {/* INCREASED MAX-WIDTH to 6xl and WIDENED RIGHT COLUMN */}
            <div className="w-full max-w-6xl grid grid-cols-1 gap-5 rounded-[32px] bg-white/80 dark:bg-slate-900/80 p-5 shadow-2xl shadow-black/20 dark:shadow-black/60 backdrop-blur border border-slate-200 dark:border-[#ce2727]/20 lg:grid-cols-[1fr_minmax(400px,500px)] transition-all duration-300">
                
                {/* Left Side: Decorative Image Section */}
                <div className="relative hidden overflow-hidden rounded-[24px] bg-slate-100 dark:bg-slate-800/40 lg:block">
                    <div
                        className="absolute inset-0 bg-gradient-to-br from-[#ce2727]/10 via-slate-200/50 to-slate-100/90 dark:from-[#ce2727]/20 dark:via-slate-900/80 dark:to-slate-950/90"
                        aria-hidden="true"
                    />
                    <div
                        className="absolute inset-0 scale-105 bg-cover bg-center opacity-40 dark:opacity-30 mix-blend-multiply dark:mix-blend-normal"
                        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1400&q=80')` }}
                        aria-hidden="true"
                    />
                    <div className="relative z-10 flex h-full flex-col justify-between p-8 text-slate-800 dark:text-white">
                        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-[#ce2727] font-bold">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#ce2727]/10 ring-1 ring-[#ce2727]/30 backdrop-blur">
                                ₱
                            </span>
                            Utang Tracker
                        </div>
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/40 dark:bg-[#ce2727]/15 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#ce2727] ring-1 ring-[#ce2727]/30 backdrop-blur">
                                Smart Debt Management
                            </div>
                            <p className="text-3xl font-black leading-tight text-slate-900 dark:text-[#ce2727] drop-shadow-sm dark:drop-shadow-[0_0_25px_rgba(206,39,39,0.45)]">
                                Keep track of who owes you, <span className="text-[#ce2727] dark:text-white">and notify them.</span>
                            </p>
                            <p className="max-w-sm text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                                Sign in or create an account to start managing your transactions and keep your financial relationships healthy.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form Section */}
                <motion.div 
                    className="flex flex-col gap-6 rounded-[24px] bg-white dark:bg-slate-800/60 p-8 shadow-xl shadow-slate-200/50 dark:shadow-black/60 ring-1 ring-slate-200 dark:ring-[#ce2727]/20 backdrop-blur"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <div className="flex items-center gap-3">
                        <div className="group inline-flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-[#ce2727] flex items-center justify-center shadow-lg shadow-red-600/20 dark:shadow-red-900/40 text-white font-black text-lg rotate-3 group-hover:rotate-6 transition-transform">
                                U
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#ce2727]">
                                    Finance App
                                </span>
                                <span className="text-lg font-black text-slate-900 dark:text-slate-100">
                                    Dashboard
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    {children}

                </motion.div>
            </div>
        </div>
    );
}