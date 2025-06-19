import { setCookie, getCookie } from './cookie';
import { TIngredient, TOrder, TOrdersData, TUser } from './types';

export const BASE_URL = (process.env.BURGER_API_URL || '')
  .replace(/[%]+$/, '')
  .replace(/\/?$/, '/');

const checkResponse = (res: Response) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка ${res.status}`);
};

const checkSuccess = (res: any) => {
  if (res && res.success) {
    return res;
  }
  return Promise.reject(`Ответ не success: ${JSON.stringify(res)}`);
};

const request = async (endpoint: string, options?: RequestInit) => {
  if (!BASE_URL) {
    throw new Error('BASE_URL is not defined. Проверьте переменные окружения!');
  }
  const url = `${BASE_URL.replace(/\/?$/, '/')}${endpoint.replace(/^\//, '')}`;
  const res = await fetch(url, options);
  const res_1 = await checkResponse(res);
  return checkSuccess(res_1);
};

export type TServerResponse<T> = {
  success: boolean;
} & T;

export type TRefreshResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
}>;

export const refreshToken = (): Promise<TRefreshResponse> =>
  request('auth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  }).then((refreshData) => {
    localStorage.setItem('refreshToken', refreshData.refreshToken);
    setCookie('accessToken', refreshData.accessToken);
    return refreshData;
  });

export const fetchWithRefresh = async <T>(
  endpoint: string,
  options: RequestInit
) => {
  try {
    return await request(endpoint, options);
  } catch (err: any) {
    if (err.message === 'jwt expired') {
      const refreshData = await refreshToken();
      if (options.headers) {
        (options.headers as { [key: string]: string }).authorization =
          refreshData.accessToken;
      }
      return await request(endpoint, options);
    } else {
      return Promise.reject(err);
    }
  }
};

type TIngredientsResponse = TServerResponse<{
  data: TIngredient[];
}>;

export type TFeedsResponse = TServerResponse<{
  orders: TOrder[];
  total: number;
  totalToday: number;
}>;

type TOrdersResponse = TServerResponse<{
  data: TOrder[];
}>;

export const getIngredientsApi = () =>
  request('ingredients').then((data) => data.data);

export const getFeedsApi = () => request('orders/all');

export const getOrdersApi = () =>
  fetchWithRefresh('orders', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit
  }).then((data) => data.orders);

export type TNewOrderResponse = TServerResponse<{
  order: TOrder;
  name: string;
}>;

export const orderBurgerApi = (data: string[]) =>
  fetchWithRefresh('orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit,
    body: JSON.stringify({
      ingredients: data
    })
  });

export type TOrderResponse = TServerResponse<{
  orders: TOrder[];
}>;

export const getOrderByNumberApi = (number: number) =>
  request(`orders/${number}`);

export type TRegisterData = {
  email: string;
  name: string;
  password: string;
};

export type TAuthResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
  user: TUser;
}>;

export const registerUserApi = (data: TRegisterData) =>
  request('auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  });

export type TLoginData = {
  email: string;
  password: string;
};

export const loginUserApi = (data: TLoginData) =>
  request('auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  });

export const forgotPasswordApi = (data: { email: string }) =>
  request('password-reset', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  });

export const resetPasswordApi = (data: { password: string; token: string }) =>
  request('password-reset/reset', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  });

export type TUserResponse = TServerResponse<{ user: TUser }>;

export const getUserApi = () =>
  fetchWithRefresh('auth/user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit
  });

export const updateUserApi = (user: Partial<TRegisterData>) =>
  fetchWithRefresh('auth/user', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit,
    body: JSON.stringify(user)
  });

export const logoutApi = () =>
  request('auth/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({ token: localStorage.getItem('refreshToken') })
  });
