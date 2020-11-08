import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment';

/*
  Generated class for the SqlProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SqlProvider {
  dbName: SQLiteObject;
  loggedInUser:any;
  ownCurrency:any;
  DATE_TIME_FORMAT: string = 'YYYY-MM-DDTHH:mm'

  constructor(private sqlite: SQLite) {
    console.log('Hello SqlProvider Provider');
  }

  createDatabase() {
    this.sqlite.create({
      name: 'mcapp.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      this.dbName = db;
      this.createUserTable();
      this.createUserFundTable();
      this.createTrxHistoryTable();
    })
  }

  createUserTable() {
    return new Promise((resolve, reject) => {
      this.dbName.open().then((res) => {
        let query = "CREATE TABLE IF NOT EXISTS 'USER' (USERID text, EMAIL text, PASSWORD text)";;
        this.dbName.executeSql(query, []).then((res) => {
          resolve(res);
        }).catch((err) => {
          console.log(err);
          reject(err);
        })
      });
    })    
  }

  createUserFundTable() {
    return new Promise((resolve, reject) => {
      this.dbName.open().then((res) => {
        let query = "CREATE TABLE IF NOT EXISTS 'USERFUND' (ID text, USERID text, CURRENCY text, AMOUNT integer)";;
        this.dbName.executeSql(query, []).then((res) => {
          resolve(res);
        }).catch((err) => {
          console.log(err);
          reject(err);
        })
      });
    })    
  }

  createTrxHistoryTable() {
    return new Promise((resolve, reject) => {
      this.dbName.open().then((res) => {
        let query = "CREATE TABLE IF NOT EXISTS 'TRXHISTORY' (ID text, USERID text, FROMCUR text, TOCUR text, PAYAMOUNT integer, RECEIVEAMOUNT integer, RATE integer, CREATEDON text)";
        this.dbName.executeSql(query, []).then((res) => {
          resolve(res);
        }).catch((err) => {
          console.log(err);
          reject(err);
        })
      });
    })    
  }

  insertUser(userid, email, password){
    return new Promise((resolve, reject) => {
      this.dbName.open().then(() => {
        let query = "INSERT INTO 'USER' (userid, email, password) VALUES ('" + userid + "','" + email + "', '" + password +"')";
        this.dbName.executeSql(query, []).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        })
      });
    })   
  }

  getUser(email,password){
    return new Promise((resolve, reject) => {
      this.dbName.open().then(() => {
        let query = "SELECT * FROM 'USER' WHERE EMAIL='" + email + "' AND PASSWORD='" + password + "'";
        console.log('query :' + query);
        this.dbName.executeSql(query, []).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        })
      });
    })
  }

  getAllUser(){
    return new Promise((resolve, reject) => {
      this.dbName.open().then(() => {
        let query = "SELECT * FROM 'USER'";
        this.dbName.executeSql(query, []).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        })
      });
    })
  }

  getAllUserFund(){
    return new Promise((resolve, reject) => {
      this.dbName.open().then(() => {
        let query = "SELECT * FROM 'USERFUND'";
        this.dbName.executeSql(query, []).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        })
      });
    })
  }

  getAllTrxHistory(){
    return new Promise((resolve, reject) => {
      this.dbName.open().then(() => {
        let query = "SELECT * FROM 'TRXHISTORY'";
        this.dbName.executeSql(query, []).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        })
      });
    })
  }

  insertUserFund(userid, currency, amount){
    return new Promise((resolve, reject) => {
      this.dbName.open().then(() => {
        let query = "INSERT INTO 'USERFUND' (id, userid, currency, amount) VALUES ('" + uuid() + "','" + userid + "','" + currency + "'," + amount +")";
        console.log('fund sql ' + query);
        this.dbName.executeSql(query, []).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        })
      });
    })   
  }

  getUserFund(userid){
    return new Promise((resolve, reject) => {
      this.dbName.open().then(() => {
        let query = "SELECT * FROM 'USERFUND' where userid='" + userid + "'";
        this.dbName.executeSql(query, []).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        })
      });
    })
  }

  updateUserFund(currency,amount){
    return new Promise((resolve, reject) => {
      this.dbName.open().then(() => {
        let query = "UPDATE 'USERFUND' SET amount='" + parseFloat(amount).toFixed(4) +"' WHERE userid='" + this.loggedInUser.USERID + "' and currency ='" + currency +"'";
        console.log('fund sql ' + query);
        this.dbName.executeSql(query, []).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        })
      });
    })
  }

  insertTrxHistory(fromcur,tocur,payamount,receiveamount,rate){
    let _now = moment(new Date(), this.DATE_TIME_FORMAT);
    return new Promise((resolve, reject) => {
      this.dbName.open().then(() => {
        let query = "INSERT INTO 'TRXHISTORY' (id, userid, fromcur, tocur, payamount,receiveamount, rate, createdon) VALUES ('" + uuid() + "','" + this.loggedInUser.USERID + "','" + fromcur + "','" + tocur + "','" + payamount + "','" + receiveamount + "','" + rate +"','" + _now +"')";
        console.log('history sql ' + query);
        this.dbName.executeSql(query, []).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        })
      });
    })   
  }

  getUserHistory(){
    return new Promise((resolve, reject) => {
      this.dbName.open().then(() => {
        let query = "SELECT * FROM 'TRXHISTORY' where userid='" + this.loggedInUser.USERID + "'";
        console.log('user history sql ' + query);
        this.dbName.executeSql(query, []).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        })
      });
    })
  }

  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this.loggedInUser = null;
    this.ownCurrency = null;
  }

  /**
   * Process a login/signup response to store user data
   */
  loggedIn(resp) {
    this.loggedInUser = resp;
  }

  setupOwnCurrency(resp) {
    this.ownCurrency = resp;
  }
}
