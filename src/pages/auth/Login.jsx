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
                // Feature: Check if error is due to unverified email
                if (error.message.includes('Email not confirmed') && onUnverified) {
                    onUnverified(data.email); // Redirect to Verify Page
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
            <div className="space-y-6">
                {status && (
                    <div className="rounded-xl border border-green-400/30 bg-green-400/10 px-4 py-3 text-sm font-medium text-green-400">
                        {status}
                    </div>
                )}

                <div className="space-y-2">
                    <p className="inline-flex items-center gap-2 rounded-full bg-[#ce2727]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#ce2727] ring-1 ring-[#ce2727]/30">
                        Welcome back
                    </p>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold text-[#ce2727]">
                            Sign in to continue
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Access your dashboard and continue your financial journey.
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData({ ...data, email: e.target.value })}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <InputLabel htmlFor="password" value="Password" />
                                <button
                                    type="button"
                                    onClick={onForgotPasswordClick}
                                    className="text-sm font-semibold text-[#ce2727] hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-[#ce2727]/50 focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full"
                                autoComplete="current-password"
                                onChange={(e) => setData({ ...data, password: e.target.value })}
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-[#ce2727]/5 dark:bg-[#ce2727]/10 px-4 py-3 ring-1 ring-[#ce2727]/20">
                        <label className="flex items-center gap-3">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData({ ...data, remember: e.target.checked })}
                            />
                            <span className="text-sm text-slate-600 dark:text-slate-200">Remember me</span>
                        </label>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">lock</span>
                            Secure
                        </span>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <button
                            type="button"
                            onClick={onRegisterClick}
                            className="inline-flex items-center justify-center rounded-full border border-[#ce2727]/30 px-4 py-2 text-sm font-semibold text-[#ce2727] transition hover:border-[#ce2727]/50 hover:bg-[#ce2727]/10 hover:text-red-400"
                        >
                            Create account
                        </button>
            
                        <PrimaryButton className="justify-center px-6" disabled={processing}>
                            Log in
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}