import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store/store';
import { getOrdersAsyncThunk } from '../../services/store/features/user/userSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.user.orders);
  const isLoading = useSelector((state) => state.user.isLoading);

  useEffect(() => {
    dispatch(getOrdersAsyncThunk());
  }, []);

  return isLoading ? <Preloader /> : <ProfileOrdersUI orders={orders} />;
};
