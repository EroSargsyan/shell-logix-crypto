import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICoin, ITempWatchlistState } from '@/app/types/types';

const initialState: ITempWatchlistState = {
  icon: '🦄',
  selectedCoins: [],
};

const tempWatchlistSlice = createSlice({
  name: 'tempWatchlist',
  initialState,
  reducers: {
    setSelectedCoins: (state, action: PayloadAction<ICoin[]>) => {
      state.selectedCoins = action.payload;
    },

    clearTempWatchlist: (state) => {
      state.icon = '🦄';
      state.selectedCoins = [];
    },
  },
});

export const { setSelectedCoins, clearTempWatchlist } = tempWatchlistSlice.actions;

export default tempWatchlistSlice.reducer;
