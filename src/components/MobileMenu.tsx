'use client';

import { useState } from "react";
import Link from "next/link";

export function MobileMenu() {
    const [open, setOpen] = useState(false);
    return (
        <div className="md:hidden">
            <button
                className="fixed top-4 left-4 z-50 flex flex-col gap-1.5 w-10 h-10 justify-center items-center bg-white rounded-full shadow border border-gray-200"
                onClick={() => setOpen((v) => !v)}
                aria-label="Открыть меню"
            >
                <span className={`block w-6 h-0.5 bg-primary transition-all ${open ? "rotate-45 translate-y-2" : ""}`}></span>
                <span className={`block w-6 h-0.5 bg-primary transition-all ${open ? "opacity-0" : ""}`}></span>
                <span className={`block w-6 h-0.5 bg-primary transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`}></span>
            </button>
            {open && (
                <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setOpen(false)} />
            )}
            <nav
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="flex flex-col gap-4 p-8 pt-16">
                    <Link href="/" className="text-lg font-bold text-primary" onClick={() => setOpen(false)}>
                        Бартер.ру
                    </Link>
                    <Link href="/profile" className="text-gray-700 hover:text-primary" onClick={() => setOpen(false)}>
                        Профиль
                    </Link>
                    <Link href="/login" className="text-gray-700 hover:text-primary" onClick={() => setOpen(false)}>
                        Вход
                    </Link>
                    <Link href="/register" className="text-gray-700 hover:text-primary" onClick={() => setOpen(false)}>
                        Регистрация
                    </Link>
                </div>
            </nav>
        </div>
    );
} 