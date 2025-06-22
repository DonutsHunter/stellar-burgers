import { FC } from 'react';

import styles from './orders-list.module.css';

import { OrdersListUIProps } from './type';
import { OrderCard } from '@components';

export const OrdersListUI: FC<
  OrdersListUIProps & { listType: 'feed' | 'profile-orders' }
> = ({ orderByDate, listType }) => (
  <div className={`${styles.content}`}>
    {orderByDate.map((order) => (
      <OrderCard order={order} key={order._id} listType={listType} />
    ))}
  </div>
);
