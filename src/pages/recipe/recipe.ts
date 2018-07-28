import { RecipeService } from '../../services/recipe';
import { EditRecipePage } from '../edit-recipe/edit-recipe';
import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Recipe } from '../../models/recipe';
import { ShoppingListService } from '../../services/shopping-list';

@Component({
  selector: 'page-recipe',
  templateUrl: 'recipe.html',
})
export class RecipePage implements OnInit {
  recipe: Recipe;
  index: number;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private slService: ShoppingListService,
              private recipeService: RecipeService,
) { }

  ngOnInit() {
    this.recipe = this.navParams.get('recipe');
    this.index= this.navParams.get('index');
  }

  onEditRecipe() {
    this.navCtrl.push(EditRecipePage, {mode: 'Edit', recipe: this.recipe, index: this.index});
  }

  onAddIngredients() {
    this.slService.addIngredients(this.recipe.ingredients);
  }

  onDeleteRecipe() {
    this.recipeService.removeRecipe(this.index);
    this.navCtrl.popToRoot();
  }


}

