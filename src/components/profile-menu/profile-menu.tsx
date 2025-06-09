import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store/store';
import { logoutAsyncThunk } from '../../services/store/features/auth/authSlice';

export const ProfileMenu: FC = () => {
  const navigator = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const isAuthorized = useSelector((state) => state.auth.isAuthorized);

  const handleLogout = async () => {
    await dispatch(logoutAsyncThunk());

    if (!isAuthorized) return navigator('/login');
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
