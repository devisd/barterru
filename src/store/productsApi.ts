import { createApi } from '@reduxjs/toolkit/query/react';

// Моковые данные
const mockProducts = [
    {
        id: 1,
        title: 'iPhone 14 Pro',
        image: 'https://placehold.co/300x200?text=iPhone+14+Pro',
        price: 'Обмен на MacBook',
        tags: ['электроника', 'смартфон'],
        category: 'Электроника',
        location: 'Москва',
        coords: [55.7558, 37.6176],
    },
    {
        id: 2,
        title: 'Велосипед Trek FX 3',
        image: 'https://placehold.co/300x200?text=Trek+FX+3',
        price: 'Обмен на электросамокат',
        tags: ['спорт', 'транспорт'],
        category: 'Транспорт',
        location: 'Санкт-Петербург',
        coords: [59.9343, 30.3351],
    },
    {
        id: 3,
        title: 'Кофемашина DeLonghi',
        image: 'https://placehold.co/300x200?text=DeLonghi',
        price: 'Обмен на смартфон',
        tags: ['бытовая техника'],
        category: 'Бытовая техника',
        location: 'Казань',
        coords: [55.7963, 49.1088],
    },
];

// Моковое "хранилище" избранного (на время сессии)
let favoriteIds: number[] = [];

export const productsApi = createApi({
    reducerPath: 'productsApi',
    baseQuery: async () => ({ data: mockProducts }), // моковый baseQuery
    endpoints: (builder) => ({
        getProducts: builder.query<any[], void>({
            query: () => '',
        }),
        getCategories: builder.query<string[], void>({
            queryFn: async () => {
                const categories = Array.from(new Set(mockProducts.map(p => p.category)));
                return { data: categories };
            },
        }),
        getTags: builder.query<string[], void>({
            queryFn: async () => {
                const tags = Array.from(new Set(mockProducts.flatMap(p => p.tags)));
                return { data: tags };
            },
        }),
        getFavorites: builder.query<any[], void>({
            queryFn: async () => {
                const favs = mockProducts.filter(p => favoriteIds.includes(p.id));
                return { data: favs };
            },
        }),
        addFavorite: builder.mutation<{ success: boolean }, number>({
            queryFn: async (id) => {
                if (!favoriteIds.includes(id)) favoriteIds.push(id);
                return { data: { success: true } };
            },
        }),
        removeFavorite: builder.mutation<{ success: boolean }, number>({
            queryFn: async (id) => {
                favoriteIds = favoriteIds.filter(favId => favId !== id);
                return { data: { success: true } };
            },
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetCategoriesQuery,
    useGetTagsQuery,
    useGetFavoritesQuery,
    useAddFavoriteMutation,
    useRemoveFavoriteMutation,
} = productsApi; 