import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';

import { MainPage } from '../';
import { SqlProvider } from '../../providers/sql/sql';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  account: { email: string, password: string } = {
    email: '',
    password: ''
  };

  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public sqlProvider: SqlProvider) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
  }

  ngOnInit() {
    this.sqlProvider.getAllUser().then((res: any) => {
      console.log(JSON.stringify(res));
      for (let i = 0; i < res.rows.length; i++) {
        console.log(JSON.stringify(res.rows))
        console.log(JSON.stringify(res.rows.item(i)))
      }
    }).catch((err) => {
      console.log(err);
    })

    this.sqlProvider.getAllUserFund().then((res: any) => {
      console.log(JSON.stringify(res));
      for (let i = 0; i < res.rows.length; i++) {
        console.log(JSON.stringify(res.rows))
        console.log(JSON.stringify(res.rows.item(i)))
      }
    }).catch((err) => {
      console.log(err);
    })

    this.sqlProvider.getAllTrxHistory().then((res: any) => {
      console.log(JSON.stringify(res));
      for (let i = 0; i < res.rows.length; i++) {
        console.log(JSON.stringify(res.rows))
        console.log(JSON.stringify(res.rows.item(i)))
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  // Attempt to login in through sql provider
  doLogin() {
    this.sqlProvider.getUser(this.account.email, this.account.password).then((res: any) => {
      console.log(JSON.stringify(res));
      for (let i = 0; i < res.rows.length; i++) {
        console.log(JSON.stringify(res.rows))
        console.log(JSON.stringify(res.rows.item(i)))
      }
      if (res.rows.length == 1) {
        this.sqlProvider.loggedIn(res.rows.item(0));
        this.navCtrl.push(MainPage);
      } else {
        alert("Invalid email or password");
      }
    }).catch((err) => {
      console.log(err);
    });
  }
}
