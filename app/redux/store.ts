import { configureStore } from '@reduxjs/toolkit';
import coinsReducer from './slices/coinsSlice';
import watchlistsReducer from './slices/watchlistsSlice';
import tempWatchlistsReducer from './slices/tempWatchlistsSlice';
export const store = configureStore({
  reducer: {
    coins: coinsReducer,
    watchlists: watchlistsReducer,
    tempWatchlists: tempWatchlistsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
