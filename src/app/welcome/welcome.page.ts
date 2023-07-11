import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  //method call to go to home page without login
  user() {
    this.navCtrl.navigateRoot('/home');
  }
}
