import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store/store';

export const AppHeader: FC = () => {
  const userData = useSelector((state) => state.auth.user);

  return (
    <AppHeaderUI userName={userData && userData.name ? userData.name : ''} />
  );
};
