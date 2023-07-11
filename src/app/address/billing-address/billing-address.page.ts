import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from 'src/app/services/api.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-billing-address',
  templateUrl: './billing-address.page.html',
  styleUrls: ['./billing-address.page.scss'],
})
export class BillingAddressPage implements OnInit {
  userData: any;
  giftDetails: any;
  shippingAddress: any;
  shippingData: number = 0;
  constructor(private _api: ApiService, private _helper: HelperService, private router: Router) { }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('MAURY_User') || '{}')
  }

  ionViewWillEnter() {
    this.giftDetails = JSON.parse(localStorage.getItem('giftData') || '{}');
    this.getAddress()
  }

  // Method call to get shiiping address
  getAddress() {
    this._helper.autoLoading();
    this._api.getShippingAddress(this.userData.id).subscribe(res => {
      console.log(res);
      if (res.error == false && res.resp == 'No data found') {
        console.log('Enter 1');

        this.shippingData = 1;
        this.shippingAddress = this.userData
      } else {
        console.log('Enter 2');
        this.shippingAddress = res.data
        this.shippingData = 0;
      }
      console.log('shippingAddress', this.shippingAddress);

      this._helper.dismissLoader();
    })
  }

  purchaseGifts() {
    let data = {
      "user_id": this.userData.id,
      "mobile": this.userData.mobile,
      "billing_country": "",
      "billing_address": this.userData.address,
      "billing_landmark": "",
      "billing_city": this.userData.city,
      "billing_state": this.userData.state,
      "billing_pin": this.userData.pin,
      "shippingSameAsBilling": this.shippingData,
      "shipping_country": "",
      "shipping_address": this.shippingAddress.address,
      "shipping_landmark": "",
      "shipping_city": this.shippingAddress.city,
      "shipping_state": this.shippingAddress.state,
      "shipping_pin": this.shippingAddress.pin,
      "product_id": this.giftDetails.id,
      "product_name": this.giftDetails.name,
      "product_image": this.giftDetails.image,
      "amount": this.giftDetails.amount,
      "qty": this.giftDetails.qty
    }
    this._api.redeemPoints(data).subscribe(res => {
      console.log(res);
      if (res.error == false && res.resp == "Wallet balance is low") {
        this._helper.dismissLoader();
        this._helper.alertToast(res.resp);
      } else if (res.error == false) {
        this._helper.dismissLoader();
        this._helper.alertToast(res.message);
        this.router.navigate(['/home'])
      } else {
        this._helper.dismissLoader();
        this._helper.alertToast('Something went wrong. Please try again');
      }
    })
  }

}
