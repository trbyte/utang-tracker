import React, { useState } from 'react';

export const ProfilePage = ({ onBack }) => {
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@utangtracker.pro',
    phone: '+63 917 123 4567',
    avatar: 'https://picsum.photos/seed/admin/200'
  });

  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    alert('Profile updated successfully!');
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      alert('Passwords do not match!');
      return;
    }
    alert('Password updated successfully!');
    setPasswordForm({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="flex flex-col gap-4 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HEADER */}
      <div className="flex items-center justify-between shrink-0 px-1">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
            <span 
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer transition-colors"
              onClick={onBack}
            >
              Dashboard
            </span>
            <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-xl">chevron_right</span>
            <span>Settings</span>
          </h1>
        </div>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-black text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back
        </button>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-12 gap-5">
        
        {/* LEFT COLUMN: ACCOUNT DETAILS (Span 7) */}
        <div className="col-span-7 flex flex-col gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ce2727] text-xl">person</span>
                Personal Information
              </h2>
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Administrator
              </span>
            </div>

            <form onSubmit={handleUpdateProfile} className="flex flex-col gap-5">
              {/* Avatar Row */}
              <div className="flex items-center gap-5">
                <div className="relative group shrink-0">
                  <img 
                    src={profile.avatar} 
                    alt="Profile" 
                    className="w-20 h-20 rounded-[24px] object-cover border-4 border-slate-50 dark:border-slate-800 shadow-md transition-transform group-hover:scale-105"
                  />
                  <button type="button" className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#ce2727] text-white rounded-full flex items-center justify-center shadow-md border-2 border-white dark:border-slate-900 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                  </button>
                </div>
                <div className="flex-1">
                  <ProfileInput 
                    label="Full Name" 
                    value={profile.name} 
                    onChange={(v) => setProfile({...profile, name: v})}
                    icon="badge"
                  />
                </div>
              </div>

              {/* Grid Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <ProfileInput 
                  label="Email Address" 
                  value={profile.email} 
                  onChange={(v) => setProfile({...profile, email: v})}
                  icon="alternate_email"
                />
                <ProfileInput 
                  label="Contact Number" 
                  value={profile.phone} 
                  onChange={(v) => setProfile({...profile, phone: v})}
                  icon="call"
                />
              </div>

              <div className="mt-2 flex justify-end">
                <button 
                  type="submit"
                  className="px-8 py-3.5 bg-[#ce2727] text-white rounded-xl text-xs font-black shadow-lg shadow-[#ce272733] hover:scale-105 active:scale-95 transition-all uppercase tracking-wide"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* 2FA Card */}
          <div className="bg-slate-800 rounded-[24px] p-5 text-white flex items-center justify-between shrink-0 shadow-lg shadow-slate-200 dark:shadow-none">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                 <span className="material-symbols-outlined text-xl">security</span>
              </div>
              <div>
                <h3 className="text-sm font-black">Two-Factor Auth</h3>
                <p className="text-xs text-slate-400 font-medium">Secure your account.</p>
              </div>
            </div>
            <button className="px-5 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-black transition-colors uppercase tracking-wide">
              Enable
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: SECURITY (Span 5) */}
        <div className="col-span-5 flex flex-col gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col">
            <h2 className="text-base font-black text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ce2727] text-xl">lock</span>
              Security
            </h2>

            <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
              <ProfileInput 
                label="Current Password" 
                type="password"
                value={passwordForm.current}
                onChange={(v) => setPasswordForm({...passwordForm, current: v})}
                icon="key"
                placeholder="••••••••"
              />
              <div className="h-[1px] bg-slate-50 dark:bg-slate-800 my-1"></div>
              <ProfileInput 
                label="New Password" 
                type="password"
                value={passwordForm.new}
                onChange={(v) => setPasswordForm({...passwordForm, new: v})}
                icon="lock_open"
                placeholder="New password"
              />
              <ProfileInput 
                label="Confirm Password" 
                type="password"
                value={passwordForm.confirm}
                onChange={(v) => setPasswordForm({...passwordForm, confirm: v})}
                icon="verified_user"
                placeholder="Confirm password"
              />

              <div className="mt-2 pt-2">
                <p className="text-[10px] text-slate-400 font-bold italic mb-3 leading-tight ml-1">
                  * Must be at least 8 chars with numbers.
                </p>
                <button 
                  type="submit"
                  className="w-full py-3.5 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-black hover:bg-slate-800 dark:hover:bg-slate-700 active:scale-95 transition-all uppercase tracking-wide"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 dark:bg-red-900/10 rounded-[24px] p-5 border border-red-100 dark:border-red-900/20 shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-red-600 dark:text-red-400">
                 <span className="material-symbols-outlined text-xl">warning</span>
               </div>
               <div>
                 <h3 className="text-sm font-black text-red-700 dark:text-red-400">Danger Zone</h3>
                 <p className="text-[10px] text-red-600/70 dark:text-red-400/60 font-bold">Delete account?</p>
               </div>
            </div>
            <button className="text-[10px] font-black text-white bg-red-600 px-4 py-2 rounded-xl hover:bg-red-700 transition-colors uppercase shadow-sm shadow-red-200 dark:shadow-none">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// INCREASED SIZES HERE:
// Label: text-[11px] (was 9px)
// Input: text-sm (was xs) + py-3 (was py-2.5)
// Icon: text-[20px] (was 16px)
const ProfileInput = ({ label, value, onChange, icon, type = "text", placeholder }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider ml-1">{label}</label>
    <div className="relative">
      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-[20px]">
        {icon}
      </span>
      <input 
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-bold text-slate-700 dark:text-white border border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-[#da9595] focus:ring-2 focus:ring-[#da9595]/10 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
      />
    </div>
  </div>
);