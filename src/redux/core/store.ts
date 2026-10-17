import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./root-reducer";
import { baseApi } from "../api/base-api";



export const makeStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
