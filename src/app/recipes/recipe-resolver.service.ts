import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import * as RecipesActions from '../recipes/store/recipe.actions';
import * as fromApp from '../store/app.reducer';
import { Recipe } from './recipe.model';

@Injectable({ providedIn: 'root' })
export class RecipeResolverService implements Resolve<Recipe[]> {
  constructor(
    // private dataStorageService: DataStorageService,
    // private recipeService: RecipeService,
    private store: Store<fromApp.AppState>,
    private actions$: Actions
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log(`🔎 | RecipeResolverService | resolve`);
    // const recipes = this.recipeService.getRecipes();

    // if (recipes.length === 0) {
    //   return this.dataStorageService.fetchRecipes();
    // }

    // return recipes;

    this.store.dispatch(new RecipesActions.FetchRecipes());
    return this.actions$.pipe(ofType(RecipesActions.SET_RECIPES), take(1));
  }
}
