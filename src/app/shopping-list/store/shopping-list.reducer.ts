import { Ingredient } from '../../shared/ingredient.model';
import * as SLA from './shopping-list.actions';

const initialState = {
  ingredients: [new Ingredient('Apples', 5), new Ingredient('Tomatoes', 10)],
};

export function shoppingListReducer(
  state = initialState,
  action: SLA.ShoppingListActions
) {
  switch (action.type) {
    case SLA.ADD_INGREDIENT:
      return { ...state, ingredients: [...state.ingredients, action.payload] };

    case SLA.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload],
      };

    default:
      return state;
  }
}
