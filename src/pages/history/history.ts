import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { SqlProvider } from '../../providers/sql/sql';



@IonicPage()
@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {

  historyList:any = [];
  constructor(public sqlProvider: SqlProvider) {
  }


  ionViewWillEnter() {
   this.historyList = [];
   this.sqlProvider.getUserHistory().then((res:any) => {
    console.log(res);
    for (let i = 0; i < res.rows.length; i++) {
      console.log(JSON.stringify(res.rows))
      console.log(JSON.stringify(res.rows.item(i)))
      let item = res.rows.item(i);
      console.log(JSON.stringify(item))
      this.historyList.push({'refNo' : item.ID.substring(0,8),'rate' : item.RATE,'fromCur' : item.FROMCUR,'toCur': item.TOCUR,'payAmount': item.PAYAMOUNT,'receiveAmount': item.RECEIVEAMOUNT, 'createdOn' : new Date(+item.CREATEDON).toLocaleString()});
    }
   }).catch((err) => {
     console.log(err);
   })
  }

}
