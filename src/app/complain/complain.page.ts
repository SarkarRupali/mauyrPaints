import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { SpaceValidatior } from '../services/space.validator';
import { HelperService } from '../services/helper.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-complain',
  templateUrl: './complain.page.html',
  styleUrls: ['./complain.page.scss'],
})
export class ComplainPage implements OnInit {
  complainform !: FormGroup;
  userdetails: any;
  submitted = false;

  constructor(private _helper: HelperService, private _api: ApiService) { }

  ngOnInit() {
    this.complainform = new FormGroup({
      message: new FormControl('', [Validators.required, SpaceValidatior.cannotContainSpace])
    })

  }

  get f() {
    return this.complainform.controls;
  }

  ionViewWillEnter() {
    this.userdetails = JSON.parse(localStorage.getItem('MAURY_User') || '{}')

  }

  // Method call to submit enquiry form
  complainSubmit() {
    this.submitted = true;
    console.log(this.complainform.value);

    if (this.complainform.valid) {
      this._helper.startLoading();
      const mainData = this.complainform.value;
      mainData.user_id = this.userdetails.id;
      mainData.name = this.userdetails.name;
      mainData.mobile = this.userdetails.mobile;
      mainData.whatsapp_no = this.userdetails.whatsapp_no;
      mainData.address = this.userdetails.address;
      this._api.submitComplainForm(mainData).subscribe(
        res => {
          if (res.error == false) {
            this._helper.dismissLoader();
            this._helper.alertToast(res.message);
            this.submitted = false;
            this.complainform.reset();
          } else {
            this._helper.dismissLoader();
            this._helper.alertToast(res.message);
          }
        }, err => {
          this._helper.alertToast(err?.message);
          this._helper.dismissLoader();
        })
    }
  }
}