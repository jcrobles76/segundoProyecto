import { DatabaseOptionsPage } from './../database-options/database-options';
import { ShoppingListService } from '../../services/shopping-list';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Ingredient } from '../../models/ingredient';
import { PopoverController, LoadingController, AlertController } from 'ionic-angular';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})
export class ShoppingListPage {
  ingredients: Ingredient[];

  constructor(private slService: ShoppingListService,
              private popoverCtrl: PopoverController,
              private authService: AuthService,
              private loaderCtrl: LoadingController,
              private alertCtrl: AlertController) {}

  onAddItem(form: NgForm) {
    console.log(form);
    this.slService.addIngredient(form.value.ingredientName, form.value.amount);
    form.reset();
    this.loadItems();
  }

  onCheckItem(index: number) {
    this.slService.removeIngredients(index);
    this.loadItems();
  }

  onShowOptions(event: MouseEvent) {
    const loading = this.loaderCtrl.create({
      content: 'Please wait...'
    });
    const popover = this.popoverCtrl.create(DatabaseOptionsPage);
    popover.present({ev: event});
    popover.onDidDismiss(
      data => {
        if(!data) {
          return;
        }
        if(data.action == 'load') {
          loading.present();
          this.authService.getActiveUSer().getIdToken()
          .then(
            (token: string) => {
              this.slService.fetchList(token).subscribe(
                (list: Ingredient[]) => {
                  loading.dismiss();
                  if(list) {
                    this.ingredients = list;
                  }else {
                    this.ingredients = [];
                  }
                },
                error => {
                  loading.dismiss();
                  this.handleError(error.message);
                }
              );
            }
          )
        }else if (data.action == 'store') {
          loading.present();
          this.authService.getActiveUSer().getIdToken()
          .then(
            (token: string) => {
              this.slService.storeList(token).subscribe(
                () => loading.dismiss(),
                error => {
                  loading.dismiss();
                  this.handleError(error.message);
                }
              );
            }
          )
          .catch();
        }
      }
    );
  }

  private handleError(errorMessage: string) {
    const alert = this.alertCtrl.create({
      title: 'An error occurred',
      message: errorMessage,
      buttons: ['Ok']
    });
    alert.present();
  }

  ionViewWillEnter() {
    this.loadItems();
  }

  private loadItems() {
    this.ingredients = this.slService.getIngredients();
  }

}
