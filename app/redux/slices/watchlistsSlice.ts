import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICoin, IWatchlist, IWatchlistsState } from '@/app/types/types';

const initialState: IWatchlistsState = {
  items: [],
};

const watchlistsSlice = createSlice({
  name: 'watchlists',
  initialState,
  reducers: {
    createWatchlist: (
      state,
      action: PayloadAction<{
        id: string;
        icon: string;
        name: string;
        coins: ICoin[];
      }>,
    ) => {
      const { id, icon, name, coins } = action.payload;
      state.items.push({
        id,
        icon,
        name,
        coinCount: coins.length,
        coins,
      });
    },

    updateWatchlist: (
      state,
      action: PayloadAction<{
        watchlistId: string;
        newName?: string;
        newIcon?: any;
        newCoins?: ICoin[];
      }>,
    ) => {
      const { watchlistId, newName, newIcon, newCoins } = action.payload;
      const watchlist = state.items.find((w) => w.id === watchlistId);
      if (!watchlist) return;

      if (newName) watchlist.name = newName;
      if (newIcon) watchlist.icon = newIcon;
      if (newCoins !== undefined) {
        watchlist.coins = newCoins;
        watchlist.coinCount = newCoins.length;
      }
    },
    deleteWatchlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((watchlist) => watchlist.id !== action.payload);
    },
  },
});

export const { createWatchlist, updateWatchlist, deleteWatchlist } = watchlistsSlice.actions;
export default watchlistsSlice.reducer;
