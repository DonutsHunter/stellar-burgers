import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store/store';
import { useNavigate } from 'react-router-dom';
import {
  makeOrderAsyncThunk,
  resetOrderModalData
} from '../../services/store/features/burger-constructor/burgerConstructorSlice';
import { checkAuthAsyncThunk } from '../../services/store/features/auth/authSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigator = useNavigate();

  const isAuthorized = useSelector((state) => state.auth.isAuthorized);
  const constructorItems = useSelector(
    (state) => state.burgerConstructor.constructorItems
  );

  const orderRequest = useSelector(
    (state) => state.burgerConstructor.orderRequest
  );

  const orderModalData = useSelector(
    (state) => state.burgerConstructor.orderModalData
  );

  const onOrderClick = async () => {
    if (!constructorItems.bun || orderRequest) return;
    await dispatch(checkAuthAsyncThunk());

    if (!isAuthorized) return navigator('/login');

    dispatch(
      makeOrderAsyncThunk([
        String(constructorItems.bun?._id),
        ...constructorItems.ingredients.map((item) => String(item._id))
      ])
    );
  };
  const closeOrderModal = () => {
    dispatch(resetOrderModalData());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
