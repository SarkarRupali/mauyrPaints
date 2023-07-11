import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { HelperService } from '../services/helper.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  userData: any;
  notificationList: any = [];

  constructor(private _api: ApiService, private _helper: HelperService) { }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('MAURY_User') || '{}');
  }

  ionViewWillEnter() {
    this.getNotificationList()
  }

  // Method call to get banner list
  getNotificationList() {
    this._helper.autoLoading();
    this._api.getNotification({ 'user_id': this.userData.id }).subscribe(res => {
      console.log(res);
      if (res.error == false) {
        this.notificationList = res.data
        this._helper.dismissLoader();
      } else {
        this._helper.dismissLoader();
      }
    })
  }

  // Marking as a Read or Unread
  markingNotificationAsRead(notificationId: any) {
    this._api.notificationMarkAsRead(notificationId).subscribe(
      res => {
        if (res.error == false) {
          this.getNotificationList();
        }
      }
    )
  }
}
