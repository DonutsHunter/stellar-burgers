import { AppHeader } from '@components';
import styles from './PageLayout.module.css';
import { Outlet } from 'react-router-dom';

export default function PageLayout() {
  return (
    <div className={styles.app}>
      <AppHeader />
      <Outlet />
    </div>
  );
}
