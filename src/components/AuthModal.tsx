'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import { GoogleLogin } from "@react-oauth/google";

const schema = z.object({
    email: z.string().email({ message: "Введите корректный email" }),
    password: z.string().min(4, "Минимум 4 символа"),
});

type FormData = z.infer<typeof schema>;

export function AuthModal({ onClose }: { onClose: () => void }) {
    const dispatch = useDispatch();
    const [mode, setMode] = useState<"login" | "register">("login");
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({ resolver: zodResolver(schema) });

    const onSubmit = (data: FormData) => {
        // Мок: всегда успешный вход
        dispatch(
            login({
                user: { id: 1, email: data.email, name: "Demo User" },
                token: "mock-jwt-token",
            })
        );
        localStorage.setItem("token", "mock-jwt-token");
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm relative">
                <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                    onClick={onClose}
                >
                    ×
                </button>
                <h2 className="text-xl font-bold mb-4 text-center">
                    {mode === "login" ? "Вход" : "Регистрация"}
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        {...register("email")}
                        className="w-full border rounded px-3 py-2"
                    />
                    {errors.email && <div className="text-red-500 text-xs">{errors.email.message}</div>}
                    <input
                        type="password"
                        placeholder="Пароль"
                        {...register("password")}
                        className="w-full border rounded px-3 py-2"
                    />
                    {errors.password && <div className="text-red-500 text-xs">{errors.password.message}</div>}
                    <button
                        type="submit"
                        className="w-full bg-primary text-white rounded px-3 py-2 font-semibold hover:bg-primary/90 transition"
                    >
                        {mode === "login" ? "Войти" : "Зарегистрироваться"}
                    </button>
                </form>
                <div className="my-4 text-center text-gray-500 text-xs">или</div>
                <div className="flex flex-col gap-2">
                    {/* Google OAuth */}
                    <GoogleLogin
                        onSuccess={() => {
                            dispatch(
                                login({
                                    user: { id: 2, email: "google@user.com", name: "Google User" },
                                    token: "mock-google-token",
                                })
                            );
                            localStorage.setItem("token", "mock-google-token");
                            onClose();
                        }}
                        onError={() => alert("Ошибка Google OAuth (мок)")}
                    />
                    {/* Telegram OAuth (заглушка) */}
                    <button
                        className="w-full border rounded px-3 py-2 flex items-center justify-center gap-2 hover:bg-gray-50"
                        onClick={() => {
                            dispatch(
                                login({
                                    user: { id: 3, email: "tg@user.com", name: "Telegram User" },
                                    token: "mock-tg-token",
                                })
                            );
                            localStorage.setItem("token", "mock-tg-token");
                            onClose();
                        }}
                        type="button"
                    >
                        <span>Войти через Telegram</span>
                    </button>
                    {/* Yandex OAuth (заглушка) */}
                    <button
                        className="w-full border rounded px-3 py-2 flex items-center justify-center gap-2 hover:bg-gray-50"
                        onClick={() => {
                            dispatch(
                                login({
                                    user: { id: 4, email: "ya@user.com", name: "Yandex User" },
                                    token: "mock-ya-token",
                                })
                            );
                            localStorage.setItem("token", "mock-ya-token");
                            onClose();
                        }}
                        type="button"
                    >
                        <span>Войти через Яндекс</span>
                    </button>
                </div>
                <div className="mt-4 text-center">
                    <button
                        className="text-primary underline text-sm"
                        onClick={() => setMode(mode === "login" ? "register" : "login")}
                    >
                        {mode === "login" ? "Нет аккаунта? Зарегистрироваться" : "Уже есть аккаунт? Войти"}
                    </button>
                </div>
            </div>
        </div>
    );
} 