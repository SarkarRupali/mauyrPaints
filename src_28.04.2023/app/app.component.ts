import { Component } from '@angular/core';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  userDetails: any = {}
  constructor(private platform: Platform, private navCtrl: NavController, private router: Router, private alertCtrl: AlertController, private _location: Location) {
    this.initializeApp()
  }

  initializeApp() {

    let user = JSON.parse(localStorage.getItem("MAURY_User") || '{}')
    console.log(user);

    if (user.id) {
      this.navCtrl.navigateRoot('/home');
    } else {
      this.router.navigate(['/welcome']);
    }

    this.platform.backButton.subscribeWithPriority(1, (processNextHandler: any) => {
      if (this._location.isCurrentPathEqualTo('/home')) {
        this.showExitConfirm();
        processNextHandler();
      } else if (this._location.isCurrentPathEqualTo('/login')) {
        (navigator as any)['app'].exitApp();
      } else {
        // Navigate to back page
        this._location.back();
      }
    });
  }

  showExitConfirm() {
    this.alertCtrl.create({
      header: 'App termination',
      message: 'Do you want to close the app?',
      backdropDismiss: false,
      buttons: [{
        text: 'Stay',
        role: 'cancel',
        handler: () => {
          console.log('Application exit prevented!');
        }
      }, {
        text: 'Exit',
        handler: () => {
          (navigator as any)['app'].exitApp();
        }
      }]
    })
      .then(alert => {
        alert.present();
      });
  }

  /**
    * method call to after clicking on menu
  */
  openMenu() {
    this.userDetails = JSON.parse(localStorage.getItem("MAURY_User") || '');
    if (this.userDetails != '') {
      this.userDetails = JSON.parse(localStorage.getItem("MAURY_User") || '');
      console.log('userDetails', this.userDetails);
    }
  }


  // Method call to log out app
  logOut() {
    localStorage.clear();
    this.navCtrl.navigateRoot('/')
  }
}
