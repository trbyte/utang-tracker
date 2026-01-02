import React, { useState } from 'react';
import { TransactionStatus } from '../types';

export const AddRecordModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    amount: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRecord = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      amount: parseFloat(formData.amount),
      dateBorrowed: new Date().toLocaleString(),
      status: TransactionStatus.PENDING,
      notes: formData.notes,
      avatar: `https://picsum.photos/seed/${formData.name || 'default'}/200`
    };
    onSave(newRecord);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border dark:border-slate-800">
        <div className="p-8 bg-[#ce2727] text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black">New Debt Record</h2>
            <p className="text-white/60 text-xs font-black uppercase tracking-widest mt-1">Manual Entry</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
             <div className="flex flex-col gap-1.5">
               <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-600 tracking-wider ml-1">Debtor Name</label>
               <input 
                 required 
                 className="bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#da9595] dark:text-white"
                 placeholder="e.g. John Doe"
                 value={formData.name}
                 onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
               />
             </div>
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
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="flex flex-col gap-1.5">
               <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-600 tracking-wider ml-1">Email Address</label>
               <input 
                 className="bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#da9595] dark:text-white"
                 placeholder="name@email.com"
                 value={formData.email}
                 onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
               />
             </div>
             <div className="flex flex-col gap-1.5">
               <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-600 tracking-wider ml-1">Phone Number</label>
               <input 
                 className="bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#da9595] dark:text-white"
                 placeholder="+63 900 000 0000"
                 value={formData.phone}
                 onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
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

          <div className="flex gap-4 mt-4">
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
              Confirm Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
