import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Ingredient } from '../../shared/ingredient.model';
import * as fromApp from '../../store/app.reducer';
import * as SLA from '../store/shopping-list.actions';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrl: './shopping-edit.component.css',
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('formEl', { static: false }) shoppingListForm: NgForm;

  subscription: Subscription;
  editMode = false;
  editedItem: Ingredient;

  constructor(private ngRxStore: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.subscription = this.ngRxStore
      .select('shoppingList')
      .subscribe((stateData) => {
        if (stateData.editedIngredientIndex > -1) {
          this.editMode = true;
          this.editedItem = stateData.editedIngredient;
          this.shoppingListForm.setValue({
            name: this.editedItem.name,
            amount: this.editedItem.amount,
          });
        } else {
          this.editMode = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.ngRxStore.dispatch(new SLA.StopEdit());
  }

  onSubmit(form: NgForm) {
    console.log(`🔎 | ShoppingEditComponent | onAddIngredient`);

    const newIngredient = new Ingredient(form.value.name, form.value.amount);
    if (this.editMode) {
      this.ngRxStore.dispatch(new SLA.UpdateIngredient(newIngredient));
    } else {
      this.ngRxStore.dispatch(new SLA.AddIngredient(newIngredient));
    }
    this.editMode = false;
    form.reset();
  }

  onClear() {
    this.shoppingListForm.reset();
    this.editMode = false;
    this.ngRxStore.dispatch(new SLA.StopEdit());
  }

  onDelete() {
    this.ngRxStore.dispatch(new SLA.DeleteIngredient());
    this.onClear();
  }
}
