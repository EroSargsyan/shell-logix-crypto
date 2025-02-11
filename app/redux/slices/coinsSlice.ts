import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCoinsMarkets } from '../../services/coinGecko.service';
import { ICoinsState } from '@/app/types/types';

export const getCoinsMarkets = createAsyncThunk(
  'coins/fetchCoinsMarkets',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchCoinsMarkets();
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

const initialState: ICoinsState = {
  items: [],
  status: 'idle',
  error: null,
};

const coinsSlice = createSlice({
  name: 'coins',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCoinsMarkets.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getCoinsMarkets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(getCoinsMarkets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default coinsSlice.reducer;
