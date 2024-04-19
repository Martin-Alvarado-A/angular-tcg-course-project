import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs';
import { Recipe } from '../recipe.model';
import * as RecipesActions from './recipe.actions';

@Injectable()
export class RecipeEffects {
  BASE_URL =
    'https://angular-tcg-course-project-default-rtdb.europe-west1.firebasedatabase.app';

  fetchRecipes = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RecipesActions.FETCH_RECIPES),
        switchMap(() => {
          return this.http.get<Recipe[]>(`${this.BASE_URL}/recipes.json`);
        }),
        map((recipes) => {
          return recipes.map((recipe) => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : [],
            };
          });
        }),
        map((recipes) => {
          return new RecipesActions.SetRecipes(recipes);
        })
      ),
    {
      dispatch: true,
    }
  );

  constructor(private actions$: Actions, private http: HttpClient) {}
}
