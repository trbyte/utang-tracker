import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import GuestLayout from '../../components/ui/GuestLayout';
import InputError from '../../components/ui/InputError';
import InputLabel from '../../components/ui/InputLabel';
import PrimaryButton from '../../components/ui/PrimaryButton';
import TextInput from '../../components/ui/TextInput';
import Checkbox from '../../components/ui/CheckBox';

export default function Login({ onRegisterClick, onForgotPasswordClick, onUnverified, isDarkMode, toggleDarkMode }) {
    const [data, setData] = useState({ email: '', password: '', remember: false });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [status, setStatus] = useState(null);

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            });
            
            if (error) {
                if (error.message.includes('Email not confirmed') && onUnverified) {
                    onUnverified(data.email); 
                    return;
                }
                throw error;
            }
        } catch (error) {
            setErrors({ email: error.message });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <GuestLayout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}>
            <div className="space-y-3 sm:space-y-5">
                {status && (
                    <div className="rounded-lg border border-green-400/30 bg-green-400/10 px-3 py-2 text-[9px] sm:text-xs font-medium text-green-400">
                        {status}
                    </div>
                )}

                <div className="space-y-1">
                    <p className="inline-flex items-center gap-1.5 rounded-full bg-[#ce2727]/10 px-2 py-0.5 text-[8px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ce2727] ring-1 ring-[#ce2727]/30">
                        Welcome back
                    </p>
                    <div>
                        <h1 className="text-base sm:text-2xl font-semibold text-[#ce2727]">
                            Sign in
                        </h1>
                        <p className="text-[9px] sm:text-xs text-slate-500 dark:text-slate-400">
                            Access your dashboard to continue.
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-3 sm:space-y-4">
                    <div className="space-y-2">
                        <div>
                            <InputLabel htmlFor="email" value="Email" className="text-[9px] sm:text-xs" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full py-1.5 sm:py-2 text-[9px] sm:text-sm"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData({ ...data, email: e.target.value })}
                            />
                            <InputError message={errors.email} className="mt-1" />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <InputLabel htmlFor="password" value="Password" className="text-[9px] sm:text-xs" />
                                <button
                                    type="button"
                                    onClick={onForgotPasswordClick}
                                    className="text-[9px] sm:text-xs font-semibold text-[#ce2727] hover:text-red-400 focus:outline-none focus:underline"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="block w-full py-1.5 sm:py-2 text-[9px] sm:text-sm"
                                autoComplete="current-password"
                                onChange={(e) => setData({ ...data, password: e.target.value })}
                            />
                            <InputError message={errors.password} className="mt-1" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-[#ce2727]/5 dark:bg-[#ce2727]/10 px-2.5 py-1.5 sm:px-3 sm:py-2 ring-1 ring-[#ce2727]/20">
                        <label className="flex items-center gap-2">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData({ ...data, remember: e.target.checked })}
                            />
                            <span className="text-[9px] sm:text-xs text-slate-600 dark:text-slate-200">Remember me</span>
                        </label>
                        <span className="text-[8px] sm:text-[10px] text-slate-400 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[9px] sm:text-xs">lock</span>
                            Secure
                        </span>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-1">
                        <button
                            type="button"
                            onClick={onRegisterClick}
                            className="inline-flex items-center justify-center rounded-full border border-[#ce2727]/30 px-4 py-1.5 text-[9px] sm:text-xs font-semibold text-[#ce2727] transition hover:border-[#ce2727]/50 hover:bg-[#ce2727]/10 hover:text-red-400 order-2 sm:order-1"
                        >
                            Create account
                        </button>
            
                        <PrimaryButton className="justify-center px-5 py-1.5 text-[9px] sm:text-xs order-1 sm:order-2" disabled={processing}>
                            Log in
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}