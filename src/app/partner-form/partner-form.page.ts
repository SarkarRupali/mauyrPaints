import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActionSheetController, NavController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';

import { HelperService } from '../services/helper.service';
import { ApiService } from '../services/api.service';
import { SpaceValidatior } from '../services/space.validator';
import { ConfirmedValidator } from '../services/confirmed.validator';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-partner-form',
  templateUrl: './partner-form.page.html',
  styleUrls: ['./partner-form.page.scss'],
})
export class PartnerFormPage implements OnInit {

  public painterForm!: FormGroup;
  public showPsw = false;
  public showConfirmPsw = false;
  public passwordType = 'password';
  public cpasswordType = 'password'
  public submitted = false;
  public profileimg: any = '';
  public imageURI: any;
  public baseImage = environment.baseImageUrl;

  constructor(private formBuilder: FormBuilder, private _helper: HelperService, private _api: ApiService, private navCtrl: NavController, private actionSheetController: ActionSheetController, private camera: Camera, private transfer: FileTransfer, private file: File) { }

  ngOnInit() {
    this.painterForm = this.formBuilder.group({
      // name: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z]+ [a-zA-Z]+$')]),
      name: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z][a-zA-Z ]+$')]),
      email: new FormControl('', Validators.pattern('^[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,3}$')),
      mobile: new FormControl('', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]),
      whatsapp_no: new FormControl('', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]),
      address: new FormControl('', [Validators.required, SpaceValidatior.cannotContainSpace]),
      state: new FormControl('', [Validators.required, SpaceValidatior.cannotContainSpace]),
      city: new FormControl('', [Validators.required, SpaceValidatior.cannotContainSpace]),
      pin: new FormControl('', [Validators.required, SpaceValidatior.cannotContainSpace]),
      aadhar: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirm_password: new FormControl('', Validators.required),
    }, {
      validator: ConfirmedValidator('password', 'confirm_password') // custom validation for password and confirm password
    })

  }

  get f() {
    return this.painterForm.controls;
  }


  // Method call to show or hide password 
  showPassword() {
    this.showPsw = !this.showPsw
    if (this.showPsw == false) {
      this.passwordType = 'password';
    } else {
      this.passwordType = 'text';
    }
  }

  // Method call to show or hide confirm password
  showConfirmPassword() {
    this.showConfirmPsw = !this.showConfirmPsw
    if (this.showConfirmPsw == false) {
      this.cpasswordType = 'password';
    } else {
      this.cpasswordType = 'text';
    }
  }

  //Method call to upload document
  async fileUpload() {
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
      this.imageURI = imageData;
      if (this.imageURI != "") {
        this._helper.startLoading();
        const fileTransfer: FileTransferObject = this.transfer.create();
        console.log('fileTransfer', fileTransfer);
        let options1: FileUploadOptions = {
          fileKey: 'aadhar',
          chunkedMode: false,
          mimeType: "image/jpeg, image/png", // add mimeType
          headers: {},
          params: { "aadhar": this.imageURI },
          httpMethod: 'POST'
        }
        fileTransfer.upload(this.imageURI, 'https://mayurpaints.dev91.website/api/painter/identityDocument/upload', options1)
          .then((data) => {
            console.log('data2', data);
            let value = JSON.parse(data.response);
            console.log('value', value);
            console.log('image', value.data);
            this.profileimg = value.data;
            this.painterForm.patchValue({
              aadhar: this.profileimg
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

  // Method call to sign up user
  signUpPainter() {
    this.submitted = true;
    if (this.painterForm.valid) {
      this._helper.startLoading();
      const mainData = this.painterForm.value
      this._api.registerWithPainter(mainData).subscribe(
        res => {
          if (res.error == false) {
            this._helper.dismissLoader();
            this._helper.alertToast("Successfully registered as a painter. Please wait for admin approval.");
            this.navCtrl.navigateRoot('/login');
            this.profileimg = '';
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

}
