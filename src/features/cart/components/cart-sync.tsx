"use client";

import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/redux/core/hooks";

import {
  hydrateCart,
  selectCartHydrated,
  selectCartItems,
} from "../store/cart-slice";
import type { CartItem } from "../types/cart.types";

export const CART_STORAGE_KEY = "ilish-bazar-cart-v1";

/**
 * Keeps the Redux cart in sync with localStorage. Mock data has no backend yet,
 * so this is the persistence layer until the RTK Query cart API is wired in.
 */
export function CartSync() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const hydrated = useAppSelector(selectCartHydrated);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CART_STORAGE_KEY);
      const stored = raw ? (JSON.parse(raw) as CartItem[]) : [];
      dispatch(hydrateCart(Array.isArray(stored) ? stored : []));
    } catch {
      dispatch(hydrateCart([]));
    }
  }, [dispatch]);

  useEffect(() => {
    if (!hydrated) return;

    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage can be unavailable in private mode — the in-memory cart still works.
    }
  }, [hydrated, items]);

  return null;
}
