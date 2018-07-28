import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { LoadingController, AlertController } from 'ionic-angular';


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  constructor(private authService: AuthService, private loadingCtrl: LoadingController, private alertCtrl: AlertController) {}

  onSignup(form: NgForm) {
    // console.log(form.value);
    const loading = this.loadingCtrl.create({
      content: 'Singing you app...'
    });
    loading.present();
    this.authService.signup(form.value.email, form.value.password)
    .then(data => {
      loading.dismiss();
    })
    .catch(error => {
      loading.dismiss();
      const alert = this.alertCtrl.create({
        title: 'Singup failed',
        message: error.message,
        buttons: ['Ok']
      });
      alert.present();
    });
  }

}
