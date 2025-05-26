'use client';

import { useEffect, useState } from "react";
import { addView } from "../../../store/historyDb";
import { useGetProductsQuery } from "../../../store/productsApi";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import dynamic from "next/dynamic";
import type { LatLngExpression } from "leaflet";
import { ChatModal } from "../../../components/ChatModal";

const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });

export default function ProductPage({ params }: { params: { id: string } }) {
    useEffect(() => {
        addView(Number(params.id));
    }, [params.id]);
    const { data: products = [] } = useGetProductsQuery();
    const product = products.find((p: any) => p.id === Number(params.id));
    const [showChat, setShowChat] = useState(false);
    if (!product) return <div className="text-center py-12">Товар не найден</div>;
    const coords = product.coords as LatLngExpression;
    return (
        <main className="max-w-3xl mx-auto py-8 px-2">
            <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row gap-8">
                <div className="flex-1 min-w-[280px]">
                    {/* Галерея Swiper */}
                    <Swiper spaceBetween={10} slidesPerView={1} className="mb-4 rounded-lg overflow-hidden">
                        {[product.image, product.image, product.image].map((img: string, i: number) => (
                            <SwiperSlide key={i}>
                                <img src={img} alt={product.title} className="w-full h-64 object-cover" />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    {/* Карта */}
                    {product.coords && (
                        <div className="h-48 rounded-lg overflow-hidden">
                            <MapContainer center={coords} zoom={12} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <Marker position={coords} />
                            </MapContainer>
                        </div>
                    )}
                </div>
                <div className="flex-1 flex flex-col gap-4">
                    <h1 className="text-2xl font-bold">{product.title}</h1>
                    <div className="text-primary font-bold text-lg">{product.price}</div>
                    <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag: string) => (
                            <span key={tag} className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                    </div>
                    <div className="text-gray-500 text-sm">{product.location}</div>
                    <button
                        className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
                        onClick={() => setShowChat(true)}
                    >
                        Начать обмен
                    </button>
                    {showChat && (
                        <ChatModal onClose={() => setShowChat(false)} productId={product.id} />
                    )}
                </div>
            </div>
        </main>
    );
} 