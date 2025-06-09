import { orderBurgerApi, TNewOrderResponse } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { RootState } from '../../store';

interface IConstructorItems {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
}

interface IBurgerConstructorState {
  constructorItems: IConstructorItems;
  orderRequest: boolean;
  orderModalData: TOrder | null;
}

const initialState: IBurgerConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null
};

export const makeOrderAsyncThunk = createAsyncThunk<
  TNewOrderResponse,
  string[],
  { state: RootState }
>('burgerConstructor/makeOrderAsyncThunk', async function (data: string[]) {
  return orderBurgerApi(data);
});

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredientIntoConstructor: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      if (action.payload) {
        if (action.payload.type === 'bun') {
          state.constructorItems.bun = action.payload;
        } else {
          state.constructorItems.ingredients.push(action.payload);
        }
      }
    },
    removeIngredient: (
      state,
      action: PayloadAction<{ item: TConstructorIngredient }>
    ) => {
      const selectedItem = action.payload.item || null;

      if (selectedItem) {
        state.constructorItems.ingredients =
          state.constructorItems.ingredients.filter(
            (item) => item.id !== selectedItem.id
          );
      }
    },
    resetOrderModalData: (state) => {
      state.orderModalData = null;
      state.orderRequest = false;
    },
    moveIngredient: (
      state,
      action: PayloadAction<{
        ingredient: TConstructorIngredient;
        place: 'up' | 'down';
      }>
    ) => {
      if (action.payload.ingredient) {
        const currentItem = action.payload.ingredient;
        let currentItemIndex: number = -1;
        let replaceItemIndex: number = -1;
        let replaceItem: TConstructorIngredient | null = null;

        switch (action.payload.place) {
          case 'up':
            state.constructorItems.ingredients.forEach((item, index) => {
              if (item.id !== currentItem.id) {
                replaceItem = item;
                replaceItemIndex = index;
              } else {
                currentItemIndex = index;

                if (replaceItem) {
                  state.constructorItems.ingredients[replaceItemIndex] =
                    currentItem;
                  state.constructorItems.ingredients[currentItemIndex] =
                    replaceItem;
                }
                return;
              }
            });
            break;
          case 'down':
            state.constructorItems.ingredients.forEach((item, index) => {
              if (item.id === currentItem.id) {
                currentItemIndex = index;
              } else if (currentItemIndex !== -1 && !replaceItem) {
                replaceItem = item;
                replaceItemIndex = index;

                state.constructorItems.ingredients[currentItemIndex] =
                  replaceItem;
                state.constructorItems.ingredients[replaceItemIndex] =
                  currentItem;
                return;
              }
            });
            break;
        }
      }
    }
  },
  extraReducers(builder) {
    builder
      .addCase(
        makeOrderAsyncThunk.fulfilled,
        (state, action: PayloadAction<TNewOrderResponse>) => {
          if (action.payload.success) {
            state.constructorItems = {
              bun: null,
              ingredients: []
            };
            state.orderRequest = false;
            state.orderModalData = action.payload.order;
          }
        }
      )
      .addCase(makeOrderAsyncThunk.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(makeOrderAsyncThunk.rejected, (state, action) => {
        state.orderRequest = false;
      });
  }
});

export const {
  addIngredientIntoConstructor,
  removeIngredient,
  resetOrderModalData,
  moveIngredient
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;
