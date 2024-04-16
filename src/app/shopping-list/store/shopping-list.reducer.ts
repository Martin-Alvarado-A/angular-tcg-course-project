import { Ingredient } from '../../shared/ingredient.model';
import * as SLA from './shopping-list.actions';

const initialState = {
  ingredients: [new Ingredient('Apples', 5), new Ingredient('Tomatoes', 10)],
};

export function shoppingListReducer(
  state = initialState,
  action: SLA.AddIngredient
) {
  switch (action.type) {
    case SLA.ADD_INGREDIENT:
      return { ...state, ingredients: [...state.ingredients, action.payload] }; // complete this action
      break;

    default:
      return state;
      break;
  }
}
