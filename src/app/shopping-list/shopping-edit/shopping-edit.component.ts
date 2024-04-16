import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import * as SLA from '../store/shopping-list.actions';
import * as fromShoppingList from '../store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrl: './shopping-edit.component.css',
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('formEl', { static: false }) shoppingListForm: NgForm;

  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(
    private shoppinglistService: ShoppingListService,
    private ngRxStore: Store<fromShoppingList.AppState>
  ) {}

  ngOnInit(): void {
    // this.subscription = this.shoppinglistService.startingEditing.subscribe(
    //   (index: number) => {
    //     this.editedItemIndex = index;
    //     this.editMode = true;
    //     this.editedItem = this.shoppinglistService.getIngredient(index);
    //     this.shoppingListForm.setValue({
    //       name: this.editedItem.name,
    //       amount: this.editedItem.amount,
    //     });
    //   }
    // );

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
      // this.shoppinglistService.updateIngredient(
      //   this.editedItemIndex,
      //   newIngredient
      // );
      this.ngRxStore.dispatch(
        new SLA.UpdateIngredient({
          index: this.editedItemIndex,
          ingredient: newIngredient,
        })
      );
    } else {
      // this.shoppinglistService.addIngredient(newIngredient);
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
    // this.shoppinglistService.deleteIngredient(this.editedItemIndex);
    this.ngRxStore.dispatch(new SLA.DeleteIngredient(this.editedItemIndex));
    this.onClear();
  }
}
