import { Component } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  userDetails: any = {}
  constructor(private platform: Platform, private navCtrl: NavController) {
    this.initializeApp()
  }
  initializeApp() {

    this.platform.ready().then(() => {
      this.userDetails = JSON.parse(localStorage.getItem("MAURY_User") || '{}');

      // if (JSON.parse(localStorage.getItem('userData')) == null) {
      // this.router.navigate(['/login']);
      // } else {
      // this.navCtrl.navigateRoot('/home');
      // }
    })
  }

  // Method call to log out app
  logOut() {
    localStorage.clear();
    this.navCtrl.navigateRoot('/')
  }
}
