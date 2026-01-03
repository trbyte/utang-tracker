import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import GuestLayout from '../../components/ui/GuestLayout';
import InputError from '../../components/ui/InputError';
import InputLabel from '../../components/ui/InputLabel';
import PrimaryButton from '../../components/ui/PrimaryButton';
import TextInput from '../../components/ui/TextInput';

// 1. Add onRegisterSuccess to the props here 👇
export default function Register({ onLoginClick, onRegisterSuccess, isDarkMode, toggleDarkMode }) {
    const [data, setData] = useState({ 
        name: '', 
        email: '', 
        password: '', 
        password_confirmation: '' 
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        if (data.password !== data.password_confirmation) {
            setErrors({ password_confirmation: "Passwords do not match" });
            setProcessing(false);
            return;
        }

        try {
            const { error } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: { data: { name: data.name } }
            });
            if (error) throw error;
            
            // 2.
            // Instead of alerting, we check if onRegisterSuccess exists and call it.
            if (onRegisterSuccess) {
                onRegisterSuccess(data.email); 
            } else {
                // Fallback for safety
                alert("Account created! Check your email to verify.");
                onLoginClick();
            }

        } catch (error) {
            setErrors({ email: error.message });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <GuestLayout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}>
            <div className="space-y-4">
                <div className="space-y-1">
                    <p className="inline-flex items-center gap-2 rounded-full bg-[#ce2727]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#ce2727] ring-1 ring-[#ce2727]/30">
                        Join Utang Tracker
                    </p>
                    <div className="space-y-0.5">
                        <h1 className="text-xl font-semibold text-[#ce2727]">
                            Create your account
                        </h1>
                        <p className="text-xs text-slate-400">
                            Save records, track debts, and unlock your financial dashboard.
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-3">
                        <div>
                            <InputLabel htmlFor="name" value="Name" />
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setData({ ...data, name: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                autoComplete="username"
                                onChange={(e) => setData({ ...data, email: e.target.value })}
                                required
                            />
                            <InputError message={errors.email} className="mt-1" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value="Password" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                autoComplete="new-password"
                                onChange={(e) => setData({ ...data, password: e.target.value })}
                                required
                            />
                            <InputError message={errors.password} className="mt-1" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                autoComplete="new-password"
                                onChange={(e) => setData({ ...data, password_confirmation: e.target.value })}
                                required
                            />
                            <InputError message={errors.password_confirmation} className="mt-1" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-1">
                        <button
                            type="button"
                            onClick={onLoginClick}
                            className="inline-flex items-center justify-center rounded-full border border-[#ce2727]/30 px-4 py-2 text-xs font-semibold text-[#ce2727] transition hover:border-[#ce2727]/50 hover:bg-[#ce2727]/10 hover:text-red-400"
                        >
                            Already have an account?
                        </button>

                        <PrimaryButton className="justify-center px-6 py-2 text-xs" disabled={processing}>
                            Create account
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}