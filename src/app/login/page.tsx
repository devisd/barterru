'use client';

import { useState } from "react";
import { AuthModal } from "../../components/AuthModal";

export default function LoginPage() {
    const [open, setOpen] = useState(true);

    return (
        <main className="flex min-h-screen items-center justify-center">
            {open && <AuthModal onClose={() => setOpen(false)} />}
            {!open && (
                <div className="bg-white p-8 rounded-xl shadow text-center">
                    <h1 className="text-2xl font-bold mb-4">Вход</h1>
                    <button className="text-primary underline" onClick={() => setOpen(true)}>
                        Открыть форму входа
                    </button>
                </div>
            )}
        </main>
    );
} 