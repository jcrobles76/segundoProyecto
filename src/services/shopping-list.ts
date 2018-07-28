import { HttpClient } from '@angular/common/http';
import 'rxjs/Rx';
import { Ingredient } from './../models/ingredient';
import { Injectable } from '@angular/core';
import { AuthService } from './auth';

@Injectable()
export class ShoppingListService {
    public ingredients: Ingredient[] = [];

    constructor(private http: HttpClient, private authService: AuthService) {}

    addIngredient(name: string, amount: number) {
        this.ingredients.push(new Ingredient(name, amount));
        console.log(this.ingredients);
    }

    addIngredients(Ingredient: Ingredient[]) {
        this.ingredients.push(...Ingredient);
    }

    getIngredients() {
        return this.ingredients.slice();
    }

    removeIngredients(index: number) {
        return this.ingredients.splice(index, 1);
    }

    storeList(token: string) {
        const userId = this.authService.getActiveUSer().uid;
        return this.http
        .put('https://ionic2-recipesbook.firebaseio.com/'+ userId + '/shopping-list.json?auth='+ token, this.ingredients);
    }

    fetchList(token: string) {
        const userId = this.authService.getActiveUSer().uid;
        return this.http.get('https://ionic2-recipesbook.firebaseio.com/'+ userId + '/shopping-list.json?auth='+ token);

    }

}