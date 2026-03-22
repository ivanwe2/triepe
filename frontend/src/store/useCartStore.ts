import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  id: string;
  title: string;
  price: number;
  size: string;
  image: string;
  quantity: number;
};

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  isMenuOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string, size: string) => void;
  toggleCart: () => void;
  closeCart: () => void;
  toggleMenu: () => void;
  closeMenu: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isCartOpen: false,
      isMenuOpen: false,

      addItem: (newItem) => set((state) => {
        const existingItemIndex = state.items.findIndex(
          (item) => item.id === newItem.id && item.size === newItem.size
        );

        if (existingItemIndex > -1) {
          const updatedItems = [...state.items];
          updatedItems[existingItemIndex].quantity += newItem.quantity;
          return { items: updatedItems, isCartOpen: true };
        }

        return { items: [...state.items, newItem], isCartOpen: true };
      }),

      removeItem: (id, size) => set((state) => ({
        items: state.items.filter((item) => !(item.id === id && item.size === size))
      })),

      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen, isMenuOpen: false })),
      closeCart: () => set({ isCartOpen: false }),
      toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen, isCartOpen: false })),
      closeMenu: () => set({ isMenuOpen: false }),
    }),
    {
      name: 'triepe-cart-storage',
    }
  )
);