import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TTabMode } from '@utils-types';
import { RootState } from 'src/services/store/store';

interface IRootReducerTypesState extends Record<TTabMode, TIngredient[]> {
  main: TIngredient[];
  bun: TIngredient[];
  sauce: TIngredient[];
}

type TRootReducerState = {
  ingredients: TIngredient[];
  isIngredientsLoading: boolean;
  selectedIngredient: TIngredient | null;
} & IRootReducerTypesState;

const initialState: TRootReducerState = {
  ingredients: [],
  bun: [],
  sauce: [],
  main: [],
  isIngredientsLoading: false,
  selectedIngredient: null
};

export const getIngredientAsyncThunk = createAsyncThunk<
  void,
  { id: string },
  { state: RootState }
>(
  'ingredients/getIngredientAsyncThunk',
  async function ({ id }, { dispatch, getState }) {
    const { ingredients } = getState();
    if (!ingredients.ingredients || ingredients.ingredients.length === 0) {
      await dispatch(getIngredientsAsyncThunk());
    }

    dispatch(selectIngredient(id));
  }
);

export const getIngredientsAsyncThunk = createAsyncThunk(
  'ingredients/getIngredientsAsyncThunk',
  async function (): Promise<TIngredient[]> {
    return getIngredientsApi();
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    selectIngredient: (state, action: PayloadAction<string>) => {
      if (action.payload) {
        state.selectedIngredient =
          state.ingredients.filter((item) => item._id === action.payload)[0] ??
          [];
      }
    }
  },
  selectors: {},
  extraReducers(builder) {
    builder
      .addCase(getIngredientsAsyncThunk.pending, (state) => {
        state.isIngredientsLoading = true;
      })
      .addCase(
        getIngredientsAsyncThunk.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          const data: Record<TTabMode, TIngredient[]> = {
            bun: [],
            sauce: [],
            main: []
          };

          action.payload.forEach((item) => {
            if (item?.type && item.type in data) {
              const itemType = item.type as TTabMode;
              data[itemType].push(item);
            }
          });

          return {
            ...state,
            ingredients: action.payload,
            isIngredientsLoading: false,
            ...data
          };
        }
      )
      .addCase(getIngredientsAsyncThunk.rejected, (state) => {
        state.isIngredientsLoading = false;
      });
  }
});

export const { selectIngredient } = ingredientsSlice.actions;

export default ingredientsSlice.reducer;
