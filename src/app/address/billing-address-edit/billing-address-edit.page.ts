import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavComponentWithProps, NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { HelperService } from 'src/app/services/helper.service';
import { SpaceValidatior } from 'src/app/services/space.validator';

@Component({
  selector: 'app-billing-address-edit',
  templateUrl: './billing-address-edit.page.html',
  styleUrls: ['./billing-address-edit.page.scss'],
})
export class BillingAddressEditPage implements OnInit {
  public addressForm !: FormGroup;
  userData: any;
  submitted = false;

  constructor(private _api: ApiService, private _helper: HelperService, private navCtrl: NavController) { }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('MAURY_User') || '{}')
    this.addressForm = new FormGroup({
      address: new FormControl('', [Validators.required, SpaceValidatior.cannotContainSpace]),
      state: new FormControl('', [Validators.required, SpaceValidatior.cannotContainSpace]),
      city: new FormControl('', [Validators.required, SpaceValidatior.cannotContainSpace]),
      pin: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{6}$')]),

    })
  }

  get f() {
    return this.addressForm.controls;
  }

  // Method call to edit address
  addressEdit() {
    this.submitted = true;
    if (this.addressForm.valid) {
      this._helper.startLoading();
      const addressForm = this.addressForm.value;
      addressForm.user_id = this.userData.id;
      this._api.editAddrss(addressForm).subscribe((res: any) => {
        console.log(res);
        if (res.error == false) {
          this._helper.dismissLoader();
          this._helper.alertToast("Successfully added.");
          this.navCtrl.back();
        } else {
          this._helper.dismissLoader();
          this._helper.alertToast(res.message);
        }
      }, err => {
        this._helper.dismissLoader();
        this._helper.alertToast('Something went wrong. Please try again');
      })
    }
  }
  // Method call to go to previous page
  cancel() {
    this.navCtrl.back()
  }

}
