import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import GuestLayout from '../../components/ui/GuestLayout';
import InputError from '../../components/ui/InputError';
import InputLabel from '../../components/ui/InputLabel';
import PrimaryButton from '../../components/ui/PrimaryButton';
import TextInput from '../../components/ui/TextInput';

export default function ResetPassword({ onNavigate, isDarkMode, toggleDarkMode }) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);

    const submit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setProcessing(true);
        setError(null);

        try {
            const { error } = await supabase.auth.updateUser({ password: password });
            if (error) throw error;
            
            alert('Password updated successfully!');
            window.location.href = "/"; 
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
                        Security
                    </p>
                    <div className="space-y-0.5">
                        <h1 className="text-xl font-semibold text-[#ce2727]">
                            Reset Password
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Please enter your new secure password.
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <InputLabel htmlFor="password" value="New Password" />
                        <TextInput
                            id="password"
                            type="password"
                            className="mt-1 block w-full bg-slate-800/60 border-[#ce2727]/30 text-slate-100 placeholder:text-slate-500 focus:border-[#ce2727]/50 focus:ring-[#ce2727]/30"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            isFocused={true}
                        />
                    </div>

                    <div>
                        <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            className="mt-1 block w-full bg-slate-800/60 border-[#ce2727]/30 text-slate-100 placeholder:text-slate-500 focus:border-[#ce2727]/50 focus:ring-[#ce2727]/30"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <InputError message={error} className="mt-2" />
                    </div>

                    <div className="flex justify-end pt-2">
                        <PrimaryButton disabled={processing} className="w-full justify-center px-6 py-2 text-xs">
                            {processing ? 'Updating...' : 'Reset Password'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}