import React, { useState, useMemo, useEffect } from 'react';
import { supabase } from './supabaseClient'; 
import { Navbar } from './components/navbar';
import { Overview } from './components/overview';
import { TransactionSection } from './components/transaction';
import { AddRecordModal } from './components/addrecord';
import { ProfilePage } from './components/profile';
import { TransactionStatus } from './types';

// Import All Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';

const App = () => {
  const [session, setSession] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI State
  const [selectedId, setSelectedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [currentView, setCurrentView] = useState('DASHBOARD');
  
  // Auth Views
  const [authView, setAuthView] = useState('LOGIN'); 
  const [isPasswordResetting, setIsPasswordResetting] = useState(false);
  const [pendingEmail, setPendingEmail] = useState(''); // NEW: Track who needs verification

  // Lifted Profile State
  const [userProfile, setUserProfile] = useState({
    name: 'Admin User',
    email: 'admin@utangtracker.pro',
    phone: '+63 917 123 4567',
    avatar: 'https://picsum.photos/seed/admin/200'
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // 1. Handle Authentication & Session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchTransactions();
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsPasswordResetting(true);
      }
      setSession(session);
      if (session) fetchTransactions();
      else setTransactions([]);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Fetch Data
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedData = data.map(t => ({
        id: t.id,
        created_at: t.created_at,
        name: t.name,
        email: t.email,
        phone: t.phone,
        amount: t.amount,
        dateBorrowed: t.date_borrowed,
        datePaid: t.date_paid,
        status: t.status,
        notes: t.notes,
        avatar: t.avatar_url
      }));

      setTransactions(mappedData);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. Dark Mode Logic
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

  // 4. Computed Stats
  const stats = useMemo(() => {
    const totalOwed = transactions
      .filter(t => t.status !== TransactionStatus.COMPLETED)
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
    const totalReturned = transactions
      .filter(t => t.status === TransactionStatus.COMPLETED)
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
    const completedCount = transactions.filter(t => t.status === TransactionStatus.COMPLETED).length;
    const pendingCount = transactions.filter(t => t.status !== TransactionStatus.COMPLETED).length;
    
    return { totalOwed, totalReturned, completedCount, pendingCount, lastUpdated: new Date().toLocaleDateString() };
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (t.notes && t.notes.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFilter = filterStatus === 'ALL' || t.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [transactions, searchTerm, filterStatus]);

  const selectedTransaction = useMemo(() => transactions.find(t => t.id === selectedId) || null, [transactions, selectedId]);

  // 5. Actions
  const handleSaveRecord = async (record) => {
    if (!session) return;
    try {
      const dbRecord = {
        name: record.name,
        email: record.email,
        phone: record.phone,
        amount: parseFloat(record.amount),
        date_borrowed: record.dateBorrowed || new Date().toISOString(),
        notes: record.notes,
        status: record.status || TransactionStatus.PENDING,
        avatar_url: record.avatar,
        user_id: session.user.id
      };

      if (editingTransaction) {
        await supabase.from('transactions').update(dbRecord).eq('id', record.id);
      } else {
        await supabase.from('transactions').insert([dbRecord]);
      }
      await fetchTransactions();
      handleCloseModal();
    } catch (error) {
      alert('Error saving record: ' + error.message);
    }
  };

  const handleSettle = async (id) => {
    try {
      await supabase
        .from('transactions')
        .update({ 
          status: TransactionStatus.COMPLETED, 
          date_paid: new Date().toISOString() 
        })
        .eq('id', id);
        
      await fetchTransactions();
    } catch (error) {
      console.error('Error settling transaction:', error.message); // Logs to console instead of alerting
    }
  };

  const handleEditClick = (t) => { setEditingTransaction(t); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setEditingTransaction(null); };

  // 6. MAIN RENDER & AUTH LOGIC
  
  // Case A: Password Reset (Happens via email link)
  if (isPasswordResetting) {
    return (
      <ResetPassword 
        isDarkMode={isDarkMode} 
        toggleDarkMode={toggleDarkMode} 
        onNavigate={setAuthView}
      />
    );
  }

  // Case B: Not Logged In -> Show Auth Pages
  if (!session && !loading) {
    switch (authView) {
      case 'REGISTER':
        return (
          <Register 
            onLoginClick={() => setAuthView('LOGIN')} 
            // NEW: Handle successful registration
            onRegisterSuccess={(email) => {
               setPendingEmail(email);
               setAuthView('VERIFY_EMAIL');
            }}
            isDarkMode={isDarkMode} 
            toggleDarkMode={toggleDarkMode}
          />
        );
      case 'FORGOT_PASSWORD':
        return (
          <ForgotPassword 
            onNavigate={setAuthView} 
            isDarkMode={isDarkMode} 
            toggleDarkMode={toggleDarkMode}
          />
        );
      case 'VERIFY_EMAIL':
        return (
           <VerifyEmail 
             email={pendingEmail} // Pass the email we captured
             onNavigate={setAuthView} 
             isDarkMode={isDarkMode} 
             toggleDarkMode={toggleDarkMode}
           />
        );
      case 'LOGIN':
      default:
        return (
          <Login 
            onRegisterClick={() => setAuthView('REGISTER')} 
            onForgotPasswordClick={() => setAuthView('FORGOT_PASSWORD')}
            // NEW: Handle unverified email error
            onUnverified={(email) => {
                setPendingEmail(email);
                setAuthView('VERIFY_EMAIL');
            }}
            isDarkMode={isDarkMode} 
            toggleDarkMode={toggleDarkMode}
          />
        );
    }
  }

  // Case C: Logged In -> Main Dashboard
  return (
    <div className={`h-screen flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f0f2f5]'} overflow-hidden`}>
      <Navbar 
        isDarkMode={isDarkMode} 
        toggleDarkMode={toggleDarkMode} 
        transactions={transactions}
        onNavigate={setCurrentView}
        userProfile={userProfile}
      />
      <main className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
        {currentView === 'DASHBOARD' ? (
          <>
            <section className="h-[28%] min-h-[220px] shrink-0">
              <Overview stats={stats} recentTransactions={transactions.slice(0, 5)} isDarkMode={isDarkMode} />
            </section>
            <section className="flex-1 min-h-0">
              {loading ? (
                <div className="h-full flex items-center justify-center text-slate-400 font-bold animate-pulse">Loading...</div>
              ) : (
                <TransactionSection 
                  transactions={filteredTransactions} selectedTransaction={selectedTransaction}
                  onSelect={setSelectedId} onAddClick={() => setIsModalOpen(true)}
                  searchTerm={searchTerm} onSearchChange={setSearchTerm}
                  filterStatus={filterStatus} onFilterChange={setFilterStatus}
                  onSettle={handleSettle} onEdit={handleEditClick}
                />
              )}
            </section>
          </>
        ) : (
          <ProfilePage onBack={() => setCurrentView('DASHBOARD')} userProfile={userProfile} onUpdateProfile={setUserProfile} />
        )}
      </main>
      
      {isModalOpen && (
        <AddRecordModal onClose={handleCloseModal} onSave={handleSaveRecord} transactions={transactions} initialData={editingTransaction} />
      )}
    </div>
  );
};

export default App;