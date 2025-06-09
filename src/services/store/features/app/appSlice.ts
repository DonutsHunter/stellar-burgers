import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AppPages = null | 'home' | 'feed';

interface IAppState {
  isLoading: boolean;
  currentPage: AppPages;
}

const initialState: IAppState = {
  isLoading: false,
  currentPage: null
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    finishLoading: (state) => {
      state.isLoading = false;
    },
    beginLoading: (state) => {
      state.isLoading = true;
    },
    selectPage: (state, action: PayloadAction<AppPages>) => {
      state.currentPage = action.payload;
    }
  }
});

export default appSlice.reducer;
export const { beginLoading, finishLoading, selectPage } = appSlice.actions;
