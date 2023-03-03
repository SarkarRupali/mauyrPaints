import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ApiService } from '../services/api.service';
import { HelperService } from '../services/helper.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-productdetails',
  templateUrl: './productdetails.page.html',
  styleUrls: ['./productdetails.page.scss'],
})
export class ProductdetailsPage implements OnInit {
  productId: any;
  productdetails: any = {};
  imageUrl = environment.baseImageUrl;
  constructor(private activatedRoute: ActivatedRoute, private _api: ApiService, private _helper: HelperService) { }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.productId = this.activatedRoute.snapshot.paramMap.get('productId')
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
        this._helper.dismissLoader()
      } else {
        this._helper.dismissLoader()
      }
    })
  }

}
