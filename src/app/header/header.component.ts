import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription, map } from 'rxjs';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipeActions from '../recipes/store/recipe.actions';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSub: Subscription;
  collapsed = true;
  isAuthenticated = false;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    // this.userSub = this.authService.user.subscribe((user) => {
    this.userSub = this.store
      .select('auth')
      .pipe(map((authState) => authState.user))
      .subscribe((user) => {
        this.isAuthenticated = !!user;
      });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  onSaveData() {
    // this.dataStorageService.storeRecipes();
    this.store.dispatch(new RecipeActions.StoreRecipes());
  }

  onFetchData() {
    // this.dataStorageService.fetchRecipes().subscribe();
    this.store.dispatch(new RecipeActions.FetchRecipes());
  }

  onLogout() {
    // this.authService.logout();
    this.store.dispatch(new AuthActions.Logout());
  }
}
