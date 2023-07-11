import { Component, OnInit } from '@angular/core';
import { ActionSheetController, NavController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { ApiService } from 'src/app/services/api.service';
import { HelperService } from 'src/app/services/helper.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.page.html',
  styleUrls: ['./order-form.page.scss'],
})
export class OrderFormPage implements OnInit {
  userData: any = {};
  orderImageURL: any = '';
  baseImageUrl: any = environment.baseImageUrl
  constructor(private _api: ApiService, private _helper: HelperService, private navCtrl: NavController, private actionSheetController: ActionSheetController, private camera: Camera, private transfer: FileTransfer) { }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('MAURY_User') || '{}');
  }

  // Method call to add profile image
  async orderImage() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: 'Take a Photo',
        icon: 'camera-outline',
        handler: () => {
          /* *************** CAMERA SELECTED ********************** */
          this.takePhoto(1);
        }
      }, {
        text: 'Pick From Gallery',
        icon: 'image-outline',
        handler: () => {
          /* *************** Gallary SELECTED ********************** */
          this.takePhoto(0);//photo library
        }
      },
      {
        text: 'Cancel',
        role: 'cancel',
        icon: 'close',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  /**
   * Method is call to upload image on server and database
   * @param sourceType 
  */

  takePhoto(sourceType: number) {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: sourceType,
    }

    this.camera.getPicture(options).then((imageData) => {
      console.log('imageData', imageData);
      let imageURI = imageData;
      if (imageURI != "") {
        this._helper.startLoading();
        const fileTransfer: FileTransferObject = this.transfer.create();
        console.log('fileTransfer', fileTransfer);
        let options1: FileUploadOptions = {
          fileKey: 'image',
          chunkedMode: false,
          mimeType: "image/jpeg, image/png", // add mimeType
          headers: {},
          params: { "image": imageURI },
          httpMethod: 'POST'
        }
        fileTransfer.upload(imageURI, 'http://45.113.122.201/mayurpaints/public/api/order/image/upload', options1)
          .then((data) => {
            console.log('data2', data);
            let value = JSON.parse(data.response);
            console.log('value', value);
            console.log('image', value.data);
            this.orderImageURL = value.data;
            this._helper.dismissLoader();
          }, (err) => {
            console.log('error', err);
            this._helper.dismissLoader();
          });
      }
    }, (err) => {
      // Handle error
    });
  }

  // Method call to submit order using image
  submitImage() {
    this._helper.autoLoading();
    let data = {
      "user_id": this.userData.id,
      "image": this.orderImageURL
    }
    this._api.orderSubmit(data).subscribe(res => {
      console.log(res)
      if (res.error == false) {
        this._helper.alertToast('Successfully submited');
        this.navCtrl.back();
      } else {
        this._helper.alertToast('Something went wrong. Please try again');
      }
    })
  }

}
