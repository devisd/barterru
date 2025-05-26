'use client';

import { useState, useEffect } from "react";
import { Tabs } from "../../components/Tabs";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { getViews, clearViews } from "../../store/historyDb";
import { useGetProductsQuery, useGetFavoritesQuery, useRemoveFavoriteMutation } from "../../store/productsApi";

function ContactsSection() {
    type ContactKey = 'email' | 'phone' | 'telegram';
    type Contact = { value: string; visible: boolean };
    const [contacts, setContacts] = useState<Record<ContactKey, Contact>>({
        email: { value: "user@email.com", visible: true },
        phone: { value: "+7 999 123-45-67", visible: false },
        telegram: { value: "@user", visible: true },
    });
    return (
        <div className="mb-6 p-4 bg-white rounded-xl shadow">
            <h2 className="font-bold mb-2">Контакты</h2>
            {Object.entries(contacts).map(([key, c]) => (
                <div key={key} className="flex items-center gap-2 mb-2">
                    <span className="w-24 capitalize">{key}</span>
                    <input
                        className="border rounded px-2 py-1 flex-1"
                        value={c.value}
                        onChange={e => setContacts(cs => ({ ...cs, [key as ContactKey]: { ...cs[key as ContactKey], value: e.target.value } }))}
                    />
                    <label className="flex items-center gap-1 text-xs">
                        <input
                            type="checkbox"
                            checked={c.visible}
                            onChange={e => setContacts(cs => ({ ...cs, [key as ContactKey]: { ...cs[key as ContactKey], visible: e.target.checked } }))}
                        />
                        Показать
                    </label>
                </div>
            ))}
        </div>
    );
}

function MyAdsTab() {
    // Моки объявлений пользователя
    const ads = [
        { id: 1, title: "iPhone 14 Pro", status: "active" },
        { id: 2, title: "Велосипед Trek FX 3", status: "inactive" },
    ];
    return (
        <div>
            <h3 className="font-semibold mb-2">Мои объявления</h3>
            <ul>
                {ads.map(ad => (
                    <li key={ad.id} className="mb-2 p-2 bg-gray-50 rounded flex justify-between items-center">
                        <span>{ad.title}</span>
                        <span className={`text-xs px-2 py-1 rounded ${ad.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}`}>{ad.status === "active" ? "Активно" : "Неактивно"}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function ViewsHistoryTab() {
    const [history, setHistory] = useState<{ id: number; viewedAt: number }[]>([]);
    const { data: products = [] } = useGetProductsQuery();
    useEffect(() => {
        getViews().then(setHistory);
    }, []);
    const viewedProducts = history
        .map((h) => products.find((p) => p.id === h.id))
        .filter(Boolean);
    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">История просмотров</h3>
                <button
                    className="text-xs text-primary underline"
                    onClick={async () => {
                        await clearViews();
                        setHistory([]);
                    }}
                >
                    Очистить
                </button>
            </div>
            {viewedProducts.length === 0 ? (
                <div className="text-gray-500">Нет истории просмотров</div>
            ) : (
                <ul>
                    {viewedProducts.map((p: any) => (
                        <li key={p.id} className="mb-2 p-2 bg-gray-50 rounded">
                            {p.title}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

function FavoritesTab() {
    const { data: favorites = [], refetch } = useGetFavoritesQuery();
    const [removeFavorite] = useRemoveFavoriteMutation();
    return (
        <div>
            <h3 className="font-semibold mb-2">Избранное</h3>
            {favorites.length === 0 ? (
                <div className="text-gray-500">Нет избранных товаров</div>
            ) : (
                <ul>
                    {favorites.map((p: any) => (
                        <li key={p.id} className="mb-2 p-2 bg-gray-50 rounded flex justify-between items-center">
                            <span>{p.title}</span>
                            <button
                                className="text-xs text-red-500 underline"
                                onClick={async () => {
                                    await removeFavorite(p.id);
                                    refetch();
                                }}
                            >
                                Удалить
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default function ProfilePage() {
    const user = useSelector((state: RootState) => state.auth.user);
    return (
        <main className="max-w-2xl mx-auto py-8 px-2">
            <div className="bg-white rounded-xl shadow p-6 mb-6">
                <h1 className="text-2xl font-bold mb-2">Профиль</h1>
                <div className="text-gray-600 mb-2">{user?.email || "demo@user.com"}</div>
            </div>
            <ContactsSection />
            <Tabs
                tabs={[
                    { label: "Мои объявления", key: "ads", content: <MyAdsTab /> },
                    { label: "История просмотров", key: "history", content: <ViewsHistoryTab /> },
                    { label: "Избранное", key: "fav", content: <FavoritesTab /> },
                ]}
            />
        </main>
    );
} 