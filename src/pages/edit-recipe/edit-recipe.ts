import { Recipe } from '../../models/recipe';
import { RecipeService } from '../../services/recipe';
import { NavParams, ActionSheetController, AlertController, ToastController, NavController } from 'ionic-angular';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'page-edit-recipe',
  templateUrl: 'edit-recipe.html',
})
export class EditRecipePage implements OnInit {

  mode = 'New';
  options = ['Easy', 'Medium', 'Hard'];
  recipeForm: FormGroup;
  recipe: Recipe;
  index: number;

  constructor(
      private navParams: NavParams,
      private actionSheetControler: ActionSheetController,
      private alertCtrl: AlertController,
      private toastCtrl: ToastController,
      private recipeService: RecipeService,
      private navCtrl: NavController
  ) {

  }

  ngOnInit() {
    this.mode = this.navParams.get('mode');
    if(this.mode == 'Edit') {
      this.recipe = this.navParams.get('recipe');
      this.index = this.navParams.get('index');
    }
    this.initializeForm();
  }

  private initializeForm() {

    let title: string = null;
    let description: string = null;
    let difficulty: string = 'Medium';
    let ingredients = [];

    if(this.mode == 'Edit') {
      title = this.recipe.title;
      description = this.recipe.description;
      difficulty = this.recipe.difficulty;
      for(let ingredient of this.recipe.ingredients) {
        ingredients.push(new FormControl(ingredient.name, Validators.required));
      }

    }

    this.recipeForm = new FormGroup({
      'title': new FormControl(title, Validators.required),
      'description': new FormControl(description, Validators.required),
      'difficulty': new FormControl(difficulty, Validators.required),
      'ingredients': new FormArray([])
    });
  }

  onSubmit() {
    const value = this.recipeForm.value;
    let ingredients= [];
    if(value.ingredients.length > 0) {
      ingredients = value.ingredients.map(
        name => { return { name: name, amount: 1};
    });
    }
    if(this.mode == 'Edit') {
      this.recipeService.updateRecipe(this.index, value.title, value.description, value.difficulty, ingredients);
    }else {
      this.recipeService.addRecipe(value.title, value.description, value.difficulty, ingredients);
    }
    this.recipeForm.reset();
    this.navCtrl.popToRoot();

  }

  onManageIngredients() {
    const actionSheet = this.actionSheetControler.create({
      title: "What do you want to do?",
      buttons: [
        {
          text: 'Add Ingredient', handler: () => {
            this.createNewIngredientAlert().present();
          }
        },
        {
          text: "Remove all ingredients", role: "destructive", handler: () => {
            this.recipeForm.setControl('ingredients', new FormArray([]));
            const toast = this.toastCtrl.create({
              message: 'All ingredients were deleted !',
              duration: 2000,
              position: 'bottom'
            });
            toast.present();
          }
        },
        {
          text: "Cancel",
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  private createNewIngredientAlert() {
    return this.alertCtrl.create({
      title: 'Add Ingredient',
      inputs: [
        {
          name: 'name',
          placeholder: 'Name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Add',
          handler: data => {
            if(data.name.trim() == '' || data.name == null ) {
              const toast = this.toastCtrl.create({
                message: "Please, insert a valid value!",
                duration: 2000,
                position: 'bottom'
              });
              toast.present();
              return;
            }
            (<FormArray>this.recipeForm.get('ingredients')).push(new FormControl(data.name, Validators.required));
            const toast= this.toastCtrl.create({
              message: 'New item added!',
              duration: 2000,
              position: 'bottom'
            });
            toast.present();
          }
        }
      ]
    });
  }

}
