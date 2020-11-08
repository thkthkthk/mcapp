import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';

import { SqlProvider } from '../../providers/sql/sql';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { userid: string, email: string, password: string } = {
    userid: '',
    email: '',
    password: ''
  };

  // Our translated text strings
  private signupErrorString: string;

  constructor(public navCtrl: NavController,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public sqlProvider: SqlProvider) {

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })
  }

  doSignup() {
    this.sqlProvider.insertUser(this.account.userid, this.account.email, this.account.userid).then((resp) => {
      this.sqlProvider.insertUserFund(this.account.userid,'USD',100).then((resp) => {
        console.log(resp);
        this.navCtrl.push('LoginPage');
      }).catch((err) => {
        console.log(err);
      });
    }).catch((err) => {
      console.log(err);
    });
  }
}
