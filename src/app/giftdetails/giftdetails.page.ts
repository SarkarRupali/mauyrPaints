import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-giftdetails',
  templateUrl: './giftdetails.page.html',
  styleUrls: ['./giftdetails.page.scss'],
})
export class GiftdetailsPage implements OnInit {
  giftId: any = '';

  constructor(private activatedRoute: ActivatedRoute, private _api: ApiService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.giftId = this.activatedRoute.snapshot.paramMap.get('giftId')
    // this._api.giftdetails().
  }

}
