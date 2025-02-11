import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICoin, IWatchlistsState } from '@/app/types/types';

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
        name: string;
        icon: string;
        coins: ICoin[];
      }>,
    ) => {
      const { id, name, icon, coins } = action.payload;
      state.items.push({
        id,
        icon,
        name,
        coinCount: coins.length,
        coins,
      });
    },
  },
});

export const { createWatchlist } = watchlistsSlice.actions;
export default watchlistsSlice.reducer;
