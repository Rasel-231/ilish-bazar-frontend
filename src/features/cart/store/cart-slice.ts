import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { CartItem, CartState } from "../types/cart.types";
import {
  cartSubtotal,
  cartTotalPieces,
} from "../utils/cart.utils";

const initialState: CartState = {
  items: [],
  hydrated: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const incoming = action.payload;
      const existing = state.items.find((item) => item.id === incoming.id);

      if (existing) {
        existing.quantity = Math.min(99, existing.quantity + incoming.quantity);
        return;
      }

      state.items.push({
        ...incoming,
        quantity: Math.max(1, Math.min(99, incoming.quantity)),
      });
    },
    setItemQuantity(
      state,
      action: PayloadAction<{ id: string; quantity: number }>,
    ) {
      const item = state.items.find((entry) => entry.id === action.payload.id);
      if (!item) return;

      item.quantity = Math.max(1, Math.min(99, action.payload.quantity));
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
    hydrateCart(state, action: PayloadAction<CartItem[]>) {
      state.items = Array.isArray(action.payload) ? action.payload : [];
      state.hydrated = true;
    },
  },
});

export const {
  addItem,
  setItemQuantity,
  removeItem,
  clearCart,
  hydrateCart,
} = cartSlice.actions;

export const cartReducer = cartSlice.reducer;

type CartRoot = { cart: CartState };

export const selectCartItems = (state: CartRoot) => state.cart.items;
export const selectCartCount = (state: CartRoot) =>
  cartTotalPieces(state.cart.items);
export const selectCartSubtotal = (state: CartRoot) =>
  cartSubtotal(state.cart.items);
export const selectCartHydrated = (state: CartRoot) => state.cart.hydrated;
