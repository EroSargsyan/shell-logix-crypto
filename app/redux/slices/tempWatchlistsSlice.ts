import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICoin, ITempWatchlistState } from '@/app/types/types';

const initialState: ITempWatchlistState = {
  tempWatchlist: [],
};

const tempWatchlistSlice = createSlice({
  name: 'tempWatchlist',
  initialState,
  reducers: {
    setTempWatchlist: (state, action: PayloadAction<ICoin[]>) => {
      state.tempWatchlist = action.payload;
    },

    clearTempWatchlist: (state) => {
      state.tempWatchlist = [];
    },
  },
});

export const { setTempWatchlist, clearTempWatchlist } = tempWatchlistSlice.actions;

export default tempWatchlistSlice.reducer;
