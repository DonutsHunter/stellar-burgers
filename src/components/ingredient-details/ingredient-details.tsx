import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useDispatch, useSelector } from '../../services/store/store';
import { useNavigate, useParams } from 'react-router-dom';
import { getIngredientAsyncThunk } from '../../services/store/features/ingredients/ingredientsSlice';

export const IngredientDetails: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const ingredientData = useSelector(
    (state) => state.ingredients.selectedIngredient
  );

  useEffect(() => {
    if (id) {
      dispatch(getIngredientAsyncThunk({ id }));
    } else {
      navigate('/');
    }
  }, []);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
