'use client';

import { useEffect, useRef, useState } from "react";

type Message = {
    id: number;
    text: string;
    fromMe: boolean;
    timestamp: number;
};

export function ChatModal({ onClose, productId }: { onClose: () => void; productId: number }) {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Здравствуйте! Готовы к обмену?", fromMe: false, timestamp: Date.now() - 60000 },
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Мок: имитация входящих сообщений
    useEffect(() => {
        const timer = setTimeout(() => {
            setMessages((msgs) => [
                ...msgs,
                { id: Date.now(), text: "Напишите, что вас интересует в обмен", fromMe: false, timestamp: Date.now() },
            ]);
            if (Notification.permission === "granted") {
                new Notification("Новое сообщение в чате", { body: "Напишите, что вас интересует в обмен" });
            }
        }, 8000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages((msgs) => [
            ...msgs,
            { id: Date.now(), text: input, fromMe: true, timestamp: Date.now() },
        ]);
        setInput("");
    };

    // Запросить разрешение на уведомления
    useEffect(() => {
        if (Notification.permission === "default") {
            Notification.requestPermission();
        }
    }, []);

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative flex flex-col">
                <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={onClose}>×</button>
                <h2 className="text-xl font-bold mb-4">Чат по товару #{productId}</h2>
                <div className="flex-1 overflow-y-auto mb-4 max-h-64">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`mb-2 flex ${msg.fromMe ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`px-3 py-2 rounded-lg max-w-[70%] text-sm ${msg.fromMe ? "bg-primary text-white" : "bg-gray-100 text-gray-800"
                                    }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className="flex gap-2">
                    <input
                        className="flex-1 border rounded px-3 py-2"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Введите сообщение..."
                    />
                    <button
                        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition"
                        onClick={handleSend}
                    >
                        Отправить
                    </button>
                </div>
            </div>
        </div>
    );
} 