import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { HelperService } from 'src/app/services/helper.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-orderlist',
  templateUrl: './orderlist.page.html',
  styleUrls: ['./orderlist.page.scss'],
})
export class OrderlistPage implements OnInit {
  orderList: any = [];
  userData: any = {};
  baseImageUrl = environment.baseImageUrl;
  constructor(private _helper: HelperService, private _api: ApiService) { }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('MAURY_User') || '{}');
  }

  ionViewWillEnter() {
    this._helper.autoLoading();
    this._api.getOrderList(this.userData.id).subscribe(res => {
      console.log(res)
      if (res.error == false) this.orderList = res.data
    })
  }

}
