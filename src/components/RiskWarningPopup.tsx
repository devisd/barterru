'use client';

import { useEffect, useState } from "react";

export function RiskWarningPopup() {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        if (!localStorage.getItem("risk_warning_shown")) {
            setVisible(true);
        }
    }, []);
    if (!visible) return null;
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                <h2 className="text-xl font-bold mb-2 text-red-600">Внимание!</h2>
                <p className="mb-4 text-gray-700">
                    Никогда не переводите деньги незнакомым лицам и не отправляйте товары до получения обмена. Проверяйте репутацию пользователей и используйте безопасные способы передачи.
                </p>
                <button
                    className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90 transition"
                    onClick={() => {
                        localStorage.setItem("risk_warning_shown", "1");
                        setVisible(false);
                    }}
                >
                    Понятно
                </button>
            </div>
        </div>
    );
} 