import { Component, OnInit } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { NavController } from '@ionic/angular';

import { ApiService } from '../services/api.service';
import { HelperService } from '../services/helper.service';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  userData: any;
  userPoints: any = 0;
  bannerList: any = [];
  categoryList: any = [];
  top5GiftList: any = [];
  lastHistory: any = [];
  notifiction: any = [];
  baseImageUrl = environment.baseImageUrl;

  constructor(private _api: ApiService, private _helper: HelperService, private barcodeScanner: BarcodeScanner, private navCtrl: NavController) { }

  slideOpts = {
    speed: 400,
    spaceBetween: 16,
    slidesPerView: 2.5,
  };

  homeSlide = {
    speed: 400,
    spaceBetween: 10,
    slidesPerView: 1,
  };

  ngOnInit() {
    //get user from local storage after login
    this.userData = JSON.parse(localStorage.getItem('MAURY_User') || '{}');
    this._helper.autoLoading();
    this.getBanner();
    this.getCategory();

  }

  ionViewWillEnter() {
    if (this.userData.type == 1) {
      this.painterData();
    }
    if (this.userData.type == 2 || this.userData.type == 3) {
      this.getNotification();
    }
  }

  // Method call to get banner list
  getBanner() {
    this._api.getBannerList().subscribe(res => {
      if (res.error == false) {
        this.bannerList = res.data
        this._helper.dismissLoader();
      } else {
        this._helper.dismissLoader();
      }
    })
  }


  // Method call to get category list
  getCategory() {
    this._api.getCategoryList().subscribe(res => {
      if (res.error == false) {
        this.categoryList = res.data
        this._helper.dismissLoader();
      } else {
        this._helper.dismissLoader();
      }
    })
  }

  // Method call to get home rewrds data
  painterData() {
    this._api.getpainterData(this.userData.id).subscribe(res => {
      if (res.error == false) {
        this.top5GiftList = res.rewardproduct;
        this.userPoints = res.userPoints;
        this.lastHistory = res.history;
        this.lastHistory.forEach((el: any) => {
          el.date = moment(el.created_at).format("Do MMMM, yyyy");
        });
        this._helper.dismissLoader();
      } else {
        this._helper.dismissLoader();
      }
    })
  }

  //get Notification List
  getNotification() {
    this.notifiction = [];
    this._api.getNotification({ 'user_id': this.userData.id }).subscribe(res => {
      console.log(res);
      if (res.error == false) {
        res.data.forEach((el: any) => {
          if (el.read_flag == 0) {
            this.notifiction.push(el)
          }
        })

      }
    })
  }


  // Method call to scan qr code and get data
  scanQRCode() {
    const options: BarcodeScannerOptions = {
      preferFrontCamera: false,
      showFlipCameraButton: true,
      showTorchButton: true,
      torchOn: false,
      prompt: 'Place a barcode inside the scan area',
      resultDisplayDuration: 500,
      //formats: 'EAN_13,EAN_8,QR_CODE,PDF_417 ',
      formats: 'QR_CODE',
      orientation: 'portrait',
    };

    this.barcodeScanner.scan(options).then(qrCodeData => {
      if (qrCodeData.cancelled == false) {
        this._helper.startLoading()
        let data = {
          "code": qrCodeData.text,
          "user_id": this.userData.id
        }
        this._api.addRewardPointsUsingQRCode(data).subscribe(res => {
          if (res.error == false) {
            this._helper.dismissLoader();
            this._helper.alertToast('You get reward successfully.')
            this.navCtrl.navigateForward('/reward')
          } else {
            this._helper.dismissLoader();
            this._helper.alertToast(res.resp)
          }
        }, err => {
          this._helper.dismissLoader();
          this._helper.alertToast('Something went wrong. Please try again')
        })
      }

    }).catch(err => {
      console.log('Error', err);
    });
  }


  //Method call to  go to gift page
  goToGiftPage() {
    if (this.userPoints != 0) {
      this.navCtrl.navigateForward('/gift')
    }
  }

  // Method call to go to form page to withdraw cash
  goToCashForm() {
    localStorage.setItem('Money', this.userPoints)
    this.navCtrl.navigateForward('/cash-form')
  }



}
