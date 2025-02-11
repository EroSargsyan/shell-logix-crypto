import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ICoin, IWatchlistsState } from '@/app/types/types';

const initialState: IWatchlistsState = {
  items: [],
  selectedWatchlistId: null,
};

const watchlistsSlice = createSlice({
  name: 'watchlists',
  initialState,
  reducers: {
    createWatchlist: (state, action: PayloadAction<{ id: string; name: string }>) => {
      state.items.push({ id: action.payload.id, name: action.payload.name, coins: [] });
    },
    addCoinsToWatchlist: (
      state,
      action: PayloadAction<{ watchlistId: string; coins: ICoin[] }>,
    ) => {
      const watchlist = state.items.find((w) => w.id === action.payload.watchlistId);
      if (watchlist) {
        const existingCoinIds = new Set(watchlist.coins.map((c) => c.id));
        const newCoins = action.payload.coins.filter((coin) => !existingCoinIds.has(coin.id));
        watchlist.coins.push(...newCoins);
      }
    },
    removeCoinFromWatchlist: (
      state,
      action: PayloadAction<{ watchlistId: string; coinId: string }>,
    ) => {
      const watchlist = state.items.find((w) => w.id === action.payload.watchlistId);
      if (watchlist) {
        watchlist.coins = watchlist.coins.filter((coin) => coin.id !== action.payload.coinId);
      }
    },
    selectWatchlist: (state, action: PayloadAction<string>) => {
      state.selectedWatchlistId = action.payload;
    },
  },
});

export const { createWatchlist, addCoinsToWatchlist, removeCoinFromWatchlist, selectWatchlist } =
  watchlistsSlice.actions;

export default watchlistsSlice.reducer;
