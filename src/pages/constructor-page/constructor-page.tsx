import styles from './constructor-page.module.css';

import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store/store';
import { getIngredientsAsyncThunk } from '../../services/store/features/ingredients/ingredientsSlice';

export const ConstructorPage: FC = () => {
  const dispatch = useDispatch();

  const isIngredientsLoading = useSelector(
    (state) => state.ingredients.isIngredientsLoading
  );

  useEffect(() => {
    dispatch(getIngredientsAsyncThunk());
  }, []);

  return (
    <>
      {isIngredientsLoading ? (
        <Preloader />
      ) : (
        <main className={styles.containerMain}>
          <h1
            className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
          >
            Соберите бургер
          </h1>
          <div className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients />
            <BurgerConstructor />
          </div>
        </main>
      )}
    </>
  );
};
