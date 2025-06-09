import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../../../../utils/cookie';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  refreshToken,
  registerUserApi,
  TAuthResponse,
  TLoginData,
  TRefreshResponse,
  TRegisterData,
  TServerResponse,
  TUserResponse,
  updateUserApi
} from '@api';

interface IAuthState {
  user: TUser | null;
  isAuthorized: boolean;
  isAuthChecked: boolean;
  isAuthChecking: boolean;
  requestState: 'success' | 'failed' | null;
}

const initialState: IAuthState = {
  user: null,
  isAuthChecked: false,
  isAuthorized: false,
  isAuthChecking: false,
  requestState: null
};

export const registerAsyncThunk = createAsyncThunk(
  'auth/registerAsyncThunk',
  async function (data: TRegisterData): Promise<TAuthResponse> {
    return registerUserApi(data);
  }
);

export const logoutAsyncThunk = createAsyncThunk(
  'auth/logoutAsyncThunk',
  async function (): Promise<TServerResponse<{}>> {
    if (localStorage.getItem('refreshToken')) {
      return logoutApi();
    } else {
      return { success: false };
    }
  }
);

export const updateUserDataAsyncThunk = createAsyncThunk<
  TUserResponse,
  Partial<TUser>
>('auth/updateUserDataAsyncThunk', async function (data, { dispatch }) {
  dispatch(resetRequestState());
  return updateUserApi(data);
});

const getUserAsyncThunk = createAsyncThunk<TUserResponse>(
  'auth/getUserAsyncThunk',
  async function () {
    return getUserApi();
  }
);

export const loginAsyncThunk = createAsyncThunk(
  'auth/loginAsyncThunk',
  async function (data: TLoginData, { dispatch }) {
    dispatch(resetAuth());
    dispatch(resetRequestState());
    return loginUserApi(data);
  }
);

export const refreshTokenAsyncThunk = createAsyncThunk(
  'auth/refreshTokenAsyncThunk',
  async function (): Promise<TRefreshResponse> {
    return refreshToken();
  }
);

export const checkAuthAsyncThunk = createAsyncThunk(
  'auth/checkAuthAsyncThunk',
  async function (_, { dispatch, getState }) {
    dispatch(resetAuth());
    dispatch(resetRequestState());

    const accessToken = getCookie('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (accessToken) {
      try {
        await dispatch(getUserAsyncThunk());
      } catch (error) {
        if (refreshToken) {
          await dispatch(refreshTokenAsyncThunk());
        }
      }
      dispatch(setAuthChecked());
    } else if (refreshToken) {
      try {
        await dispatch(refreshTokenAsyncThunk());
        await dispatch(getUserAsyncThunk());
      } catch (error) {}
      dispatch(setAuthChecked());
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuth: (state) => {
      state.user = null;
      state.isAuthChecked = false;
      state.isAuthorized = false;
    },
    resetRequestState: (state) => {
      state.requestState = null;
    },
    setAuthChecked: (state) => {
      state.isAuthChecked = true;
    },
    setAuthorized: (state, action: PayloadAction<boolean>) => {
      state.isAuthorized = action.payload;
    }
  },

  extraReducers(builder) {
    builder
      .addCase(
        registerAsyncThunk.fulfilled,
        (state, action: PayloadAction<TAuthResponse>) => {
          if (action.payload.success) {
            state.requestState = 'success';
          } else {
            state.requestState = 'failed';
          }
        }
      )
      .addCase(
        logoutAsyncThunk.fulfilled,
        (state, action: PayloadAction<TServerResponse<{}>>) => {
          if (action.payload.success) {
            state.isAuthorized = false;
            state.user = null;
            deleteCookie('accessToken');
            localStorage.removeItem('refreshToken');
          }
        }
      )

      .addCase(
        updateUserDataAsyncThunk.fulfilled,
        (state, action: PayloadAction<TUserResponse>) => {
          if (action.payload.success) {
            state.requestState = 'success';
            state.user = action.payload.user;
          } else {
            state.requestState = 'failed';
          }
        }
      )
      .addCase(updateUserDataAsyncThunk.rejected, (state) => {
        state.requestState = 'failed';
      })

      .addCase(
        loginAsyncThunk.fulfilled,
        (state, action: PayloadAction<TAuthResponse>) => {
          if (action.payload.success) {
            localStorage.setItem('refreshToken', action.payload.refreshToken);
            setCookie('accessToken', action.payload.accessToken);
            state.user = action.payload.user;
            state.isAuthChecked = true;
            state.isAuthorized = true;
            state.requestState = 'success';
          } else {
            state.requestState = 'failed';
          }
        }
      )
      .addCase(loginAsyncThunk.rejected, (state, action) => {
        state.isAuthorized = false;
        state.requestState = 'failed';
        state.isAuthChecked = true;
      })

      .addCase(
        getUserAsyncThunk.fulfilled,
        (state, action: PayloadAction<TUserResponse>) => {
          if (action.payload.success) {
            state.isAuthorized = true;
            state.user = {
              email: action.payload.user.email,
              name: action.payload.user.name
            };
          } else {
            state.isAuthorized = false;
            state.user = null;
          }
        }
      )
      .addCase(getUserAsyncThunk.rejected, (state, action) => {
        state.isAuthorized = false;
        state.user = null;
      });
  }
});

export default authSlice.reducer;
export const { setAuthChecked, setAuthorized, resetAuth, resetRequestState } =
  authSlice.actions;
