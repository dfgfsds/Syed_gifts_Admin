import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Store } from '../types';

interface StoreState {
  stores: Store[];
  loading: boolean;
  createStore: (store: Omit<Store, 'id' | 'createdAt'>) => void;
  updateStore: (id: string, updates: Partial<Store>) => void;
  deleteStore: (id: string) => void;
  getStoresByOwner: (ownerId: string) => Store[];
}

export const useStoreStore = create<StoreState>()(
  persist(
    (set, get) => ({
      stores: [],
      loading: false,
      createStore: (storeData) => {
        const store: Store = {
          ...storeData,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ stores: [...state.stores, store] }));
      },
      updateStore: (id, updates) => {
        set((state) => ({
          stores: state.stores.map((store) =>
            store.id === id ? { ...store, ...updates } : store
          ),
        }));
      },
      deleteStore: (id) => {
        set((state) => ({
          stores: state.stores.filter((store) => store.id !== id),
        }));
      },
      getStoresByOwner: (ownerId) => {
        return get().stores.filter((store) => store.ownerId === ownerId);
      },
    }),
    {
      name: 'store-storage',
    }
  )
);