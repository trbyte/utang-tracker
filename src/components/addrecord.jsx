import React, { useState, useMemo, useEffect, useRef } from 'react';
import { TransactionStatus } from '../types';
import { supabase } from '../supabaseClient';

const getCurrentPHDateTime = () => {
  const now = new Date();
  const phString = now.toLocaleString("en-US", { timeZone: "Asia/Manila", hour12: false });
  const phDate = new Date(phString);

  const year = phDate.getFullYear();
  const month = String(phDate.getMonth() + 1).padStart(2, '0');
  const day = String(phDate.getDate()).padStart(2, '0');
  const hours = String(phDate.getHours()).padStart(2, '0');
  const minutes = String(phDate.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const AddRecordModal = ({ onClose, onSave, transactions = [], initialData = null }) => {
  const [mode, setMode] = useState('new');
  const fileInputRef = useRef(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const uniqueDebtors = useMemo(() => {
    const map = new Map();
    transactions.forEach(t => {
      if (t.name && !map.has(t.name)) {
        map.set(t.name, {
          name: t.name,
          email: t.email,
          phone: t.phone,
          avatar: t.avatar
        });
      }
    });
    return Array.from(map.values());
  }, [transactions]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    amount: '',
    date: getCurrentPHDateTime(), 
    notes: '',
    avatar: null 
  });

  useEffect(() => {
    if (initialData) {
      setMode('new'); 
      const parsedDate = new Date(initialData.dateBorrowed);
      const dateString = !isNaN(parsedDate) 
        ? new Date(parsedDate.getTime() - (parsedDate.getTimezoneOffset() * 60000)).toISOString().slice(0, 16)
        : getCurrentPHDateTime();

      setFormData({
        name: initialData.name,
        email: initialData.email || '',
        phone: initialData.phone || '',
        amount: initialData.amount,
        date: dateString,
        notes: initialData.notes || '',
        avatar: initialData.avatar
      });
    }
  }, [initialData]);

  const handleExistingSelect = (e) => {
    const selectedName = e.target.value;
    const existingDebtor = uniqueDebtors.find(d => d.name === selectedName);
    
    if (existingDebtor) {
      setFormData(prev => ({
        ...prev,
        name: selectedName,
        email: existingDebtor.email || '',
        phone: existingDebtor.phone || '',
        avatar: existingDebtor.avatar
      }));
      setAvatarFile(null);
    } else {
      setFormData(prev => ({ ...prev, name: selectedName }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadToSupabase = async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Using default instead.');
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      let finalAvatarUrl = formData.avatar;
      if (avatarFile) {
        const uploadedUrl = await uploadToSupabase(avatarFile);
        if (uploadedUrl) finalAvatarUrl = uploadedUrl;
      }
      else if (!finalAvatarUrl) {
        finalAvatarUrl = "https://ui-avatars.com/api/?name=" + encodeURIComponent(formData.name) + "&background=random";
      }

      const record = {
        id: initialData?.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        amount: parseFloat(formData.amount),
        dateBorrowed: new Date(formData.date).toISOString(),
        status: initialData?.status || TransactionStatus.PENDING,
        notes: formData.notes,
        avatar: finalAvatarUrl
      };
      
      await onSave(record);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  // CHANGED: Reduced padding from p-4 to p-3, and font size text-sm is kept but visually tighter
  const inputClasses = "w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-sm font-semibold text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ce2727] focus:border-transparent transition-all";
  const labelClasses = "text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider ml-1 mb-1 block";

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-[90%] sm:max-w-md rounded-[24px] shadow-2xl shadow-black/50 overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col ring-1 ring-white/10">
        
        {/* Header - Reduced Padding */}
        <div className="p-4 bg-gradient-to-r from-[#ce2727] to-[#a51d1d] text-white flex justify-between items-start shrink-0 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10">
            <h2 className="text-lg sm:text-xl font-black tracking-tight">{initialData ? 'Edit Transaction' : 'New Transaction'}</h2>
            <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mt-0.5">
              {initialData ? 'Update record details' : 'Add a new debt record'}
            </p>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-all text-white relative z-10">
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        <div className="overflow-y-auto custom-scroll flex-1 bg-white dark:bg-slate-900">
          {!initialData && (
            <div className="px-4 pt-4">
              <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex font-bold text-[10px] relative shadow-inner">
                <button 
                  type="button"
                  onClick={() => { setMode('new'); setFormData(prev => ({ ...prev, name: '', avatar: null })); }}
                  className={`flex-1 py-2 rounded-lg transition-all duration-200 z-10 flex items-center justify-center gap-1.5 ${mode === 'new' ? 'bg-white dark:bg-slate-700 text-[#ce2727] shadow-sm ring-1 ring-black/5' : 'text-slate-400 hover:text-slate-600'}`}
                >
                   <span className="material-symbols-outlined text-xs">person_add</span>
                   New
                </button>
                <button 
                  type="button"
                  onClick={() => { setMode('existing'); setFormData(prev => ({ ...prev, name: '', avatar: null })); }}
                  className={`flex-1 py-2 rounded-lg transition-all duration-200 z-10 flex items-center justify-center gap-1.5 ${mode === 'existing' ? 'bg-white dark:bg-slate-700 text-[#ce2727] shadow-sm ring-1 ring-black/5' : 'text-slate-400 hover:text-slate-600'}`}
                >
                   <span className="material-symbols-outlined text-xs">groups</span>
                   Existing
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
            {/* Avatar - Reduced Size */}
            <div className="flex flex-col items-center gap-2">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-16 h-16 rounded-full border-4 border-slate-100 dark:border-slate-800 relative cursor-pointer overflow-hidden group hover:border-[#ce2727] transition-all shadow-md"
              >
                {formData.avatar ? (
                  <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-50 dark:bg-slate-800 flex flex-col items-center justify-center text-slate-300 dark:text-slate-600 group-hover:text-[#ce2727] transition-colors">
                    <span className="material-symbols-outlined text-2xl">add_a_photo</span>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white text-[9px] font-black tracking-widest uppercase backdrop-blur-sm transition-all">
                  Upload
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>

            <div className="space-y-3">
               <div>
                  <label className={labelClasses}>Debtor Name</label>
                  {mode === 'existing' && !initialData ? (
                    <div className="relative">
                       <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg">person_search</span>
                       <select 
                         required
                         className={`${inputClasses} pl-9 appearance-none cursor-pointer`}
                         value={formData.name}
                         onChange={handleExistingSelect}
                       >
                         <option value="" disabled>Select a registered debtor...</option>
                         {uniqueDebtors.map(d => (
                           <option key={d.name} value={d.name}>{d.name}</option>
                         ))}
                       </select>
                       <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg">expand_more</span>
                    </div>
                  ) : (
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg">person</span>
                      <input 
                        required 
                        className={`${inputClasses} pl-9`}
                        placeholder="e.g. Juan Dela Cruz"
                        value={formData.name}
                        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                  )}
               </div>

               {(mode === 'new' || initialData) && (
                 <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-top-2 duration-300">
                   <div>
                     <label className={labelClasses}>Email (Optional)</label>
                     <input 
                       className={inputClasses}
                       placeholder="name@email.com"
                       type="email"
                       value={formData.email}
                       onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                     />
                   </div>
                   <div>
                     <label className={labelClasses}>Phone (Optional)</label>
                     <input 
                       className={inputClasses}
                       placeholder="0917..."
                       value={formData.phone}
                       onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                     />
                   </div>
                 </div>
               )}

               <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClasses}>Amount (₱)</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg">payments</span>
                        <input 
                          required 
                          type="number"
                          className={`${inputClasses} pl-9 font-black text-slate-700`}
                          placeholder="0.00"
                          value={formData.amount}
                          onChange={e => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                        />
                    </div>
                  </div>
                  <div>
                    <label className={labelClasses}>Date Borrowed</label>
                    <input 
                      required 
                      type="datetime-local"
                      className={`${inputClasses} text-xs`} 
                      value={formData.date}
                      onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
               </div>

               <div>
                 <label className={labelClasses}>Notes</label>
                 <textarea 
                   className={`${inputClasses} min-h-[80px] resize-none leading-relaxed`}
                   placeholder="Add context or reminder details..."
                   value={formData.notes}
                   onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                 />
               </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button 
                type="button" 
                onClick={onClose}
                disabled={isUploading}
                className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-transparent hover:border-slate-300 dark:hover:border-slate-600 text-xs uppercase tracking-wide"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isUploading}
                className="flex-[2] py-3 bg-[#ce2727] text-white font-bold rounded-xl shadow-lg shadow-red-500/30 hover:bg-[#b01e1e] hover:shadow-red-600/40 active:scale-95 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wide"
              >
                {isUploading ? (
                   <>
                     <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                     <span>Saving...</span>
                   </>
                ) : (
                   <>
                      <span className="material-symbols-outlined text-[16px]">{initialData ? 'save' : 'check'}</span>
                      <span>{initialData ? 'Save Changes' : 'Create Record'}</span>
                   </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};