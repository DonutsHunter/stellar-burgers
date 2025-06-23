import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store/store';
import { useParams, useLocation } from 'react-router-dom';
import { getOrderByIDAsyncThunk } from '../../services/store/features/feed/feedSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const orderData = useSelector(
    (state) => state.feed.selectedOrders[0] ?? null
  );
  const ingredients = useSelector((state) => state.ingredients.ingredients);

  useEffect(() => {
    if (!Number(number)) return;
    dispatch(getOrderByIDAsyncThunk(Number(number)));
  }, [number]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;
    const date = new Date(orderData.createdAt);
    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };
    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );
    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );
    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  // Центрируем только если это страница, а не модалка
  const isModal = !!location.state?.background;

  return isModal ? (
    <OrderInfoUI orderInfo={orderInfo} />
  ) : (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh'
      }}
    >
      <OrderInfoUI orderInfo={orderInfo} />
    </div>
  );
};
