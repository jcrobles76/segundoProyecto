import { Recipe } from './../models/recipe';
import { AuthService } from './auth';
import { HttpClient } from '@angular/common/http';
import 'rxjs';
import { Ingredient } from '../models/ingredient';
import { Injectable } from '@angular/core';

@Injectable()
export class RecipeService {
    private recipes: Recipe[] = [];

    constructor(private Http: HttpClient, private authService: AuthService) {

    }

    addRecipe(title: string, description: string, difficulty: string, ingredients: Ingredient[]) {
        this.recipes.push(new Recipe(title, description, difficulty, ingredients));
        console.log(this.recipes);
    }

    getRecipes() {
        return this.recipes.slice();
    }

    updateRecipe(index: number, title: string, description: string, difficulty: string, ingredients: Ingredient[]) {
        this.recipes[index] = new Recipe(title, description, difficulty, ingredients);
    }

    removeRecipe(index: number) {
        this.recipes.splice(index, 1);
    }

    storeList(token: string) {
        const userId = this.authService.getActiveUSer().uid;
        return this.Http.put('https://ionic2-recipesbook.firebaseio.com/'+ userId + '/recipes.json?auth='+ token, this.recipes);
    }

    fetchList(token: string) {
        const userId = this.authService.getActiveUSer().uid;
        return this.Http.get('https://ionic2-recipesbook.firebaseio.com/'+ userId + '/recipes.json?auth='+ token)
        .do((recipes: Recipe[]) => {
            if(recipes) {
                for(let recipe of recipes) {
                    if( !recipe.hasOwnProperty('ingredients') ) {
                        recipe.ingredients = [];
                    }
                }
                    this.recipes = recipes;
            } else {
                this.recipes = [];
            }
        });

    }

}