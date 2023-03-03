import { Component, OnInit } from '@angular/core';
import { HelperService } from '../services/helper.service';
import { ApiService } from '../services/api.service';
import * as moment from 'moment';

@Component({
  selector: 'app-reward',
  templateUrl: './reward.page.html',
  styleUrls: ['./reward.page.scss'],
})
export class RewardPage implements OnInit {
  userData: any;
  totalPoints: any = 0;
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
    // call api to get all rewards
    this._api.getRewards(data).subscribe(res => {
      console.log(res);
      if (res.error == false) {
        this.rewardsList = res.data;
        this.rewardsList.forEach((el: any) => {
          el.date = moment(el.created_at).format("Do MMMM, yyyy");
        });
        this._helper.dismissLoader();
      } else {
        this._helper.dismissLoader();
      }
    })

    this.getUserPoints()
  }

  // Method call to get total points
  getUserPoints() {
    this._api.gettotalrewardPoints(this.userData.id).subscribe(res => {
      console.log('rewars', res);
      if (res.error == false) {
        this.totalPoints = res.data;
        this._helper.dismissLoader();
      } else {
        this._helper.dismissLoader();
      }
    })
  }


}
