import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';

import { SqlProvider } from '../../providers/sql/sql';
import getSymbolFromCurrency from 'currency-symbol-map'

@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  currency: any[];

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public sqlProvider: SqlProvider) {
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewWillEnter() {
    let service = this.sqlProvider;
    this.currency = [];
    service.getUserFund(service.loggedInUser.USERID).then((resp:any) => {
      for (let i = 0; i < resp.rows.length; i++) {
        console.log(JSON.stringify(resp.rows))
        console.log(JSON.stringify(resp.rows.item(i)))
        this.currency.push({'symbol':getSymbolFromCurrency(resp.rows.item(i).CURRENCY),'currency': resp.rows.item(i).CURRENCY,'amount': parseFloat(resp.rows.item(i).AMOUNT).toFixed(4)});
      }
      service.setupOwnCurrency(this.currency);
    }).catch((err) => {
      console.log(err);
    })
  }
}
