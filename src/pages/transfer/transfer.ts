import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { SqlProvider } from '../../providers/sql/sql';
import { Api } from '../../providers';
import { MainPage } from '../';

@IonicPage()
@Component({
  selector: 'page-transfer',
  templateUrl: 'transfer.html'
})
export class TransferPage {

  currentItems: any = [];
  fromCurrency: { currency: string, balance: number } = { currency: '', balance: 0.00 };
  fromCurrencyBalance: any;
  toCurrency: { currency: string } = { currency: '' };
  toCurrencyAmount: any;
  fromCurrencyList: any = [];
  toCurrencyList: any = [];
  rate: { currency: string, rate: number } = { currency: '', rate: 0.00 };
  rateList: any;
  payAmount: any;
  receiveAmount: any;
  isButtonDisable : boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public sqlProvider: SqlProvider, public api: Api) { }

  ionViewWillEnter() {
    console.log('Enter transferPage')
    let service = this.sqlProvider;
    this.fromCurrencyList = [];
    for (let s of service.ownCurrency) {
      this.fromCurrencyList.push({ 'currency': s.currency, 'balance': s.amount });
    }
    this.getSupportedCurrency();
  }

  onChangeFromCur() {
    console.log('onchange from cur')
    console.log('this.fromCurrency ' + JSON.stringify(this.fromCurrency));
    this.resetToCurrencyList();
    //remove selected fromCurrency from toCurrencylist
    this.toCurrencyList.forEach((item, index) => {
      console.log('item ' + item.currency);
      console.log('this.fromCurrency.currency ' + JSON.stringify(this.fromCurrency));
      if (item.currency === this.fromCurrency.currency) this.toCurrencyList.splice(index, 1);
    });

    this.fromCurrencyBalance = this.fromCurrency.balance;
  }

  onChangeToCur() {
    // this.resetToCurrencyList();
    // //remove selected fromCurrency from toCurrencylist
    // this.toCurrencyList.forEach( (item, index) => {
    //   if(item === fromCur) this.toCurrencyList.splice(index,1);
    // });
    this.calculateCurRate();
  }

  calculateCurRate() {
    console.log('toCur' + JSON.stringify(this.toCurrency));

    switch (this.toCurrency.currency) {
      case 'AUD':
        this.rate = { currency: 'AUD', rate: this.rateList.rates.AUD };
        break;
      case 'SGD':
        this.rate = { currency: 'SGD', rate: this.rateList.rates.SGD };
        break;
      case 'MYR':
        this.rate = { currency: 'MYR', rate: this.rateList.rates.MYR };
        break;
      case 'USD':
        this.rate = { currency: 'USD', rate: this.rateList.rates.USD };
        break;
      default:
        console.log("Invalid Currency !!");
        break;
    }
  }

  calculateReceiveAmount() {
    if(+this.payAmount > +this.fromCurrency.balance) {
      this.isButtonDisable = true;
    } else {
      this.isButtonDisable = false;
    }
    this.receiveAmount = (this.payAmount * this.rate.rate).toFixed(4);
  }

  resetToCurrencyList() {
    this.toCurrencyList = [
      { currency: 'SGD' },
      { currency: 'USD' },
      { currency: 'MYR' },
      { currency: 'AUD' }];
  }

  performTrans() {
    let isExistingCurrency = false;
    //deduct from balance
    this.fromCurrency.balance = this.fromCurrency.balance - this.payAmount;
    console.log('from balance ' + this.fromCurrency.balance);

    this.sqlProvider.updateUserFund(this.fromCurrency.currency, this.fromCurrency.balance ).then((resp) => {
      console.log(resp);
    }).catch((err) => {
      console.log(err);
    })

    //update to balance

    for (let a of this.fromCurrencyList) {
      if (this.toCurrency.currency == a.currency) {
        console.log('to balance ' + a.balance)
        console.log('receiveamount ' + this.receiveAmount)
        isExistingCurrency = true;
        a.balance = +a.balance + +this.receiveAmount;
        console.log('after to balance ' + a.balance)
        this.sqlProvider.updateUserFund(a.currency, a.balance).then((resp) => {
          console.log(resp);
        }).catch((err) => {
          console.log(err);
        })
      }
    }

    //create new tobalance if is new currency
    if (!isExistingCurrency) {
      this.sqlProvider.insertUserFund(this.sqlProvider.loggedInUser.USERID, this.toCurrency.currency, this.receiveAmount).then((resp) => {
        console.log(resp);
      }).catch((err) => {
        console.log(err);
      })
    }
    
    //create history records
    this.sqlProvider.insertTrxHistory(this.fromCurrency.currency, this.toCurrency.currency, this.payAmount,this.receiveAmount, this.rate.rate).then((resp)=> {
      console.log(resp);
    }).catch((err)=> {
      console.log(err);
    })

    this.navCtrl.setRoot(MainPage);

  }

  getSupportedCurrency() {
    this.api.getSupportedCurrencyRate().subscribe((resp) => {
      console.log(JSON.stringify(resp));
      this.rateList = resp;
    }), error => {
      console.log(error);
    }
  }
}
