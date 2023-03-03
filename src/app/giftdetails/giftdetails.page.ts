import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-giftdetails',
  templateUrl: './giftdetails.page.html',
  styleUrls: ['./giftdetails.page.scss'],
})
export class GiftdetailsPage implements OnInit {
  giftId: any = '';
  giftDetials: any;
  baseImageUrl = environment.baseImageUrl;

  constructor(private activatedRoute: ActivatedRoute, private _api: ApiService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.giftId = this.activatedRoute.snapshot.paramMap.get('giftId')
    this._api.giftdetails(this.giftId).subscribe(res => {
      console.log(res);
      if (res.error == false) {
        this.giftDetials = res.data
      }
    })
  }

}
