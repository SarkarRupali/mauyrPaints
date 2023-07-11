import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActionSheetController, NavController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';

import { SpaceValidatior } from '../services/space.validator';
import { ApiService } from '../services/api.service';
import { HelperService } from '../services/helper.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss'],
})
export class ProfileEditPage implements OnInit {
  profileEditForm !: FormGroup;
  userDetails: any;
  submitted = false;
  profileimg = '';
  baseImageUrl = environment.baseImageUrl;

  constructor(private _api: ApiService, private _helper: HelperService, private navCtrl: NavController, private actionSheetController: ActionSheetController, private camera: Camera, private transfer: FileTransfer) { }

  ngOnInit() {
    this.profileEditForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z]+ [a-zA-Z]+$')]),
      email: new FormControl('', Validators.pattern('^[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,3}$')),
      mobile: new FormControl(''),
      whatsapp_no: new FormControl('', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]),
      address: new FormControl('', [Validators.required, SpaceValidatior.cannotContainSpace]),
      image: new FormControl(''),
    })
  }

  ionViewWillEnter() {
    this.userDetails = JSON.parse(localStorage.getItem('userDetails') || '')
    this.profileEditForm.patchValue({
      name: this.userDetails.name,
      email: this.userDetails.email,
      mobile: this.userDetails.mobile,
      whatsapp_no: this.userDetails.whatsapp_no,
      address: this.userDetails.address,
    })
  }

  get f() {
    return this.profileEditForm.controls;
  }

  // Method call to add profile image
  async imageAdd() {
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
        fileTransfer.upload(imageURI, 'http://45.113.122.201/mayurpaints/public/api/image/upload', options1)
          .then((data) => {
            console.log('data2', data);
            let value = JSON.parse(data.response);
            this.profileimg = value.data;
            this.profileEditForm.patchValue({
              image: this.profileimg
            })
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


  edit() {
    this.submitted = true;
    if (this.profileEditForm.valid) {
      this._helper.startLoading();
      const mainData = this.profileEditForm.value
      this._api.profileEdit(this.userDetails.id, mainData).subscribe(
        res => {
          if (res.error == false) {
            this._helper.dismissLoader();
            this._api.storeUserLocally(res.data);
            this._helper.alertToast("Successfully edit.");
            this.navCtrl.back();
          } else {
            this._helper.dismissLoader();
            this._helper.alertToast(res.message);
          }
        }, err => {
          this._helper.alertToast(err?.message);
          this._helper.dismissLoader();
        })
    }
  }

  // Method call to cancel edit go to previous page
  cancel() {
    this.navCtrl.back();
  }
}

