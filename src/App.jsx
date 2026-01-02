import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/navbar';
import { Overview } from './components/overview';
import { TransactionSection } from './components/transaction';
import { AddRecordModal } from './components/addrecord';
import { ProfilePage } from './components/profile'; // Import the new component
import { TransactionStatus } from './types';

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [editingTransaction, setEditingTransaction] = useState(null);
  
  // NEW: State to control View (Dashboard vs Profile)
  const [currentView, setCurrentView] = useState('DASHBOARD');

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

  // ... (keep stats, filteredTransactions, and selectedTransaction logic as is)
  const stats = useMemo(() => {
    const totalOwed = transactions
      .filter(t => t.status !== TransactionStatus.COMPLETED)
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
    const totalReturned = transactions
      .filter(t => t.status === TransactionStatus.COMPLETED)
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
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
    return transactions.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            t.notes.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'ALL' || t.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [transactions, searchTerm, filterStatus]);

  const selectedTransaction = useMemo(() => 
    transactions.find(t => t.id === selectedId) || null,
  [transactions, selectedId]);

  const handleSaveRecord = (record) => {
    const sanitizedRecord = { ...record, amount: parseFloat(record.amount) || 0 };
    if (editingTransaction) {
      setTransactions(prev => prev.map(t => t.id === sanitizedRecord.id ? sanitizedRecord : t));
    } else {
      setTransactions(prev => [sanitizedRecord, ...prev]);
      setSelectedId(sanitizedRecord.id);
    }
    handleCloseModal();
  };

  const handleEditClick = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleSettle = (id) => {
    if (window.confirm('Are you sure you want to settle this transaction?')) {
      setTransactions(prev => prev.map(t => {
        if (t.id === id) {
          return {
            ...t,
            status: TransactionStatus.COMPLETED,
            datePaid: new Date().toLocaleString('en-US', {
              year: 'numeric', month: '2-digit', day: '2-digit', 
              hour: '2-digit', minute: '2-digit', hour12: false 
            }).replace(',', '')
          };
        }
        return t;
      }));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  return (
    <div className={`h-screen flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f0f2f5]'} overflow-hidden`}>
      <Navbar 
        isDarkMode={isDarkMode} 
        toggleDarkMode={toggleDarkMode} 
        transactions={transactions}
        // Pass navigation handler
        onNavigate={setCurrentView}
      />
      
      <main className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
        {currentView === 'DASHBOARD' ? (
          <>
            <section className="h-[28%] min-h-[220px] shrink-0">
              <Overview 
                stats={stats} 
                recentTransactions={transactions.slice(0, 5)} 
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
                filterStatus={filterStatus}
                onFilterChange={setFilterStatus}
                onSettle={handleSettle}
                onEdit={handleEditClick}
              />
            </section>
          </>
        ) : (
          <ProfilePage onBack={() => setCurrentView('DASHBOARD')} />
        )}
      </main>

      {isModalOpen && (
        <AddRecordModal 
          onClose={handleCloseModal} 
          onSave={handleSaveRecord}
          transactions={transactions}
          initialData={editingTransaction}
        />
      )}
    </div>
  );
};

export default App;