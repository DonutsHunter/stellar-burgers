import { FC, memo, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';

import { useSelector } from '../../services/store/store';

const maxIngredients = 6;

export const OrderCard: FC<
  OrderCardProps & { listType: 'feed' | 'profile-orders' }
> = memo(({ order, listType }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const ingredients = useSelector((state) => state.ingredients.ingredients);

  const orderInfo = useMemo(() => {
    if (!ingredients.length) return null;

    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredient[], item: string) => {
        const ingredient = ingredients.find((ing) => ing._id === item);
        if (ingredient) return [...acc, ingredient];
        return acc;
      },
      []
    );

    const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);

    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);

    const remains =
      ingredientsInfo.length > maxIngredients
        ? ingredientsInfo.length - maxIngredients
        : 0;

    const date = new Date(order.createdAt);
    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date
    };
  }, [order, ingredients]);

  if (!orderInfo) return null;

  const handleClick = () => {
    const basePath = listType === 'feed' ? '/feed' : '/profile/orders';
    navigate(`${basePath}/${orderInfo.number}`, {
      state: { background: location }
    });
  };

  return (
    <div onClick={handleClick} style={{ cursor: 'pointer' }}>
      <OrderCardUI orderInfo={orderInfo} maxIngredients={maxIngredients} />
    </div>
  );
});
