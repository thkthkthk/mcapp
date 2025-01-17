import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {
  url: string = 'https://openexchangerates.org/api/latest.json?app_id=0431c0385b37484cbaf674ba6aaeb3b0&symbols=USD,AUD,MYR,SGD';
  //key: string = '0431c0385b37484cbaf674ba6aaeb3b0';

  constructor(public http: HttpClient) {
  }

  getSupportedCurrencyRate() {
    return this.http.get(this.url);
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    return this.http.post(this.url + '/' + endpoint, body, reqOpts);
  }

  put(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.url + '/' + endpoint, body, reqOpts);
  }

  delete(endpoint: string, reqOpts?: any) {
    return this.http.delete(this.url + '/' + endpoint, reqOpts);
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    return this.http.patch(this.url + '/' + endpoint, body, reqOpts);
  }
}
