import React, { useState } from 'react';
import { TransactionStatus } from '../types';
import Modal from './ui/Modal'; // Import the Modal component

const formatToPHTime = (dateString) => {
  if (!dateString) return '-- / --';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-PH', {
    year: 'numeric', 
    month: 'short', 
    day: '2-digit',
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true,
    timeZone: 'Asia/Manila' 
  }).format(date);
};

export const TransactionSection = ({
  transactions,
  selectedTransaction,
  onSelect,
  onAddClick,
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterChange,
  onSettle,
  onEdit
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // NEW: State for Settle Confirmation Modal
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const [settleTargetId, setSettleTargetId] = useState(null);

  const filterOptions = ['ALL', TransactionStatus.PENDING, TransactionStatus.COMPLETED];

  // Trigger the Modal opening
  const handleInitiateSettle = (id) => {
    setSettleTargetId(id);
    setIsSettleModalOpen(true);
  };

  // Perform the actual action
  const handleConfirmSettle = () => {
    if (settleTargetId) {
      onSettle(settleTargetId);
    }
    setIsSettleModalOpen(false);
    setSettleTargetId(null);
  };

  return (
    <>
      <div className="h-auto lg:h-full bg-white dark:bg-slate-900 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 flex gap-6 p-4 lg:p-6 relative overflow-visible lg:overflow-hidden transition-colors">
        
        {/* Decorative Notch (Desktop Only) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-[#f0f2f5] dark:bg-slate-800 rounded-b-[18px] hidden lg:block"></div>

        {/* LEFT SECTION: Transaction List */}
        <div className="w-full lg:flex-[2] flex flex-col z-10">
          
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-start gap-3 shrink-0 mb-4">
            <button 
              onClick={onAddClick}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#ce2727] text-white rounded-full text-xs font-black shadow-lg shadow-[#ce272733] hover:scale-105 active:scale-95 transition-all shrink-0"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Add Record
            </button>

            {/* SEARCH & FILTER GROUP */}
            <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
              <div className="relative w-full sm:w-64">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 text-lg">search</span>
                <input 
                  type="text" 
                  placeholder="Search..."
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-full text-xs border-none focus:ring-2 focus:ring-[#da9595] dark:text-slate-200 transition-all"
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
              </div>

              <div className="relative w-full sm:w-auto">
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 border rounded-full text-xs font-bold transition-colors shrink-0 ${filterStatus !== 'ALL' ? 'bg-[#ce2727] text-white border-[#ce2727]' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                >
                  <span className="material-symbols-outlined text-[18px]">tune</span>
                  {filterStatus === 'ALL' ? 'Filter' : filterStatus}
                </button>
                
                {isFilterOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)}></div>
                    <div className="absolute top-full left-0 sm:left-auto sm:right-0 mt-2 w-full sm:w-40 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 py-2 z-20 overflow-hidden">
                      {filterOptions.map(status => (
                        <button
                          key={status}
                          onClick={() => { onFilterChange(status); setIsFilterOpen(false); }}
                          className={`w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${filterStatus === status ? 'text-[#ce2727]' : 'text-slate-500 dark:text-slate-400'}`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Responsive Table Header */}
          <div className="grid grid-cols-[48px_1fr_100px] md:grid-cols-[48px_1fr_120px_160px_100px] gap-4 md:gap-6 px-4 py-2.5 text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest border-b dark:border-slate-800">
            <span></span>
            <span className="text-left">Name</span>
            <span className="text-center">Amount</span>
            <span className="text-center hidden md:block">Created On</span>
            <span className="text-center hidden md:block">Status</span>
          </div>

          {/* Transaction List */}
          <div className="flex-1 mt-1 custom-scroll overflow-visible lg:overflow-y-auto">
            {transactions.map(t => (
              <div 
                key={t.id}
                onClick={() => onSelect(t.id)}
                className={`grid grid-cols-[48px_1fr_100px] md:grid-cols-[48px_1fr_120px_160px_100px] gap-4 md:gap-6 items-center px-4 py-3 mb-1.5 rounded-2xl cursor-pointer transition-all border ${selectedTransaction?.id === t.id ? 'bg-[#ce2727]/5 dark:bg-[#ce2727]/10 border-[#ce2727]' : 'bg-slate-50 dark:bg-slate-800/40 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700'}`}
              >
                <img src={t.avatar} className="w-9 h-9 rounded-full border-2 border-white dark:border-slate-700 shadow-sm" alt="" />
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate block">{t.name}</span>
                  <span className={`text-[9px] font-bold uppercase md:hidden ${t.status === TransactionStatus.COMPLETED ? 'text-green-600' : 'text-[#da9595]'}`}>{t.status}</span>
                </div>
                <span className="text-xs font-black text-slate-900 dark:text-white text-center">₱{t.amount.toLocaleString()}</span>
                
                <span className="text-[11px] text-slate-400 dark:text-slate-600 font-medium truncate text-center hidden md:block">
                  {formatToPHTime(t.created_at || t.createdAt)}
                </span>

                <div className="justify-center hidden md:flex">
                  <StatusBadge status={t.status} />
                </div>
              </div>
            ))}
            {transactions.length === 0 && (
              <div className="p-8 text-center text-slate-400 dark:text-slate-600 text-xs font-bold">
                No transactions found.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SECTION: Details Panel */}
        <div className={`
          fixed inset-0 z-[60] bg-white dark:bg-slate-900 lg:static lg:bg-transparent lg:dark:bg-transparent
          flex flex-col shrink-0 lg:w-[360px] h-full transition-transform duration-300
          ${selectedTransaction ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}>
          {selectedTransaction ? (
            <div className="h-full bg-white dark:bg-slate-900 lg:rounded-[32px] lg:border lg:border-slate-100 lg:dark:border-slate-800 lg:shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col overflow-hidden relative transition-all">
              
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 pb-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
                <button 
                  onClick={() => onSelect(null)}
                  className="lg:hidden absolute top-4 right-4 p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm text-slate-500 border border-slate-100 dark:border-slate-700"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>

                <div className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg border-4 border-white dark:border-slate-700">
                      <img 
                        src={selectedTransaction.avatar} 
                        alt={selectedTransaction.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-800 dark:text-white leading-tight">
                      {selectedTransaction.name}
                    </h2>
                    <p className="text-[#ce2727] font-bold text-[9px] tracking-widest uppercase mt-0.5">
                      Profile
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scroll p-6 space-y-5 bg-white dark:bg-slate-900">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-3">
                  <div className="flex gap-3 items-start">
                    <span className="material-symbols-outlined text-slate-300 dark:text-slate-500 mt-0.5 text-[18px]">mail</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Email Address</p>
                      <p className="text-slate-700 dark:text-slate-200 font-bold text-xs truncate">{selectedTransaction.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <span className="material-symbols-outlined text-slate-300 dark:text-slate-500 mt-0.5 text-[18px]">call</span>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Contact Number</p>
                      <p className="text-slate-700 dark:text-slate-200 font-bold text-xs">{selectedTransaction.phone}</p>
                    </div>
                  </div>
                </div>

                <hr className="border-dashed border-slate-100 dark:border-slate-800" />

                <div className="space-y-4 px-1">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center shrink-0 text-green-600 dark:text-green-400">
                      <span className="material-symbols-outlined text-[16px]">payments</span>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Amount Borrowed</p>
                      <p className="text-slate-800 dark:text-white font-black text-base tracking-tight">
                        ₱ {selectedTransaction.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0 text-blue-500 dark:text-blue-400">
                      <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Date Borrowed</p>
                      <p className="text-slate-700 dark:text-slate-200 font-semibold text-xs">
                          {formatToPHTime(selectedTransaction.dateBorrowed)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center shrink-0 text-orange-500 dark:text-orange-400">
                      <span className="material-symbols-outlined text-[16px]">info</span>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1">Status</p>
                      <StatusBadge status={selectedTransaction.status} />
                    </div>
                  </div>

                  <div className={`flex gap-3 ${!selectedTransaction.datePaid && 'opacity-50 grayscale'}`}>
                      <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center shrink-0 text-purple-500 dark:text-purple-400">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Date Paid</p>
                      <p className="text-slate-700 dark:text-slate-200 font-semibold text-xs">
                        {/* CHANGED: Applied formatToPHTime helper */}
                        {formatToPHTime(selectedTransaction.datePaid)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/20">
                  <div className="flex gap-2 items-center mb-1.5">
                    <span className="material-symbols-outlined text-amber-500 text-sm">sticky_note_2</span>
                    <p className="text-[9px] font-black text-amber-600/70 dark:text-amber-500 uppercase tracking-wide">Notes</p>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-xs italic leading-relaxed">
                    "{selectedTransaction.notes || 'No notes added.'}"
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-6 pt-4 pb-8 lg:pb-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 z-10 shrink-0">
                <button 
                  onClick={() => onEdit(selectedTransaction)}
                  className="flex-1 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Edit
                </button>
                {selectedTransaction.status !== TransactionStatus.COMPLETED ? (
                  <button 
                    onClick={() => handleInitiateSettle(selectedTransaction.id)}
                    className="flex-[1.5] py-3.5 rounded-2xl bg-[#ce2727] text-white font-bold text-[10px] shadow-lg shadow-red-200 dark:shadow-none hover:bg-red-700 transition-colors uppercase tracking-wide"
                  >
                    Settle Now
                  </button>
                ) : (
                  <button 
                    disabled
                    className="flex-[1.5] py-3.5 rounded-2xl bg-green-600 text-white font-bold text-[10px] shadow-lg opacity-80 cursor-not-allowed uppercase tracking-wide"
                  >
                    Paid
                  </button>
                )}
              </div>

            </div>
          ) : (
            <div className="hidden lg:flex flex-1 bg-slate-50 dark:bg-slate-800/40 rounded-[32px] border-2 border-dashed border-slate-200 dark:border-slate-700 flex-col items-center justify-center p-10 text-center text-slate-300 dark:text-slate-600">
               <span className="material-symbols-outlined text-6xl mb-4">person_search</span>
               <p className="text-[10px] font-black uppercase tracking-widest max-w-[180px]">Select a transaction to view full details</p>
            </div>
          )}
        </div>
      </div>

      {/* NEW: Confirmation Modal */}
      <Modal
        isOpen={isSettleModalOpen}
        onClose={() => setIsSettleModalOpen(false)}
        title="Confirm Settlement"
      >
        <div className="space-y-6">
          <div className="flex gap-4 items-start bg-red-50 dark:bg-red-900/10 p-4 rounded-2xl border border-red-100 dark:border-red-900/20">
             <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0 text-[#ce2727] dark:text-red-400">
                <span className="material-symbols-outlined text-xl">gavel</span>
             </div>
             <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Mark as Paid?</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Are you sure you want to settle this transaction? This action will mark the debt as fully paid and cannot be easily undone.
                </p>
             </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              onClick={() => setIsSettleModalOpen(false)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmSettle}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#ce2727] text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-200 dark:shadow-none"
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

const StatusBadge = ({ status }) => {
  const colors = {
    [TransactionStatus.COMPLETED]: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    [TransactionStatus.PENDING]: 'bg-[#da9595]/20 dark:bg-[#da9595]/10 text-[#da9595]'
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${colors[status]}`}>
      {status}
    </span>
  );
};