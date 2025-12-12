import {configureStore} from "@reduxjs/toolkit";
import {authApi} from "./features/authApi";
import {roomApi} from "./features/roomApi";
import {messageApi} from "./features/messageApi";
import {meApi} from "./features/meApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [roomApi.reducerPath]: roomApi.reducer,
    [messageApi.reducerPath]: messageApi.reducer,
    [meApi.reducerPath]: meApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      roomApi.middleware,
      messageApi.middleware,
      meApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
