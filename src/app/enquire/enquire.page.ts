import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { SpaceValidatior } from '../services/space.validator';
import { HelperService } from '../services/helper.service';
import { ApiService } from '../services/api.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-enquire',
  templateUrl: './enquire.page.html',
  styleUrls: ['./enquire.page.scss'],
})
export class EnquirePage implements OnInit {
  productId: any;
  userdetails: any = {};
  enquiryForm!: FormGroup;
  submitted = false;
  constructor(private activatedRoute: ActivatedRoute, private _helper: HelperService, private _api: ApiService, private navCtrl: NavController) { }

  ngOnInit() {
    this.enquiryForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z]+ [a-zA-Z]+$')]),
      mobile: new FormControl('', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]),
      whatsapp_no: new FormControl('', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]),
      address: new FormControl('', [Validators.required, SpaceValidatior.cannotContainSpace]),
      message: new FormControl('', [Validators.required, SpaceValidatior.cannotContainSpace])
    })

  }

  get f() {
    return this.enquiryForm.controls;
  }

  ionViewWillEnter() {
    this.productId = this.activatedRoute.snapshot.paramMap.get('productId')
    this.userdetails = JSON.parse(localStorage.getItem('MAURY_User') || '{}')
    if (this.userdetails) {
      this.enquiryForm.patchValue({
        name: this.userdetails.name,
        mobile: this.userdetails.mobile,
        whatsapp_no: this.userdetails.whatsapp_no,
        address: this.userdetails.address
      })
    }
  }

  // Method call to submit enquiry form
  submitEnquiry() {
    this.submitted = true
    if (this.enquiryForm.valid) {
      this._helper.startLoading();
      const mainData = this.enquiryForm.value;
      mainData.user_id = this.userdetails.id;
      mainData.product_id = this.productId;
      this._api.submitenquiryForm(mainData).subscribe(
        res => {
          if (res.error == false) {
            this._helper.dismissLoader();
            this._helper.alertToast("Successfully submit your enquiry form.");
            this.navCtrl.back();
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