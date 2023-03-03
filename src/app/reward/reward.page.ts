import { Component, OnInit } from '@angular/core';
import { HelperService } from '../services/helper.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-reward',
  templateUrl: './reward.page.html',
  styleUrls: ['./reward.page.scss'],
})
export class RewardPage implements OnInit {
  userData: any;
  rewardsList: any = [];
  constructor(private _helper: HelperService, private _api: ApiService) { }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.userData = JSON.parse(localStorage.getItem('MAURY_User') || '')
    this._helper.startLoading();
    let data = {
      "user_id": this.userData.id,
      "pageNo": "1"
    }
    this._api.getRewards(data).subscribe(res => {
      console.log(res);
      if (res.error == false) {
        this.rewardsList = res.data;
        this._helper.dismissLoader();
      } else {
        this._helper.dismissLoader();
      }
    })
  }

}
