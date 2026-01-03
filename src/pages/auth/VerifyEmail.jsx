import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import GuestLayout from '../../components/ui/GuestLayout';
import PrimaryButton from '../../components/ui/PrimaryButton';

export default function VerifyEmail({ onNavigate, isDarkMode, toggleDarkMode, email }) {
    const [processing, setProcessing] = useState(false);
    const [status, setStatus] = useState(null);

    const resendEmail = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setStatus(null);

        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: email, 
            });
            
            if (error) throw error;
            setStatus('A new verification link has been sent to your email address.');
        } catch (error) {
            alert(error.message);
        } finally {
            setProcessing(false);
        }
    };

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut(); 
            onNavigate('LOGIN');
        } catch (error) {
            onNavigate('LOGIN');
        }
    };

    return (
        <GuestLayout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}>
            <div className="space-y-4">
                {/* Header Section */}
                <div className="space-y-1">
                    <p className="inline-flex items-center gap-2 rounded-full bg-[#ce2727]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#ce2727] ring-1 ring-[#ce2727]/30">
                        Verification
                    </p>
                    <div className="space-y-0.5">
                        <h1 className="text-xl font-semibold text-[#ce2727]">
                            Verify email address
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            Thanks for signing up! We sent a verification link to{' '}
                            <span className="font-bold text-slate-700 dark:text-slate-200">{email}</span>. 
                            Please click the link to get started.
                        </p>
                    </div>
                </div>

                {/* Status Message */}
                {status && (
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 rounded-lg text-green-700 dark:text-green-400 text-xs font-bold animate-in fade-in slide-in-from-top-1">
                        {status}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
                    {/* Primary Button: Order 1 on Mobile (Top), Order 2 on Desktop (Right) */}
                    <PrimaryButton 
                        onClick={resendEmail} 
                        disabled={processing}
                        className="justify-center px-5 py-1.5 text-[7.5px] sm:text-xs order-1 sm:order-2"
                    >
                        {processing ? 'Sending...' : 'Resend Verification Email'}
                    </PrimaryButton>

                    {/* Back Button: Order 2 on Mobile (Bottom), Order 1 on Desktop (Left) */}
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="text-xs font-bold text-slate-500 hover:text-[#ce2727] transition-colors flex items-center gap-1 order-2 sm:order-1"
                    >
                        <span>&larr;</span> Back to Login
                    </button>
                </div>
            </div>
        </GuestLayout>
    );
}