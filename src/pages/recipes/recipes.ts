import { AuthService } from './../../services/auth';
import { RecipePage } from '../recipe/recipe';
import { Recipe } from '../../models/recipe';
import { RecipeService } from '../../services/recipe';
import { EditRecipePage } from '../edit-recipe/edit-recipe';
import { NavController, PopoverController, LoadingController, AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { DatabaseOptionsPage } from '../database-options/database-options';


@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html',
})
export class RecipesPage {
  recipes: Recipe[];

  constructor(private navCtrl: NavController,
    private recipesService: RecipeService,
    private popoverCtrl: PopoverController,
    private loaderCtrl: LoadingController,
    private alertCtrl: AlertController,
    private authService: AuthService) {}

  ionViewWillEnter(){
   this.recipes = this.recipesService.getRecipes();
  }

  onNewRecipe() {
    this.navCtrl.push(EditRecipePage, {mode: 'New'});
  }

  onLoadRecipe(recipe: Recipe, index: number) {
    this.navCtrl.push(RecipePage, {recipe: recipe, index: index});
  }

  onShowOptions(event: MouseEvent) {
    const loading = this.loaderCtrl.create({
      content: 'Please wait...'
    });
    const popover = this.popoverCtrl.create(DatabaseOptionsPage);
    popover.present({ev: event});
    popover.onDidDismiss(
      data => {
        if (!data) {
          return;
        }
        if(data.action == 'load') {
          loading.present();
          this.authService.getActiveUSer().getIdToken()
          .then(
            (token: string) => {
              this.recipesService.fetchList(token).subscribe(
                (list: Recipe[]) => {
                  loading.dismiss();
                  if(list) {
                    this.recipes = list;
                  }else {
                    this.recipes = [];
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
              this.recipesService.storeList(token).subscribe(
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


}
