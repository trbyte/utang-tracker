
import React from 'react';
import { TransactionStatus } from '../types';

export const TransactionSection = ({
  transactions,
  selectedTransaction,
  onSelect,
  onAddClick,
  searchTerm,
  onSearchChange
}) => {
  return (
    <div className="h-full bg-white dark:bg-slate-900 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col relative overflow-hidden transition-colors">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-[#f0f2f5] dark:bg-slate-800 rounded-b-[18px]"></div>
      
      <div className="p-6 pb-3 flex items-center justify-start gap-3 shrink-0">
        <button 
          onClick={onAddClick}
          className="flex items-center gap-1.5 px-5 py-2.5 bg-[#ce2727] text-white rounded-full text-xs font-black shadow-lg shadow-[#ce272733] hover:scale-105 active:scale-95 transition-all shrink-0"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Add Record
        </button>

        <div className="relative w-64">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 text-lg">search</span>
          <input 
            type="text" 
            placeholder="Search debtor..."
            className="pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-full text-xs border-none focus:ring-2 focus:ring-[#da9595] dark:text-slate-200 transition-all w-full"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <button className="flex items-center gap-1.5 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shrink-0">
          <span className="material-symbols-outlined text-[18px]">tune</span>
          Filter
        </button>
      </div>

      <div className="flex-1 flex gap-6 p-6 pt-0 min-h-0">
        <div className="flex-[2] flex flex-col min-h-0">
          <div className="grid grid-cols-[48px_1fr_100px_140px_100px] gap-3 px-4 py-2.5 text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest border-b dark:border-slate-800">
            <span></span>
            <span>Name</span>
            <span>Amount</span>
            <span>Borrowed</span>
            <span>Status</span>
          </div>
          <div className="flex-1 overflow-y-auto pr-1 mt-1 custom-scroll">
            {transactions.map(t => (
              <div 
                key={t.id}
                onClick={() => onSelect(t.id)}
                className={`grid grid-cols-[48px_1fr_100px_140px_100px] gap-3 items-center px-4 py-3 mb-1.5 rounded-2xl cursor-pointer transition-all border ${selectedTransaction?.id === t.id ? 'bg-[#ce2727]/5 dark:bg-[#ce2727]/10 border-[#ce2727]' : 'bg-slate-50 dark:bg-slate-800/40 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700'}`}
              >
                <img src={t.avatar} className="w-9 h-9 rounded-full border-2 border-white dark:border-slate-700 shadow-sm" alt="" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{t.name}</span>
                <span className="text-xs font-black text-slate-900 dark:text-white">₱{t.amount.toLocaleString()}</span>
                <span className="text-[11px] text-slate-400 dark:text-slate-600 font-medium truncate">{t.dateBorrowed}</span>
                <StatusBadge status={t.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="w-[360px] flex flex-col shrink-0">
          {selectedTransaction ? (
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[28px] border border-slate-100 dark:border-slate-800 flex flex-col gap-5 h-full shadow-inner overflow-hidden transition-colors">
              <div className="flex items-center gap-4 shrink-0">
                <img src={selectedTransaction.avatar} className="w-16 h-16 rounded-[22px] border-4 border-white dark:border-slate-700 shadow-md object-cover" alt="" />
                <div className="min-w-0">
                  <h2 className="text-base font-black text-slate-800 dark:text-white truncate leading-tight">{selectedTransaction.name}</h2>
                  <p className="text-[10px] font-black text-[#ce2727] uppercase tracking-tighter mt-1">Record Profile</p>
                </div>
              </div>

              <div className="flex-1 bg-white dark:bg-slate-900 rounded-[24px] p-5 flex flex-col gap-4 shadow-sm overflow-hidden border dark:border-slate-800">
                 <div className="space-y-3">
                   <DetailRow label="Email Address" value={selectedTransaction.email} icon="mail" />
                   <DetailRow label="Contact Number" value={selectedTransaction.phone} icon="call" />
                 </div>
                 
                 <div className="h-[1px] bg-slate-50 dark:bg-slate-800"></div>

                 <div className="space-y-3">
                   <DetailRow label="Amount Borrowed" value={`₱${selectedTransaction.amount.toLocaleString()}`} isBold icon="payments" />
                   <DetailRow label="Borrowed On" value={selectedTransaction.dateBorrowed} icon="calendar_today" />
                   <DetailRow label="Status" value={<StatusBadge status={selectedTransaction.status} />} icon="info" />
                   <DetailRow label="Settled On" value={selectedTransaction.datePaid || 'Pending'} icon="check_circle" />
                 </div>
                 
                 <div className="h-[1px] bg-slate-50 dark:bg-slate-800"></div>
                 
                 <div className="flex-1 flex flex-col min-h-0">
                   <p className="text-[9px] uppercase font-black text-slate-300 dark:text-slate-600 tracking-wider mb-2 flex items-center gap-1">
                     <span className="material-symbols-outlined text-[14px]">notes</span> Notes
                   </p>
                   <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl overflow-y-auto flex-1 border dark:border-slate-800 custom-scroll">
                     "{selectedTransaction.notes || 'No notes added for this record.'}"
                   </p>
                 </div>
              </div>

              <div className="flex gap-3 shrink-0">
                <button className="flex-1 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-[11px] font-black text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors active:scale-95">EDIT</button>
                <button className="flex-[1.5] py-3.5 bg-[#ce2727] rounded-2xl text-[11px] font-black text-white shadow-lg shadow-[#ce272733] hover:scale-[1.02] active:scale-95 transition-all">SETTLE NOW</button>
              </div>
            </div>
          ) : (
            <div className="flex-1 bg-slate-50 dark:bg-slate-800/40 rounded-[28px] border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center p-10 text-center text-slate-300 dark:text-slate-700">
               <div className="flex flex-col items-center">
                 <span className="material-symbols-outlined text-5xl mb-3 opacity-20">person_search</span>
                 <p className="text-[11px] font-black uppercase tracking-widest max-w-[180px]">Select a transaction to view details</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const colors = {
    [TransactionStatus.COMPLETED]: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    [TransactionStatus.PENDING]: 'bg-[#da9595]/20 dark:bg-[#da9595]/10 text-[#da9595]',
    [TransactionStatus.OVERDUE]: 'bg-[#ce2727]/10 dark:bg-[#ce2727]/20 text-[#ce2727] dark:text-[#ef4444]'
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${colors[status]}`}>
      {status}
    </span>
  );
};

// Added default value for isBold to fix missing property errors in component calls
const DetailRow = ({ label, value, isBold = false, icon }) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-1.5">
      {icon && <span className="material-symbols-outlined text-[14px] text-slate-300 dark:text-slate-600">{icon}</span>}
      <p className="text-[9px] uppercase font-black text-slate-300 dark:text-slate-600 tracking-wider whitespace-nowrap">{label}</p>
    </div>
    <div className={`text-[12px] pl-5 ${isBold ? 'font-black text-slate-800 dark:text-white' : 'font-semibold text-slate-600 dark:text-slate-400'} truncate`}>{value}</div>
  </div>
);
