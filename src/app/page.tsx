'use client';

import { useRef, useState, useMemo } from "react";
import { useGetProductsQuery, useGetCategoriesQuery, useGetTagsQuery } from "../store/productsApi";
import { ProductCard } from "../components/ProductCard";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Listbox } from "@headlessui/react";

const defaultRadius = 100; // км

function getDistanceKm([lat1, lon1]: [number, number], [lat2, lon2]: [number, number]) {
  // Haversine formula
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function Home() {
  const parentRef = useRef<HTMLDivElement>(null);
  const { data: products = [], isLoading } = useGetProductsQuery();
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: tags = [] } = useGetTagsQuery();

  // Фильтры
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [radius, setRadius] = useState<number>(defaultRadius);
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);

  // Получить геолокацию пользователя
  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserCoords([pos.coords.latitude, pos.coords.longitude]);
      });
    }
  };

  // Фильтрация товаров
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (selectedTag && !p.tags.includes(selectedTag)) return false;
      if (userCoords && p.coords) {
        const dist = getDistanceKm(userCoords, p.coords);
        if (dist > radius) return false;
      }
      return true;
    });
  }, [products, selectedCategory, selectedTag, userCoords, radius]);

  const rowVirtualizer = useVirtualizer({
    count: filteredProducts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 320,
    overscan: 6,
  });

  return (
    <main className="min-h-screen bg-secondary px-2 py-6">
      <h1 className="text-3xl font-bold mb-6 text-primary">Лента товаров</h1>
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        {/* Категории */}
        <Listbox value={selectedCategory} onChange={setSelectedCategory}>
          <div className="relative">
            <Listbox.Button className="border rounded px-3 py-2 bg-white min-w-[140px]">
              {selectedCategory || "Категория"}
            </Listbox.Button>
            <Listbox.Options className="absolute z-10 mt-1 bg-white border rounded shadow w-full">
              <Listbox.Option value={null} className="px-3 py-2 cursor-pointer hover:bg-gray-100">
                Все категории
              </Listbox.Option>
              {categories.map((cat) => (
                <Listbox.Option key={cat} value={cat} className="px-3 py-2 cursor-pointer hover:bg-gray-100">
                  {cat}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
        {/* Теги */}
        <Listbox value={selectedTag} onChange={setSelectedTag}>
          <div className="relative">
            <Listbox.Button className="border rounded px-3 py-2 bg-white min-w-[120px]">
              {selectedTag || "Тег"}
            </Listbox.Button>
            <Listbox.Options className="absolute z-10 mt-1 bg-white border rounded shadow w-full">
              <Listbox.Option value={null} className="px-3 py-2 cursor-pointer hover:bg-gray-100">
                Все теги
              </Listbox.Option>
              {tags.map((tag) => (
                <Listbox.Option key={tag} value={tag} className="px-3 py-2 cursor-pointer hover:bg-gray-100">
                  {tag}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
        {/* Радиус поиска */}
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={10}
            max={500}
            step={10}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            disabled={!userCoords}
          />
          <span className="text-sm text-gray-700">{radius} км</span>
          <button
            className="ml-2 px-3 py-2 rounded bg-primary text-white hover:bg-primary/90 transition"
            onClick={handleDetectLocation}
            type="button"
          >
            {userCoords ? "Гео-активно" : "Определить гео"}
          </button>
        </div>
      </div>
      {isLoading ? (
        <div className="text-center text-gray-500">Загрузка...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center text-gray-500">Нет товаров по выбранным фильтрам</div>
      ) : (
        <div
          ref={parentRef}
          className="relative h-[80vh] overflow-auto border rounded-xl bg-white shadow"
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const product = filteredProducts[virtualRow.index];
              return (
                <div
                  key={product.id}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <ProductCard product={product} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}
