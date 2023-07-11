import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
var baseURl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  header: any
  constructor(private http: HttpClient, private router: Router) {
    this.header = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Access-Control-Allow-Origin", '*')
      .set("Access-Control-Allow-Origin", 'POST, GET, OPTIONS, PUT')
  }

  storeUserLocally(data: any) {
    localStorage.clear();
    localStorage.setItem('MAURY_User', JSON.stringify(data));
    this.router.navigate(['/myaccount/profile']);
  }




  /****************************************  Painter ********************************************/
  //register
  registerWithPainter(registerData: any) {
    return this.http.post<any>(baseURl + 'painter/register', registerData)
  }
  //get shiiping address
  getShippingAddress(userId: any) {
    return this.http.get<any>(baseURl + 'show/address/' + userId)
  }
  //edit address
  editAddrss(addressForm: any) {
    return this.http.post<any>(baseURl + 'store/address', addressForm)
  }
  uploadDoc(formData: any) {
    return this.http.post<any>(baseURl + 'painter/identityDocument/upload', formData)
  }

  //home page data
  getpainterData(userId: any) {
    return this.http.get<any>(baseURl + `reward/product/list/${userId}`)
  }

  //gifts
  getAllGifts() {
    return this.http.get<any>(baseURl + 'reward/product')
  }

  //gift details
  giftdetails(giftId: any) {
    return this.http.get<any>(baseURl + `reward/product/${giftId}`)
  }

  // add rewards using qrcode
  addRewardPointsUsingQRCode(qrData: any) {
    return this.http.post<any>(baseURl + 'QRcode', qrData)
  }

  //redeem rewars
  redeemPoints(redeemData: any) {
    return this.http.post<any>(baseURl + 'place/order', redeemData)
  }

  //get total points
  gettotalrewardPoints(userId: any) {
    return this.http.get<any>(baseURl + `wallet/balance/${userId}`)
  }
  // get rewards
  getRewards(data: any) {
    return this.http.post<any>(baseURl + `reward/history`, data)
  }

  // get all transaction
  getAllTransaction(transactionData: any) {
    return this.http.post<any>(baseURl + `transaction/history`, transactionData)
  }

  // cash form 
  submiamount(amountData: any) {
    return this.http.post<any>(baseURl + `cash/withdrawal`, amountData)
  }



  /****************************************  Customer ********************************************/
  registerWithCustomer(registerData: any) {
    return this.http.post<any>(baseURl + 'customer/register', registerData)
  }

  /****************************************  Sales Person ********************************************/
  //check channel
  checkChannel(userId: any) {
    return this.http.post<any>(baseURl + 'chat/list', { 'user_id': userId })
  }
  //get message list
  getMessageList(channelId: any) {
    return this.http.post<any>(baseURl + 'chat/show', { 'channel_id': channelId })
  }
  //create channel
  channelCreate(senderId: any) {
    return this.http.post<any>(baseURl + 'chat/initiate', { 'sender_id': senderId })
  }
  //send message
  sendMessage(chatData: any) {
    return this.http.post<any>(baseURl + 'chat', chatData)
  }
  //get notifiction
  getNotification(notifyData: any) {
    return this.http.post<any>(baseURl + 'notification-list', notifyData)
  }

  //read notification
  notificationMarkAsRead(notifyId: any) {
    return this.http.post<any>(baseURl + 'read-notification', { id: notifyId })
  }

  /****************************************  Common ********************************************/
  // login
  login(formData: any) {
    return this.http.post<any>(baseURl + 'login', formData)
  }

  //get profile details
  getProfileData(userId: any) {
    return this.http.get<any>(baseURl + `user/profile/${userId}`)
  }
  //profile edit
  profileEdit(userId: any, editData: any) {
    return this.http.post<any>(baseURl + `update/profile/${userId}`, editData)
  }
  // get banner list
  getBannerList() {
    return this.http.get<any>(baseURl + 'banner')
  }

  // get category list
  getCategoryList() {
    return this.http.get<any>(baseURl + 'category')
  }

  // get product list category wise
  getProductListCategoryWise(categoryId: any) {
    return this.http.get<any>(baseURl + `category/${categoryId}/products`)
  }

  // get product details
  getProducDetails(productId: any) {
    return this.http.get<any>(baseURl + `product/${productId}`)
  }

  // enquiry form
  submitenquiryForm(formData: any) {
    return this.http.post<any>(baseURl + `add/enquery`, formData)
  }

  //complain form
  submitComplainForm(complainData: any) {
    return this.http.post<any>(baseURl + `add/complaint`, complainData)
  }

  //about us
  aboutUs() {
    return this.http.get<any>(baseURl + `about`)
  }

  // get order list
  getOrderList(userId: any) {
    return this.http.get<any>(baseURl + `order/image/list/${userId}`)
  }

  //order submit
  orderSubmit(orderForm: any) {
    return this.http.post<any>(baseURl + `order/create`, orderForm)
  }

}
