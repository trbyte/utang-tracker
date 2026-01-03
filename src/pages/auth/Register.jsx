import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import GuestLayout from '../../components/ui/GuestLayout';
import InputError from '../../components/ui/InputError';
import InputLabel from '../../components/ui/InputLabel';
import PrimaryButton from '../../components/ui/PrimaryButton';
import TextInput from '../../components/ui/TextInput';

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
            
            if (onRegisterSuccess) {
                onRegisterSuccess(data.email); 
            } else {
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
            <div className="space-y-3">
                <div className="space-y-0.5">
                    <p className="inline-flex items-center gap-1.5 rounded-full bg-[#ce2727]/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#ce2727] ring-1 ring-[#ce2727]/30">
                        Join us
                    </p>
                    <div>
                        <h1 className="text-lg sm:text-xl font-semibold text-[#ce2727]">
                            Create account
                        </h1>
                        <p className="text-[10px] text-slate-400">
                            Start tracking and managing your finances today.
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-3">
                    <div className="space-y-2">
                        <div>
                            <InputLabel htmlFor="name" value="Name" className="text-[10px]" />
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="mt-0.5 block w-full py-1.5 text-xs"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setData({ ...data, name: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value="Email" className="text-[10px]" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-0.5 block w-full py-1.5 text-xs"
                                autoComplete="username"
                                onChange={(e) => setData({ ...data, email: e.target.value })}
                                required
                            />
                            <InputError message={errors.email} className="mt-0.5" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value="Password" className="text-[10px]" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-0.5 block w-full py-1.5 text-xs"
                                autoComplete="new-password"
                                onChange={(e) => setData({ ...data, password: e.target.value })}
                                required
                            />
                            <InputError message={errors.password} className="mt-0.5" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password_confirmation" value="Confirm" className="text-[10px]" />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-0.5 block w-full py-1.5 text-xs"
                                autoComplete="new-password"
                                onChange={(e) => setData({ ...data, password_confirmation: e.target.value })}
                                required
                            />
                            <InputError message={errors.password_confirmation} className="mt-0.5" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-1">
                        <button
                            type="button"
                            onClick={onLoginClick}
                            className="inline-flex items-center justify-center rounded-full border border-[#ce2727]/30 px-3 py-1 text-[9px] sm:text-xs font-semibold text-[#ce2727] transition hover:border-[#ce2727]/50 hover:bg-[#ce2727]/10 hover:text-red-400 order-2 sm:order-1"
                        >
                            Log in instead?
                        </button>

                        <PrimaryButton className="justify-center px-4 py-1.5 text-[7.5px] sm:text-xs order-1 sm:order-2" disabled={processing}>
                            Create account
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}