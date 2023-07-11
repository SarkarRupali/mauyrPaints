import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { HelperService } from '../services/helper.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {
  categoryId: any = 0;
  productList: any = [];
  userData: any;

  constructor(private activtedRoute: ActivatedRoute, private _api: ApiService, private _helper: HelperService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.userData = JSON.parse(localStorage.getItem('MAURY_User') || '{}');
    this.categoryId = this.activtedRoute.snapshot.paramMap.get('categoryId');
    if (this.categoryId) {
      this.getProductList()
    }
  }

  // Method call to get product list category wise
  getProductList() {
    this._helper.autoLoading();
    this._api.getProductListCategoryWise(this.categoryId).subscribe(res => {
      console.log(res);
      if (res.error == false) {
        this.productList = res.product;
        this._helper.dismissLoader();
      } else {
        this._helper.dismissLoader();
      }
    })

  }
}
