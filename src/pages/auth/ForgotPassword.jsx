import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import GuestLayout from '../../components/ui/GuestLayout';
import InputError from '../../components/ui/InputError';
import InputLabel from '../../components/ui/InputLabel';
import PrimaryButton from '../../components/ui/PrimaryButton';
import TextInput from '../../components/ui/TextInput';

export default function ForgotPassword({ onNavigate, isDarkMode, toggleDarkMode }) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setError(null);
        setStatus(null);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin, 
            });
            if (error) throw error;
            setStatus("Password reset link emailed!");
        } catch (err) {
            setError(err.message);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <GuestLayout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}>
            <div className="space-y-4">
                <div className="space-y-1">
                    <p className="inline-flex items-center gap-2 rounded-full bg-[#ce2727]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#ce2727] ring-1 ring-[#ce2727]/30">
                        Recovery
                    </p>
                    <div className="space-y-0.5">
                        <h1 className="text-xl font-semibold text-[#ce2727]">
                            Forgot password?
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            No problem. Just let us know your email address and we will email you a password reset link.
                        </p>
                    </div>
                </div>

                {status && (
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-600 text-sm font-bold">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                            id="email"
                            type="email"
                            className="mt-1 block w-full bg-slate-800/60 border-[#ce2727]/30 text-slate-100 placeholder:text-slate-500 focus:border-[#ce2727]/50 focus:ring-[#ce2727]/30"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            isFocused={true}
                        />
                        <InputError message={error} className="mt-2" />
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
                         <button
                            type="button"
                            onClick={() => onNavigate('LOGIN')}
                            className="text-xs font-bold text-slate-500 hover:text-[#ce2727] transition-colors"
                        >
                            &larr; Back to Login
                        </button>

                        <PrimaryButton disabled={processing} className="justify-center px-6 py-2 text-xs">
                            {processing ? 'Sending...' : 'Email Reset Link'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}