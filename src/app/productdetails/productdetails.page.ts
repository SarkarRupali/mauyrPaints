import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ApiService } from '../services/api.service';
import { HelperService } from '../services/helper.service';
import { environment } from 'src/environments/environment';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-productdetails',
  templateUrl: './productdetails.page.html',
  styleUrls: ['./productdetails.page.scss'],
})
export class ProductdetailsPage implements OnInit {
  productId: any;
  productdetails: any = {};
  productImages: any = [];
  userdata: any
  imageUrl = environment.baseImageUrl;
  slideOpts = {
    speed: 400,
    spaceBetween: 10,
    slidesPerView: 1,
  };

  constructor(private activatedRoute: ActivatedRoute, private _api: ApiService, private _helper: HelperService, private navCtrl: NavController) { }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.productId = this.activatedRoute.snapshot.paramMap.get('productId')
    this.userdata = JSON.parse(localStorage.getItem('MAURY_User') || '{}')
    if (this.productId) {
      this.getProductDetails()
    }
  }

  // Method call to get product details
  getProductDetails() {
    this._helper.startLoading();
    this._api.getProducDetails(this.productId).subscribe(res => {
      if (res.error == false) {
        console.log(res);
        this.productdetails = res.data;
        this.productImages = res.image;
        this._helper.dismissLoader()
      } else {
        this._helper.dismissLoader()
      }
    }, err => {
      this._helper.alertToast('Something went wrong. Please try again.')
      this._helper.dismissLoader()
    })
  }

  //Method call to go to order page
  goToorder() {
    if (this.userdata.type) {
      this.navCtrl.navigateForward('/enquire/' + this.productdetails.id)
    } else {
      this.navCtrl.navigateForward('/signup')
    }
  }
}
