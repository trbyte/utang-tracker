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
                {/* Header Section (Matches Forgot Password Style) */}
                <div className="space-y-1">
                    <p className="inline-flex items-center gap-2 rounded-full bg-[#ce2727]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#ce2727] ring-1 ring-[#ce2727]/30">
                        Verification
                    </p>
                    <div className="space-y-0.5">
                        <h1 className="text-xl font-semibold text-[#ce2727]">
                            Verify email address
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            Thanks for signing up! Before getting started, please verify your email by clicking the link we just sent.
                        </p>
                    </div>
                </div>

                {/* Status Message */}
                {status && (
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-600 text-sm font-bold">
                        {status}
                    </div>
                )}

                {/* Action Buttons */}
                <form className="space-y-4">
                    {/* Spacer to match form inputs height if needed, or just standard spacing */}
                    
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="text-xs font-bold text-slate-500 hover:text-[#ce2727] transition-colors"
                        >
                            &larr; Back to Login
                        </button>

                        <PrimaryButton 
                            onClick={resendEmail} 
                            disabled={processing}
                            className="justify-center px-6 py-2 text-xs"
                        >
                            {processing ? 'Sending...' : 'Resend Verification Email'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}