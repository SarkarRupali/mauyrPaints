import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { ApiService } from '../services/api.service';
import { environment } from 'src/environments/environment';
import { HelperService } from '../services/helper.service';
@Component({
  selector: 'app-giftdetails',
  templateUrl: './giftdetails.page.html',
  styleUrls: ['./giftdetails.page.scss'],
})
export class GiftdetailsPage implements OnInit {
  userData: any;
  giftId: any = '';
  giftDetials: any;
  quantity = 1
  baseImageUrl = environment.baseImageUrl;

  constructor(private activatedRoute: ActivatedRoute, private _api: ApiService, private _helper: HelperService, private router: Router, private sanitizer: DomSanitizer) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.userData = JSON.parse(localStorage.getItem('MAURY_User') || '')
    this.giftId = this.activatedRoute.snapshot.paramMap.get('giftId');
    this._helper.autoLoading();
    this._api.giftdetails(this.giftId).subscribe(res => {
      console.log(res);
      if (res.error == false) {
        this.giftDetials = res.data;
        this.giftDetials.short_desc = `<style>
        h5 p{
          font-size: 16px;
          font-weight: 400;
      }
      </style>`+ this.giftDetials.short_desc
        this.giftDetials.short_desc = this.sanitizer.bypassSecurityTrustHtml(this.giftDetials.short_desc);
        this._helper.dismissLoader();
      } else {
        this._helper.dismissLoader();
      }
    })
  }

  // Method call to add quantity
  addquantity() {
    this.quantity += 1
  }
  // Method call to remove quantity
  removeQuantity() {
    if (this.quantity > 1) {
      this.quantity -= 1
    }
  }
  // Method call to go to address page
  goToAddress() {
    let giftdetails: any = {
      "id": this.giftDetials.id,
      "name": this.giftDetials.name,
      "image": this.giftDetials.image,
      "amount": this.giftDetials.points,
      "qty": this.quantity
    }
    localStorage.setItem('giftData', JSON.stringify(giftdetails))
    this.router.navigateByUrl('/billing-address')
  }

}
