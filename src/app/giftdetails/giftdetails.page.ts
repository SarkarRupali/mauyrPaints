import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiService } from '../services/api.service';
import { environment } from 'src/environments/environment';
import { HelperService } from '../services/helper.service';

@Component({
  selector: 'app-giftdetails',
  templateUrl: './giftdetails.page.html',
  styleUrls: ['./giftdetails.page.scss'],
})
export class GiftdetailsPage implements OnInit {
  userData: any;
  giftId: any = '';
  giftDetials: any;
  quantity = 1
  baseImageUrl = environment.baseImageUrl;

  constructor(private activatedRoute: ActivatedRoute, private _api: ApiService, private _helper: HelperService, private router: Router) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.userData = JSON.parse(localStorage.getItem('MAURY_User') || '')
    this.giftId = this.activatedRoute.snapshot.paramMap.get('giftId');
    this._helper.startLoading();
    this._api.giftdetails(this.giftId).subscribe(res => {
      console.log(res);
      if (res.error == false) {
        this.giftDetials = res.data;
        this._helper.dismissLoader();
      } else {
        this._helper.dismissLoader();
      }
    })
  }

  // Method call to add quantity
  addquantity() {
    this.quantity += 1
  }
  // Method call to remove quantity
  removeQuantity() {
    if (this.quantity > 1) {
      this.quantity -= 1
    }
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
      "shippingSameAsBilling": 0,
      "shipping_country": "",
      "shipping_address": "",
      "shipping_landmark": "",
      "shipping_city": "",
      "shipping_state": "",
      "shipping_pin": '',
      "product_id": this.giftDetials.id,
      "product_name": this.giftDetials.name,
      "product_image": this.giftDetials.image,
      "amount": this.giftDetials.points,
      "qty": this.quantity
    }
    this._api.redeemPoints(data).subscribe(res => {
      console.log(res);
      if (res.error == false && res.resp == "Wallet balance is low") {
        this._helper.dismissLoader();
        this._helper.alertToast(res.resp);
      } else if (res.error == false) {
        this._helper.dismissLoader();
        this._helper.alertToast(res.resp);
        this.router.navigate(['/home'])
      } else {
        this._helper.dismissLoader();
        this._helper.alertToast('Something went wrong. Please try again');
      }
    })
  }

}
