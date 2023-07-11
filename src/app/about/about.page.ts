import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { HelperService } from '../services/helper.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  userData: any;
  content: any
  constructor(private _api: ApiService, private _helper: HelperService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.userData = JSON.parse(localStorage.getItem('MAURY_User') || '{}')
    this._helper.autoLoading();
    this._api.aboutUs().subscribe(res => {
      if (res.error == false) this.content = res.data[0].content
    })
  }

}
