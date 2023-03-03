import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { SpaceValidatior } from "../services/space.validator";
import { ConfirmedValidator } from '../services/confirmed.validator';
import { HelperService } from '../services/helper.service';
import { ApiService } from '../services/api.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  public customerRegisterForm!: FormGroup;
  public showPsw = false;
  public showConfirmPsw = false;
  public passwordType = 'password';
  public cpasswordType = 'password'
  public submitted = false;

  constructor(private formBuilder: FormBuilder, private _helper: HelperService, private _api: ApiService, private navCtrl: NavController) { }

  ngOnInit() {
    this.customerRegisterForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z]+ [a-zA-Z]+$')]),
      email: new FormControl('', Validators.pattern('^[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,3}$')),
      mobile: new FormControl('', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]),
      whatsapp_no: new FormControl('', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]),
      address: new FormControl('', [Validators.required, SpaceValidatior.cannotContainSpace]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirm_password: new FormControl('', Validators.required),
    }, {
      validator: ConfirmedValidator('password', 'confirm_password') // custom validation for password and confirm password
    })

  }

  get f() {
    return this.customerRegisterForm.controls;
  }


  // Method call to show or hide password
  showPassword() {
    this.showPsw = !this.showPsw
    if (this.showPsw == false) {
      this.passwordType = 'password';
    } else {
      this.passwordType = 'text';
    }
  }

  // Method call to show or hide confirm password
  showConfirmPassword() {
    this.showConfirmPsw = !this.showConfirmPsw
    if (this.showConfirmPsw == false) {
      this.cpasswordType = 'password';
    } else {
      this.cpasswordType = 'text';
    }
  }

  // Method call to sign up user
  signUpCustomer() {
    this.submitted = true;
    if (this.customerRegisterForm.valid) {
      this._helper.startLoading();
      const mainData = this.customerRegisterForm.value
      this._api.registerWithCustomer(mainData).subscribe(
        res => {
          if (res.error == false) {
            this._helper.dismissLoader();
            this._helper.alertToast("Successfully registered as a customer");
            this.navCtrl.navigateRoot('/login');
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

