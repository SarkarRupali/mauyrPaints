import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';

import { ApiService } from '../services/api.service';
import { environment } from 'src/environments/environment';
import { HelperService } from '../services/helper.service';
import * as moment from 'moment'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  userId: any = 0;
  channleId: any;
  message: any = '';
  type: any = '';
  imageURI: any = '';
  messageList: any = [];
  baseImageUrl = environment.baseImageUrl;

  constructor(private _api: ApiService, private actionSheetController: ActionSheetController, private camera: Camera, private transfer: FileTransfer, private _helper: HelperService) { }

  ngOnInit() {
    this.userId = JSON.parse(localStorage.getItem('MAURY_User') || '').id;
    this.checkchannelUser()
  }

  // Method call to check if chat channel created or not
  checkchannelUser() {
    this._api.checkChannel(this.userId).subscribe(res => {
      console.log('check', res);
      if (res.error == false) {
        this.channleId = res.data[0]?.id
        if (this.channleId) {
          this.getMessage();
        }
      }
    })
  }

  getMessage() {
    this._api.getMessageList(this.channleId).subscribe(res => {
      console.log('list', res);
      if (res.error == false) {
        this.messageList = res.data;
        this.messageList.forEach((el: any) => {
          let day = moment(el.created_at).format('ddd MMM DD yyyy, hh:mm:ss a')
          console.log(day);

          el.daysago = moment(day).fromNow()
        });

      }
    })
  }

  // Method call to send message
  sendMessage() {
    if (this.channleId) {
      this.createMessage();
    } else {
      //create channel
      this._api.channelCreate(this.userId).subscribe(res => {
        console.log(res);
        if (res.error == false) {
          this.channleId = res.data.id
          this.createMessage()
        }
      })
    }
  }


  async uploadDoc() {
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
          fileKey: 'message',
          chunkedMode: false,
          mimeType: "", // add mimeType
          headers: {},
          params: { "message": this.imageURI },
          httpMethod: 'POST'
        }
        fileTransfer.upload(this.imageURI, 'https://mayurpaints.dev91.website/api/chat/document', options1)
          .then((data) => {
            console.log('data2', data);
            let value = JSON.parse(data.response);
            console.log('value', value);
            console.log('image', value.data);
            this.message = value.data;
            this.type = 'document';
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


  createMessage() {
    let data = {
      "channel_id": this.channleId,
      "sender_id": this.userId,
      "message": this.message,
      "flag": this.type == '' ? 'text' : this.type
    }
    this._api.sendMessage(data).subscribe(res => {
      if (res.error == false) {
        this.message = '';
        this.getMessage()
      }
    })
  }


}
