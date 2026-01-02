import React, { useState, useMemo, useEffect, useRef } from 'react';
import { TransactionStatus } from '../types';

export const AddRecordModal = ({ onClose, onSave, transactions = [], initialData = null }) => {
  const [mode, setMode] = useState('new');
  const fileInputRef = useRef(null);
  
  const uniqueDebtors = useMemo(() => {
    const map = new Map();
    transactions.forEach(t => {
      if (!map.has(t.name)) {
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
    date: new Date().toISOString().slice(0, 16),
    notes: '',
    avatar: null // Store base64 string here
  });

  // PRE-FILL FORM FOR EDITING
  useEffect(() => {
    if (initialData) {
      setMode('new'); 
      
      const parsedDate = new Date(initialData.dateBorrowed);
      const dateString = !isNaN(parsedDate) 
        ? new Date(parsedDate.getTime() - (parsedDate.getTimezoneOffset() * 60000)).toISOString().slice(0, 16)
        : new Date().toISOString().slice(0, 16);

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

  // Handle Existing Debtor Selection
  const handleExistingSelect = (e) => {
    const selectedName = e.target.value;
    const existingDebtor = uniqueDebtors.find(d => d.name === selectedName);
    
    if (existingDebtor) {
      setFormData(prev => ({
        ...prev,
        name: selectedName,
        email: existingDebtor.email,
        phone: existingDebtor.phone,
        avatar: existingDebtor.avatar // Auto-fill avatar
      }));
    } else {
      setFormData(prev => ({ ...prev, name: selectedName }));
    }
  };

  // Handle Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Default placeholder if no avatar is uploaded/selected
    // Using a generic SVG placeholder as data URI
    const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23cbd5e1'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";

    const record = {
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      amount: parseFloat(formData.amount),
      dateBorrowed: new Date(formData.date).toLocaleString('en-US', {
        year: 'numeric', month: '2-digit', day: '2-digit', 
        hour: '2-digit', minute: '2-digit', hour12: false 
      }).replace(',', ''),
      status: initialData?.status || TransactionStatus.PENDING,
      datePaid: initialData?.datePaid,
      notes: formData.notes,
      avatar: formData.avatar || defaultAvatar // Use uploaded avatar or default
    };
    
    onSave(record);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border dark:border-slate-800 max-h-[90vh] flex flex-col">
        
        <div className="p-8 pb-6 bg-[#ce2727] text-white flex justify-between items-start shrink-0">
          <div>
            <h2 className="text-2xl font-black">{initialData ? 'Edit Record' : 'New Debt Record'}</h2>
            <p className="text-white/60 text-xs font-black uppercase tracking-widest mt-1">
              {initialData ? 'Update details' : 'Add Transaction'}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors -mr-2 -mt-2">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="overflow-y-auto custom-scroll flex-1">
          {/* Hide toggle if editing */}
          {!initialData && (
            <div className="px-8 pt-6">
              <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl flex font-bold text-xs relative">
                <button 
                  type="button"
                  onClick={() => { setMode('new'); setFormData(prev => ({ ...prev, name: '', avatar: null })); }}
                  className={`flex-1 py-3 rounded-xl transition-all z-10 ${mode === 'new' ? 'bg-white dark:bg-slate-700 text-[#ce2727] shadow-sm' : 'text-slate-400'}`}
                >
                  NEW DEBTOR
                </button>
                <button 
                  type="button"
                  onClick={() => { setMode('existing'); setFormData(prev => ({ ...prev, name: '', avatar: null })); }}
                  className={`flex-1 py-3 rounded-xl transition-all z-10 ${mode === 'existing' ? 'bg-white dark:bg-slate-700 text-[#ce2727] shadow-sm' : 'text-slate-400'}`}
                >
                  EXISTING DEBTOR
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-5">
            
            {/* AVATAR UPLOAD SECTION */}
            <div className="flex flex-col items-center gap-2 mb-2">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-full border-4 border-slate-100 dark:border-slate-800 relative cursor-pointer overflow-hidden group hover:border-[#ce2727] transition-all shadow-sm"
              >
                {formData.avatar ? (
                  <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-50 dark:bg-slate-800 flex flex-col items-center justify-center text-slate-300 dark:text-slate-600 group-hover:text-[#ce2727] transition-colors">
                    <span className="material-symbols-outlined text-3xl mb-1">add_a_photo</span>
                  </div>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center text-white text-[10px] font-black tracking-widest uppercase backdrop-blur-[1px]">
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
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {formData.avatar ? 'Click to Change' : 'Tap to Upload Photo'}
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-600 tracking-wider ml-1">Debtor Name</label>
              {mode === 'existing' && !initialData ? (
                <select 
                  required
                  className="bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#da9595] dark:text-white appearance-none cursor-pointer"
                  value={formData.name}
                  onChange={handleExistingSelect}
                >
                  <option value="" disabled>Select a debtor...</option>
                  {uniqueDebtors.map(d => (
                    <option key={d.name} value={d.name}>{d.name}</option>
                  ))}
                </select>
              ) : (
                <input 
                  required 
                  className="bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#da9595] dark:text-white"
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              )}
            </div>

            {(mode === 'new' || initialData) && (
              <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                 <div className="flex flex-col gap-1.5">
                   <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-600 tracking-wider ml-1">Email</label>
                   <input 
                     className="bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#da9595] dark:text-white"
                     placeholder="name@email.com"
                     value={formData.email}
                     onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                   />
                 </div>
                 <div className="flex flex-col gap-1.5">
                   <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-600 tracking-wider ml-1">Phone</label>
                   <input 
                     className="bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#da9595] dark:text-white"
                     placeholder="+63 900..."
                     value={formData.phone}
                     onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                   />
                 </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
               <div className="flex flex-col gap-1.5">
                 <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-600 tracking-wider ml-1">Amount (₱)</label>
                 <input 
                   required 
                   type="number"
                   className="bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#da9595] dark:text-white"
                   placeholder="0.00"
                   value={formData.amount}
                   onChange={e => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                 />
               </div>
               <div className="flex flex-col gap-1.5">
                 <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-600 tracking-wider ml-1">Date Borrowed</label>
                 <input 
                   required 
                   type="datetime-local"
                   className="bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#da9595] dark:text-white"
                   value={formData.date}
                   onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                 />
               </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-600 tracking-wider ml-1">Additional Notes</label>
              <textarea 
                className="bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#da9595] dark:text-white min-h-[100px] resize-none"
                placeholder="Why was this borrowed?"
                value={formData.notes}
                onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>

            <div className="flex gap-4 mt-2">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 py-4 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-[2] py-4 bg-[#ce2727] text-white font-black rounded-2xl shadow-xl shadow-[#ce272733] hover:scale-[1.02] transition-transform"
              >
                {initialData ? 'Update Record' : 'Confirm Record'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};