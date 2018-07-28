import { LoadingController, AlertController } from 'ionic-angular';
import { AuthService } from '../../services/auth';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {

  constructor(private authService: AuthService, private loadingCtrl: LoadingController, private alertCtrl: AlertController) {}

  onSignin(form: NgForm) {
    // console.log(form.value);
    const loading = this.loadingCtrl.create({
      content: 'singing you in...',
    });
    loading.present();
    this.authService.signin(form.value.email, form.value.password)
    .then(
      data => {
        loading.dismiss();
      })
    .catch(
      error => {
        loading.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Siging failed',
          message: error.message,
          buttons: ['Ok']
        });
        alert.present();
      }
    )
   }

}
