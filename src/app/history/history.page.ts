import { Component, OnInit } from '@angular/core';

import { HelperService } from '../services/helper.service';
import { ApiService } from '../services/api.service';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  userData: any
  transactionList: any = [];
  isModalOpen: any = false;
  orderDetails: any;
  orderType: any = '';
  subscription: any
  baseURL = environment.baseImageUrl
  constructor(private _helper: HelperService, private _api: ApiService, private navCtrl: NavController) { }

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

  // Method call to open a modal for showing purchase details
  setOpen(isOpen: boolean, transaction: any) {
    this.orderType = transaction.type // == "cash withdrawal"
    this.orderDetails = transaction.orders
    localStorage.setItem('orderType', this.orderType)
    localStorage.setItem('orderDetails', JSON.stringify(this.orderDetails))
    this.navCtrl.navigateForward('/history-details')
  }
}
