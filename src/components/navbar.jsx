import React, { useState, useMemo } from 'react';
import { supabase } from '../supabaseClient'; // Import Supabase
import { TransactionStatus } from '../types';

export const Navbar = ({ isDarkMode, toggleDarkMode, transactions = [], onNavigate, userProfile }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  // New: Handle Logout Function
  const handleLogout = async () => {
      try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          // The App.jsx listener will automatically detect the session change
          // and redirect the user to the Login screen.
      } catch (error) {
          console.error('Error logging out:', error.message);
      }
  };

  const notifications = useMemo(() => {
    const list = [];
    transactions.forEach(t => {
      list.push({
        id: t.id + '_added',
        type: 'added',
        user: t.name,
        amount: t.amount,
        time: t.dateBorrowed,
        rawDate: new Date(t.dateBorrowed),
        avatar: t.avatar
      });

      if (t.status === TransactionStatus.COMPLETED && t.datePaid) {
        list.push({
          id: t.id + '_paid',
          type: 'paid',
          user: t.name,
          amount: t.amount,
          time: t.datePaid,
          rawDate: new Date(t.datePaid),
          avatar: t.avatar
        });
      }
    });

    return list.sort((a, b) => b.rawDate - a.rawDate);
  }, [transactions]);

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between z-50 shrink-0 transition-colors relative">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate && onNavigate('DASHBOARD')}>
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
        
        {/* INFO BUTTON */}
        <div className="relative hidden sm:block">
          <button 
            onClick={() => setIsInfoOpen(!isInfoOpen)}
            className={`p-2 rounded-full transition-colors relative ${isInfoOpen ? 'bg-slate-100 dark:bg-slate-800 text-[#ce2727]' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400'}`}
          >
            <span className="material-symbols-outlined">info</span>
          </button>

          {isInfoOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsInfoOpen(false)}></div>
              <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-5 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right text-left">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-[#ce2727]/10 rounded-lg flex items-center justify-center text-[#ce2727]">
                    <span className="material-symbols-outlined text-lg">info</span>
                  </div>
                  <h3 className="font-black text-slate-800 dark:text-white text-sm uppercase tracking-wide">About App</h3>
                </div>
                
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  <strong>UtangTracker</strong> is a simple and efficient tool designed to help you manage personal debts and loans. Keep track of who owes you and who you owe with ease.
                </p>

                {/* Under Development Note */}
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-xl p-3 mb-4">
                  <div className="flex gap-2 items-start">
                    <span className="material-symbols-outlined text-amber-500 text-sm mt-0.5">construction</span>
                    <p className="text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wide">Under Development</p>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 pl-6">
                    Features may change. Please report any bugs you encounter.
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Developer Contact</p>
                  <a href="mailto:developer@utangtracker.com" className="text-xs font-bold text-[#ce2727] hover:underline flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">mail</span>
                    developer@utangtracker.com
                  </a>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="relative group">
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400 relative">
            <span className="material-symbols-outlined">notifications</span>
            {notifications.length > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#ce2727] rounded-full border border-white dark:border-slate-900"></span>
            )}
          </button>

          <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-2 hidden group-hover:block animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
            <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1 flex justify-between items-center">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recent Updates</p>
               <span className="text-[10px] font-bold text-[#ce2727] bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full">{notifications.length} New</span>
            </div>
            
            <div className="max-h-[300px] overflow-y-auto custom-scroll flex flex-col gap-1">
              {notifications.length > 0 ? (
                notifications.map(notif => (
                  <div key={notif.id} className="flex items-start gap-3 p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-default">
                    <div className="relative shrink-0">
                      <img src={notif.avatar} className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700" alt="" />
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center border border-white dark:border-slate-900 ${notif.type === 'paid' ? 'bg-green-500' : 'bg-blue-500'}`}>
                        <span className="material-symbols-outlined text-[10px] text-white">
                          {notif.type === 'paid' ? 'check' : 'add'}
                        </span>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-tight">
                        <span className="font-bold text-slate-800 dark:text-white">{notif.user}</span>
                        {notif.type === 'paid' ? ' paid their debt of ' : ' added a new debt of '}
                        <span className="font-black text-slate-800 dark:text-white">₱{notif.amount.toLocaleString()}</span>
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{notif.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-slate-400 text-xs">No recent notifications</div>
              )}
            </div>
          </div>
        </div>

        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400 relative">
          <span className="material-symbols-outlined">mail</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#ce2727] rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>
        
        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 pl-2 pr-1 py-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full cursor-pointer transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 select-none"
          >
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 hidden sm:inline">
              {userProfile?.name || 'Admin User'}
            </span>
            <img 
              src={userProfile?.avatar || 'https://picsum.photos/seed/admin/100'} 
              alt="User Avatar" 
              className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm"
            />
          </div>

          {isDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
              
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">My Account</p>
                </div>
                
                <button 
                  onClick={() => { setIsDropdownOpen(false); onNavigate && onNavigate('PROFILE'); }}
                  className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2.5"
                >
                  <span className="material-symbols-outlined text-[18px] text-slate-400">person</span>
                  Profile
                </button>
                
                {/* Updated Logout Button */}
                <button 
                  onClick={() => {
                      setIsDropdownOpen(false);
                      handleLogout(); // Call the logout function here
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs font-bold text-[#ce2727] hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center gap-2.5"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};