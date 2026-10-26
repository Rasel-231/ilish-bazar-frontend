import { combineReducers } from "@reduxjs/toolkit";

import { cartReducer } from "@/features/cart/store/cart-slice";

import { baseApi } from "../api/base-api";

export const rootReducer = combineReducers({
  cart: cartReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
