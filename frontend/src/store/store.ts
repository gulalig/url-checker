import { configureStore } from '@reduxjs/toolkit';

const appReducer = (state: Record<string, never> = {}) => state;

export const store = configureStore({
  reducer: {
    app: appReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;