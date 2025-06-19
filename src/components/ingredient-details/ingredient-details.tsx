import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useDispatch, useSelector } from '../../services/store/store';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getIngredientsAsyncThunk,
  selectIngredient
} from '../../services/store/features/ingredients/ingredientsSlice';

export const IngredientDetails: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const ingredientData = useSelector(
    (state) => state.ingredients.selectedIngredient
  );
  const isIngredientsLoading = useSelector(
    (state) => state.ingredients.isIngredientsLoading
  );
  const ingredients = useSelector((state) => state.ingredients.ingredients);

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }
    if (!ingredients.length) {
      dispatch(getIngredientsAsyncThunk()).then(() => {
        dispatch(selectIngredient(id));
      });
    } else {
      dispatch(selectIngredient(id));
    }
  }, [id, dispatch, ingredients.length, navigate]);

  if (isIngredientsLoading || !ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
