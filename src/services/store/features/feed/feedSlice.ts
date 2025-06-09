import {
  getFeedsApi,
  getOrderByNumberApi,
  TFeedsResponse,
  TOrderResponse
} from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { RootState } from '../../store';
import { getIngredientsAsyncThunk } from '../ingredients/ingredientsSlice';

type TRootReducerState = {
  isLoading: boolean;
  feeds: TOrder[];
  total: number;
  totalToday: number;
  selectedOrders: TOrder[];
};

const initialState: TRootReducerState = {
  feeds: [],
  isLoading: false,
  total: 0,
  totalToday: 0,
  selectedOrders: []
};

export const getFeedsAsyncThunk = createAsyncThunk(
  'feed/getFeedsAsyncThunk',
  async function (): Promise<TFeedsResponse> {
    return getFeedsApi();
  }
);
export const getOrderByIDAsyncThunk = createAsyncThunk<
  TOrderResponse,
  number,
  { state: RootState }
>(
  'feed/getOrderByIDAsyncThunk',
  async function (id: number, { getState, dispatch }) {
    const ingredients = getState().ingredients.ingredients;
    if (!ingredients || ingredients.length === 0) {
      await dispatch(getIngredientsAsyncThunk());
    }

    return getOrderByNumberApi(id);
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {},
  extraReducers(builder) {
    builder
      .addCase(getFeedsAsyncThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getFeedsAsyncThunk.fulfilled,
        (state, action: PayloadAction<TFeedsResponse>) => {
          state.feeds = state.feeds = action.payload.orders;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
        }
      )
      .addCase(getFeedsAsyncThunk.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getOrderByIDAsyncThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getOrderByIDAsyncThunk.fulfilled,
        (state, action: PayloadAction<TOrderResponse>) => {
          state.selectedOrders = action.payload.orders;
        }
      )
      .addCase(getOrderByIDAsyncThunk.rejected, (state) => {
        state.isLoading = false;
      });
  }
});

export default feedSlice.reducer;
