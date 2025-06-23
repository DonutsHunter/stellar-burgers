import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useDispatch, useSelector } from '../../services/store/store';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { selectIngredient } from '../../services/store/features/ingredients/ingredientsSlice';

export const IngredientDetails: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
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
    if (ingredients.length) {
      dispatch(selectIngredient(id));
    }
  }, [id, dispatch, navigate, ingredients.length]);

  if (isIngredientsLoading || !ingredientData) {
    return <Preloader />;
  }

  // Центрируем только если это страница, а не модалка
  const isModal = !!location.state?.background;

  return isModal ? (
    <IngredientDetailsUI ingredientData={ingredientData} />
  ) : (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh'
      }}
    >
      <IngredientDetailsUI ingredientData={ingredientData} />
    </div>
  );
};
