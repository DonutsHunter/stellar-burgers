import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import ingredientsSlice from './features/ingredients/ingredientsSlice';
import burgerConstructorSlice from './features/burger-constructor/burgerConstructorSlice';
import userSlice from './features/user/userSlice';
import feedSlice from './features/feed/feedSlice';
import authSlice from './features/auth/authSlice';
import appSlice from './features/app/appSlice';

const rootReducer = combineReducers({
  app: appSlice,
  auth: authSlice,
  ingredients: ingredientsSlice,
  burgerConstructor: burgerConstructorSlice,
  user: userSlice,
  feed: feedSlice
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
