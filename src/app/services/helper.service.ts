import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(private loadingController: LoadingController, private toastCtrl: ToastController) { }

  startLoading() {
    this.loadingController.create({
      message: 'Loading...'
    }).then((response) => {
      response.present();
    });
  }


  dismissLoader() {
    this.loadingController.dismiss().then((response) => {
      console.log('Loader closed!', response);
    }).catch((err) => {
      console.log('Error occured : ', err);
    });
  }

  async alertToast(msg: any) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 4000,
      position: 'top'
    });
    toast.present();
  }


}
