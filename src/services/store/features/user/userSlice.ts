import { getOrdersApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RequestState, TOrder } from '@utils-types';

interface IUserSliceState {
  orders: TOrder[];
  orderData: TOrder;
  isLoading: boolean;
}

const initialState: IUserSliceState = {
  isLoading: false,
  orders: [],
  orderData: {
    _id: '',
    status: '',
    name: '',
    createdAt: '',
    updatedAt: '',
    number: 0,
    ingredients: []
  }
};

export const getOrdersAsyncThunk = createAsyncThunk(
  'user/getOrdersAsyncThunk',
  async function (_, { dispatch }) {
    return getOrdersApi();
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getOrdersAsyncThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrdersAsyncThunk.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(
        getOrdersAsyncThunk.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.orders = action.payload ?? [];
          state.isLoading = false;
        }
      );
  },
  selectors: {}
});

export default userSlice.reducer;
