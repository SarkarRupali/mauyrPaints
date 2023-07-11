import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-history-details',
  templateUrl: './history-details.page.html',
  styleUrls: ['./history-details.page.scss'],
})
export class HistoryDetailsPage implements OnInit {
  orderType: any = '';
  orderDetails: any = '';
  baseURL: any = environment.baseImageUrl;
  constructor() { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.orderType = localStorage.getItem('orderType')
    this.orderDetails = JSON.parse(localStorage.getItem('orderDetails') || '{}')
  }

}
