import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';

import { ApiService } from '../services/api.service';
import { HelperService } from '../services/helper.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public loginForm!: FormGroup;
  public showPsw = false;
  public passwordType = 'password';
  public submitted = false;
  // constructor() { }

  constructor(private helper: HelperService, private navCtrl: NavController, private apiService: ApiService) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      mobile: new FormControl('', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    })
  }

  // method return form controls
  get f() {
    return this.loginForm.controls;
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

  // Method call to login user
  submitLogin() {
    this.submitted = true;
    if (this.loginForm.valid) {
      this.helper.startLoading();
      const loginData = this.loginForm.value;
      this.apiService.login(loginData).subscribe((res: any) => {
        this.helper.dismissLoader();
        if (res.error == false) {
          if (res.data.type == 1 && res.data.is_approve == 0) {
            this.helper.alertToast("Please wait for admin approval.")
          } else {
            this.helper.alertToast("Successfully Login")
            this.apiService.storeUserLocally(res.data);
            this.navCtrl.navigateRoot('/home');
          }
        } else {
          this.helper.alertToast(res.resp)
        }
      });
    }
  }

}

