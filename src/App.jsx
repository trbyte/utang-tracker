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
  const [pendingEmail, setPendingEmail] = useState('');

  // Profile State
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: ''
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const updateUserProfile = (user) => {
    if (!user) return;
    setUserProfile({
      // Checks for metadata name, fallback to email
      name: user.user_metadata?.name || user.user_metadata?.full_name || user.email.split('@')[0], 
      email: user.email,
      phone: user.user_metadata?.phone || '',
      avatar: user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user.email}&background=random`
    });
  };

  // 1. Handle Authentication & Session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        updateUserProfile(session.user);
        fetchTransactions(session.user.id);
      } else {
        setLoading(false); // Only stop loading here if NO session
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsPasswordResetting(true);
      }
      setSession(session);
      
      if (session) {
        updateUserProfile(session.user);
        fetchTransactions(session.user.id);
      } else {
        setTransactions([]);
        setUserProfile({ name: '', email: '', phone: '', avatar: '' });
        // Ensure we stop loading if the user logs out
        setLoading(false); 
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Fetch Data
  const fetchTransactions = async (userId) => {
    const currentUserId = userId || session?.user?.id;
    if (!currentUserId) return; 

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', currentUserId)
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

  // Computed Stats
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

  // Actions
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
      await fetchTransactions(session.user.id);
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
        
      await fetchTransactions(session.user.id);
    } catch (error) {
      console.error('Error settling transaction:', error.message);
    }
  };

  const handleEditClick = (t) => { setEditingTransaction(t); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setEditingTransaction(null); };

  // --- RENDER LOGIC ---

  // Case A: LOADING GUARD (Protects routes while checking auth)
  // We only show this if loading is true AND we don't have a session yet.
  // This prevents the "Dashboard" from flashing for 0.5s before Login appears.
  if (loading && !session) {
    return (
       <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f0f2f5]'}`}>
         <div className="flex flex-col items-center gap-4 animate-in fade-in duration-500">
           <div className="w-12 h-12 bg-[#ce2727] rounded-xl flex items-center justify-center shadow-lg shadow-red-500/40 animate-bounce">
              <span className="material-symbols-outlined text-white text-2xl">payments</span>
           </div>
           <p className="text-slate-500 dark:text-slate-400 text-xs font-black tracking-widest uppercase animate-pulse">Loading UtangTracker...</p>
         </div>
       </div>
    );
  }

  // Case B: Password Reset
  if (isPasswordResetting) {
    return (
      <ResetPassword 
        isDarkMode={isDarkMode} 
        toggleDarkMode={toggleDarkMode} 
        onNavigate={setAuthView}
      />
    );
  }

  // Case C: Not Logged In -> Show Auth Pages
  // Since we handled the "loading" state in Case A, we know for sure here that user is NOT logged in.
  if (!session) {
    switch (authView) {
      case 'REGISTER':
        return (
          <Register 
            onLoginClick={() => setAuthView('LOGIN')} 
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
             email={pendingEmail}
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

  // Case D: Logged In -> Main Dashboard
  // This code is now completely unreachable unless `session` is true.
  return (
    <div className={`h-screen flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f0f2f5]'} overflow-hidden relative`}>
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
              {/* Internal loading state for data fetching */}
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center gap-3 text-slate-400">
                    <div className="w-6 h-6 border-2 border-[#ce2727] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs font-bold">Syncing records...</span>
                </div>
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

      {/* Added For Red text */}
      <div className="fixed bottom-1 right-6 text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest pointer-events-none z-50">
          For Red JT
      </div>
    </div>
  );
};

export default App;