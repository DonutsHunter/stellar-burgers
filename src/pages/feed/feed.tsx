import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
// import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store/store';

import { getFeedsAsyncThunk } from '../../services/store/features/feed/feedSlice';
import { getIngredientsAsyncThunk } from '../../services/store/features/ingredients/ingredientsSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.feed.feeds);
  const ingredients = useSelector(
    (state) => state.burgerConstructor.constructorItems.ingredients
  );

  useEffect(() => {
    dispatch(getFeedsAsyncThunk());
  }, [ingredients]);

  useEffect(() => {
    dispatch(getIngredientsAsyncThunk());
  }, []);

  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(getFeedsAsyncThunk());
      }}
    />
  );
};
