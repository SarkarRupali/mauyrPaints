import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';

import { SpaceValidatior } from '../services/space.validator';
import { ApiService } from '../services/api.service';
import { HelperService } from '../services/helper.service';


@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss'],
})
export class ProfileEditPage implements OnInit {
  profileEditForm !: FormGroup;
  userDetails: any;
  submitted = false;

  constructor(private _api: ApiService, private _helper: HelperService, private navCtrl: NavController) { }

  ngOnInit() {
    this.profileEditForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z]+ [a-zA-Z]+$')]),
      email: new FormControl('', Validators.pattern('^[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,3}$')),
      mobile: new FormControl('', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]),
      whatsapp_no: new FormControl('', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]),
      address: new FormControl('', [Validators.required, SpaceValidatior.cannotContainSpace]),

    })
  }

  ionViewWillEnter() {
    this.userDetails = JSON.parse(localStorage.getItem('userDetails') || '')
    this.profileEditForm.patchValue({
      name: this.userDetails.name,
      email: this.userDetails.email,
      mobile: this.userDetails.mobile,
      whatsapp_no: this.userDetails.whatsapp_no,
      address: this.userDetails.address,
    })
  }

  get f() {
    return this.profileEditForm.controls;
  }

  // Method call to add profile image
  imageAdd() {

  }

  edit() {
    this.submitted = true;
    if (this.profileEditForm.valid) {
      this._helper.startLoading();
      const mainData = this.profileEditForm.value
      this._api.profileEdit(this.userDetails.id, mainData).subscribe(
        res => {
          if (res.error == false) {
            this._helper.dismissLoader();
            this._api.storeUserLocally(res.data);
            this._helper.alertToast("Successfully edit.");
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

  // Method call to cancel edit go to previous page
  cancel() {
    this.navCtrl.back();
  }
}

