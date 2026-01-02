
import React from 'react';

export const Navbar = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between z-10 shrink-0 transition-colors">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-[#ce2727] rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-xl">payments</span>
        </div>
        <span className="text-xl font-black tracking-tight text-slate-800 dark:text-white">
          UTANG<span className="text-[#ce2727]">TRACKER</span>
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleDarkMode}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          <span className="material-symbols-outlined">
            {isDarkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400">
          <span className="material-symbols-outlined">info</span>
        </button>
        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400 relative">
          <span className="material-symbols-outlined">mail</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#ce2727] rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>
        
        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>

        <div className="flex items-center gap-3 pl-2 pr-1 py-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full cursor-pointer transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 hidden sm:inline">Admin User</span>
          <img 
            src="https://picsum.photos/seed/admin/100" 
            alt="User Avatar" 
            className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm"
          />
        </div>
      </div>
    </header>
  );
};
