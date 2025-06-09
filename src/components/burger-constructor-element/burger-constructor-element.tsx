import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store/store';
import {
  moveIngredient,
  removeIngredient
} from '../../services/store/features/burger-constructor/burgerConstructorSlice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMoveDown = () => {
      dispatch(moveIngredient({ ingredient, place: 'down' }));
    };

    const handleMoveUp = () => {
      dispatch(moveIngredient({ ingredient, place: 'up' }));
    };

    const handleClose = () => {
      dispatch(removeIngredient({ item: ingredient }));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
