'use client';

import { useEffect, useState } from "react";

export function CookieConsent() {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        if (!localStorage.getItem("cookie_consent")) {
            setVisible(true);
        }
    }, []);
    if (!visible) return null;
    return (
        <div className="fixed bottom-4 left-0 w-full flex justify-center z-50">
            <div className="bg-white border shadow-lg rounded-xl px-6 py-4 flex flex-col sm:flex-row items-center gap-4 max-w-xl w-full mx-2">
                <span className="flex-1 text-sm text-gray-700">
                    Мы используем cookie для улучшения работы сайта. Продолжая пользоваться сайтом, вы соглашаетесь с нашей политикой.
                </span>
                <button
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition"
                    onClick={() => {
                        localStorage.setItem("cookie_consent", "1");
                        setVisible(false);
                    }}
                >
                    Ок
                </button>
            </div>
        </div>
    );
} 