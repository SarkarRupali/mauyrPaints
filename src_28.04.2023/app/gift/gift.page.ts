import { Component, OnInit } from '@angular/core';
import { HelperService } from '../services/helper.service';
import { ApiService } from '../services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-gift',
  templateUrl: './gift.page.html',
  styleUrls: ['./gift.page.scss'],
})
export class GiftPage implements OnInit {
  giftList: any = [];
  baseImageUrl = environment.baseImageUrl;

  constructor(private _helper: HelperService, private _api: ApiService) { }

  ngOnInit() {

    this._api.getAllGifts().subscribe(res => {
      // this._helper.startLoading();
      console.log(res);
      if (res.error == false) {
        this.giftList = res.data;
        this._helper.dismissLoader();
      } else {
        this._helper.dismissLoader();
      }
    })
  }

}
