import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { LoggingService } from '../logging.service';
import { Ingredient } from '../shared/ingredient.model';
import * as SLA from '../shopping-list/store/shopping-list.actions';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.css',
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ ingredients: Ingredient[] }>;

  constructor(
    private logService: LoggingService,
    private ngRxStore: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.ingredients = this.ngRxStore.select('shoppingList');

    this.logService.printLog('Hello from ShoppingListComponent ngOnInit');
  }

  ngOnDestroy(): void {
    // this.ingAddedSub.unsubscribe();
  }

  onEditItem(index: number) {
    this.ngRxStore.dispatch(new SLA.StartEdit(index));
  }
}
