import { ReactElement, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store/store';
import { Preloader } from '@ui';
import { checkAuthAsyncThunk } from '../../services/store/features/auth/authSlice';
import { getIngredientsAsyncThunk } from '../../services/store/features/ingredients/ingredientsSlice';

interface IProtectedRoute {
  onlyUnAuthed?: boolean;
  children: ReactElement;
}

export function ProtectedRoute({
  onlyUnAuthed = false,
  children
}: IProtectedRoute) {
  const location = useLocation();
  const dispatch = useDispatch();
  const isAuthChecked = useSelector((state) => state.auth.isAuthChecked);
  const isAuthorized = useSelector((state) => state.auth.isAuthorized);

  useEffect(() => {
    dispatch(getIngredientsAsyncThunk()).finally(() => {
      dispatch(checkAuthAsyncThunk());
    });
  }, []);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!isAuthorized && !onlyUnAuthed) {
    return <Navigate to={'/login'} state={{ pageToLoad: location.pathname }} />;
  }

  if (isAuthorized && location.pathname === '/login') {
    if (
      location.state &&
      Object.hasOwn(location.state, 'pageToLoad') &&
      location.state.pageToLoad
    ) {
      return <Navigate to={location.state.pageToLoad} replace />;
    }
  }

  if (isAuthorized && onlyUnAuthed) {
    return <Navigate to={'/'} replace />;
  }

  return <>{children}</>;
}
