import { Component, OnInit } from '@angular/core';

import { HelperService } from '../services/helper.service';
import { ApiService } from '../services/api.service';
import * as moment from 'moment';
@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  userData: any
  transactionList: any = [];
  constructor(private _helper: HelperService, private _api: ApiService) { }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.userData = JSON.parse(localStorage.getItem('MAURY_User') || '')
    this._helper.startLoading();
    let data = {
      "user_id": this.userData.id,
      "pageNo": "1"
    }
    // call api to get all rewards
    this._api.getAllTransaction(data).subscribe(res => {
      console.log(res);
      if (res.error == false) {
        this.transactionList = res.data;
        this.transactionList.forEach((el: any) => {
          el.date = moment(el.created_at).format("Do MMMM, yyyy");
        });
        this._helper.dismissLoader();
      } else {
        this._helper.dismissLoader();
      }
    })
  }

}
