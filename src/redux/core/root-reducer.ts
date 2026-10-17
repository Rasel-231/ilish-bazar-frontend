import { combineReducers } from "@reduxjs/toolkit";

import { baseApi } from "../baseApi/baseApi";

export const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
