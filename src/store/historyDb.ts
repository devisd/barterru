import { openDB } from 'idb';

const DB_NAME = 'barter-history';
const STORE_NAME = 'views';

export async function addView(productId: number) {
    const db = await openDB(DB_NAME, 1, {
        upgrade(db) {
            db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        },
    });
    await db.put(STORE_NAME, { id: productId, viewedAt: Date.now() });
}

export async function getViews(): Promise<{ id: number; viewedAt: number }[]> {
    const db = await openDB(DB_NAME, 1, {
        upgrade(db) {
            db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        },
    });
    return (await db.getAll(STORE_NAME)).sort((a, b) => b.viewedAt - a.viewedAt);
}

export async function clearViews() {
    const db = await openDB(DB_NAME, 1, {
        upgrade(db) {
            db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        },
    });
    await db.clear(STORE_NAME);
} 