import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { HelperService } from '../services/helper.service';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-cash-form',
  templateUrl: './cash-form.page.html',
  styleUrls: ['./cash-form.page.scss'],
})
export class CashFormPage implements OnInit {
  userdetails: any
  amountForm!: FormGroup;
  submitted = false;
  amount: any = '';
  constructor(private _helper: HelperService, private _api: ApiService, private navCtrl: NavController, private alertCtrl: AlertController) { }

  ngOnInit() {
    this.userdetails = JSON.parse(localStorage.getItem('MAURY_User') || '{}')
    console.log(this.userdetails)
    this.amountForm = new FormGroup({
      amount: new FormControl('', [Validators.required, Validators.pattern('^[1-9][0-9]{0,8}$')]),
      // amount: new FormControl('', Validators.required)
    })

    this.amount = localStorage.getItem('Money')

  }

  get f() {
    return this.amountForm.controls;
  }

  // Method call to submit enquiry form
  submitForm() {
    this.submitted = true
    if (this.amountForm.valid) {
      this._helper.startLoading();
      const mainData = this.amountForm.value;
      mainData.user_id = this.userdetails.id;
      // mainData.amount = this.amountForm.value;
      this._api.submiamount(mainData).subscribe(
        res => {
          if (res.error == false) {
            this._helper.dismissLoader();
            this._helper.alertToast("Successfully submit.");
            this.navCtrl.back();
          } else {
            this._helper.dismissLoader();
            this.showAlert(res.resp)
            // this._helper.alertToast(res.resp);
          }
        }, err => {
          this._helper.alertToast(err?.message);
          this._helper.dismissLoader();
        })
    }
  }

  // Method call to show alert
  async showAlert(msg: any) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Oops!',
      message: msg,
      buttons: ['OK'],
    });

    await alert.present();
  }
}