
import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/navbar';
import { Overview } from './components/overview';
import { TransactionSection } from './components/transaction';
import { AddRecordModal } from './components/addrecord';
import { INITIAL_TRANSACTIONS } from './constants';
import { TransactionStatus } from './types';

const App = () => {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [selectedId, setSelectedId] = useState(INITIAL_TRANSACTIONS[0]?.id || '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const stats = useMemo(() => {
    const totalOwed = transactions
      .filter(t => t.status !== TransactionStatus.COMPLETED)
      .reduce((sum, t) => sum + t.amount, 0);
    const totalReturned = transactions
      .filter(t => t.status === TransactionStatus.COMPLETED)
      .reduce((sum, t) => sum + t.amount, 0);
    const completedCount = transactions.filter(t => t.status === TransactionStatus.COMPLETED).length;
    const pendingCount = transactions.filter(t => t.status !== TransactionStatus.COMPLETED).length;
    
    return {
      totalOwed,
      totalReturned,
      completedCount,
      pendingCount,
      lastUpdated: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })
    };
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => 
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.notes.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [transactions, searchTerm]);

  const selectedTransaction = useMemo(() => 
    transactions.find(t => t.id === selectedId) || null,
  [transactions, selectedId]);

  const handleAddRecord = (newRecord) => {
    setTransactions(prev => [newRecord, ...prev]);
    setIsModalOpen(false);
    setSelectedId(newRecord.id);
  };

  return (
    <div className={`h-screen flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f0f2f5]'} overflow-hidden`}>
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
        <section className="h-[28%] min-h-[220px]">
          <Overview 
            stats={stats} 
            recentTransactions={transactions.slice(0, 5)} 
            // Removed unused transactions prop to fix type assignment error
            isDarkMode={isDarkMode}
          />
        </section>

        <section className="flex-1 min-h-0">
          <TransactionSection 
            transactions={filteredTransactions}
            selectedTransaction={selectedTransaction}
            onSelect={setSelectedId}
            onAddClick={() => setIsModalOpen(true)}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </section>
      </main>

      {isModalOpen && (
        <AddRecordModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleAddRecord} 
        />
      )}
    </div>
  );
};

export default App;
