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
            <div className="space-y-3">
                <div className="space-y-0.5">
                    <p className="inline-flex items-center gap-1.5 rounded-full bg-[#ce2727]/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#ce2727] ring-1 ring-[#ce2727]/30">
                        Recovery
                    </p>
                    <div>
                        <h1 className="text-lg sm:text-xl font-semibold text-[#ce2727]">
                            Forgot password?
                        </h1>
                        <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                            Enter your email to receive a reset link.
                        </p>
                    </div>
                </div>

                {status && (
                    <div className="p-2 bg-green-500/10 border border-green-500/20 rounded-lg text-green-600 text-[10px] sm:text-xs font-bold">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-3">
                    <div>
                        <InputLabel htmlFor="email" value="Email" className="text-[10px] sm:text-xs" />
                        <TextInput
                            id="email"
                            type="email"
                            className="mt-1 block w-full py-2 text-xs sm:text-sm bg-slate-800/60 border-[#ce2727]/30 text-slate-100 placeholder:text-slate-500 focus:border-[#ce2727]/50 focus:ring-[#ce2727]/30"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            isFocused={true}
                        />
                        <InputError message={error} className="mt-1" />
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-1">
                         <button
                            type="button"
                            onClick={() => onNavigate('LOGIN')}
                            className="text-[10px] font-bold text-slate-500 hover:text-[#ce2727] transition-colors order-2 sm:order-1"
                        >
                            &larr; Back to Login
                        </button>

                        <PrimaryButton disabled={processing} className="justify-center px-4 py-1.5 text-[7.5px] sm:text-xs order-1 sm:order-2">
                            {processing ? 'Sending...' : 'Email Reset Link'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}