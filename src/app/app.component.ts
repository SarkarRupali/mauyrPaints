import { Component } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  userDetails: any = {}
  constructor(private platform: Platform, private navCtrl: NavController, private router: Router) {
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
  }

  // showExitConfirm() {
  //   this.alertCtrl.create({
  //     header: 'App termination',
  //     message: 'Do you want to close the app?',
  //     backdropDismiss: false,
  //     buttons: [{
  //       text: 'Stay',
  //       role: 'cancel',
  //       handler: () => {
  //         console.log('Application exit prevented!');
  //       }
  //     }, {
  //       text: 'Exit',
  //       handler: () => {
  //         navigator['app'].exitApp();
  //       }
  //     }]
  //   })
  //     .then(alert => {
  //       alert.present();
  //     });
  // }

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
