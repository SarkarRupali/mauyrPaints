import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  userData: any;

  constructor() { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.userData = JSON.parse(localStorage.getItem('MAURY_User') || '')
  }

}
