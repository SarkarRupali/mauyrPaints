import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { ApiService } from '../services/api.service';
import { HelperService } from '../services/helper.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userId: any = 0;
  profileDetails: any;
  constructor(private _api: ApiService, private _helper: HelperService, private navCtrl: NavController) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.userId = JSON.parse(localStorage.getItem('MAURY_User') || '').id;
    this.getUserDetails();
  }

  // Method call to get profile details
  getUserDetails() {
    if (this.userId != '') {
      this._helper.startLoading();
      this._api.getProfileData(this.userId).subscribe(res => {
        console.log(res);
        console.log(res.data);
        if (res.error == false) {
          this.profileDetails = res.data;
          localStorage.setItem('userDetails', JSON.stringify(res.data))
          this._helper.dismissLoader();
        }
      })
    }
  }

  // Method call to go to eit profile page
  goToEditPage() {
    this.navCtrl.navigateForward('/profile-edit')
  }

}
