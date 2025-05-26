'use client';

import { useGetFavoritesQuery, useAddFavoriteMutation, useRemoveFavoriteMutation } from "../store/productsApi";
import { useEffect, useState } from "react";
import Image from "next/image";

type Product = {
    id: number;
    title: string;
    image: string;
    price: string;
    tags: string[];
    location: string;
};

export function ProductCard({ product }: { product: Product }) {
    const { data: favorites = [], refetch } = useGetFavoritesQuery();
    const [addFavorite] = useAddFavoriteMutation();
    const [removeFavorite] = useRemoveFavoriteMutation();
    const [isFav, setIsFav] = useState(false);

    useEffect(() => {
        setIsFav(favorites.some((f: any) => f.id === product.id));
    }, [favorites, product.id]);

    return (
        <div className="product-card card-hover bg-white rounded-xl shadow p-4 flex flex-col">
            <img src={product.image} alt={product.title} className="rounded-lg mb-3 w-full h-40 object-cover" />
            <div className="flex-1">
                <h2 className="text-lg font-semibold mb-1">{product.title}</h2>
                <div className="text-primary font-bold mb-2">{product.price}</div>
                <div className="flex flex-wrap gap-1 mb-2">
                    {product.tags.map((tag) => (
                        <span key={tag} className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                </div>
                <div className="text-xs text-gray-500 mb-2">{product.location}</div>
                <button
                    className={`text-xs px-3 py-1 rounded border ${isFav ? "bg-primary text-white border-primary" : "bg-white text-primary border-primary"}`}
                    onClick={async () => {
                        if (isFav) {
                            await removeFavorite(product.id);
                        } else {
                            await addFavorite(product.id);
                        }
                        refetch();
                    }}
                >
                    {isFav ? "В избранном" : "В избранное"}
                </button>
            </div>
        </div>
    );
} 