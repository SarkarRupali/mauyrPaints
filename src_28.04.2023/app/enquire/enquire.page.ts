import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { SpaceValidatior } from '../services/space.validator';
import { HelperService } from '../services/helper.service';
import { ApiService } from '../services/api.service';
import { ActionSheetController, NavController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-enquire',
  templateUrl: './enquire.page.html',
  styleUrls: ['./enquire.page.scss'],
})
export class EnquirePage implements OnInit {
  productId: any;
  userdetails: any = {};
  enquiryForm!: FormGroup;
  imageUrl: any = '';
  submitted = false;
  baseimageUrl = environment.baseImageUrl;

  constructor(private activatedRoute: ActivatedRoute, private _helper: HelperService, private _api: ApiService, private navCtrl: NavController, private actionSheetController: ActionSheetController, private camera: Camera, private transfer: FileTransfer) { }

  ngOnInit() {
    this.enquiryForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z]+ [a-zA-Z]+$')]),
      mobile: new FormControl('', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]),
      whatsapp_no: new FormControl('', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]),
      address: new FormControl('', [Validators.required, SpaceValidatior.cannotContainSpace]),
      message: new FormControl('', [Validators.required, SpaceValidatior.cannotContainSpace]),
      image: new FormControl('')
    })

  }

  get f() {
    return this.enquiryForm.controls;
  }

  ionViewWillEnter() {
    this.productId = this.activatedRoute.snapshot.paramMap.get('productId')
    this.userdetails = JSON.parse(localStorage.getItem('MAURY_User') || '{}')
    console.log('user', this.userdetails)
    if (this.userdetails) {
      this.enquiryForm.patchValue({
        name: this.userdetails.name,
        mobile: this.userdetails.mobile,
        whatsapp_no: this.userdetails.whatsapp_no,
        address: this.userdetails.address
      })
    }
  }

  // Method call to submit enquiry form
  submitEnquiry() {
    this.submitted = true
    if (this.enquiryForm.valid) {
      this._helper.startLoading();
      const mainData = this.enquiryForm.value;
      mainData.user_id = this.userdetails.id;
      mainData.product_id = this.productId;
      this._api.submitenquiryForm(mainData).subscribe(
        res => {
          if (res.error == false) {
            this._helper.dismissLoader();
            this._helper.alertToast("Successfully submit your enquiry form.");
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

  // image add
  async addImage() {
    console.log('ADD image')
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: 'Take a Photo',
        icon: 'camera-outline',
        handler: () => {
          this.takePhoto(1);
        }
      }, {
        text: 'Pick From Gallery',
        icon: 'image-outline',
        handler: () => {
          this.takePhoto(0);//photo library
        }
      }, {
        text: 'Cancel',
        role: 'cancel',
        icon: 'close',
        handler: () => {
          // console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  takePhoto(sourceType: number) {
    console.log('ADD image2')
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: sourceType,
    }
    console.log('options', options)
    this.camera.getPicture(options).then((imageData) => {
      console.log('imageData', imageData);
      if (imageData != "") {
        this._helper.startLoading();
        const fileTransfer: FileTransferObject = this.transfer.create();
        console.log('fileTransfer', fileTransfer);
        let options1: FileUploadOptions = {
          fileKey: 'image',
          chunkedMode: false,
          mimeType: "", // add mimeType
          headers: {},
          params: { "image": imageData },
          httpMethod: 'POST'
        }
        fileTransfer.upload(imageData, 'http://45.113.122.201/mayurpaints/public/api/enquery/image/upload', options1)
          .then((data) => {
            console.log('data2', data);
            let value = JSON.parse(data.response);
            this.enquiryForm.patchValue({
              image: value.data
            })
            this.imageUrl = value.data
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

}