import { Component, OnInit } from '@angular/core';

import { ApiService } from '../services/api.service';
import { HelperService } from '../services/helper.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  userData: any;
  bannerList: any = [];
  categoryList: any = [];
  baseImageUrl = environment.baseImageUrl;

  constructor(private _api: ApiService, private _helper: HelperService) { }

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
    console.log('userData', this.userData);
    // this._helper.startLoading();
    this.getBanner();
    this.getCategory();
  }

  // Method call to get banner list
  getBanner() {
    this._api.getBannerList().subscribe(res => {
      console.log(res);
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
      console.log(res);
      if (res.error == false) {
        this.categoryList = res.data
        this._helper.dismissLoader();
      } else {
        this._helper.dismissLoader();
      }
    })
  }

  // getPoints(){
  //   this._api.getuserPoints().subscribe(res => {
  //     console.log(res);
  //     if (res.error == false) {
  //       this.categoryList = res.data
  //       this._helper.dismissLoader();
  //     } else {
  //       this._helper.dismissLoader();
  //     }
  //   })
  // }


}
