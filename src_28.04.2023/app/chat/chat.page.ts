import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { IonContent } from '@ionic/angular';

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
  callData: any;
  baseImageUrl = environment.baseImageUrl;

  @ViewChild(IonContent, { read: IonContent, static: false }) myContent!: IonContent;

  constructor(private _api: ApiService, private actionSheetController: ActionSheetController, private camera: Camera, private transfer: FileTransfer, private _helper: HelperService, private file: File, private chooser: FileChooser, private filePath: FilePath) { }

  ngOnInit() {
    this.userId = JSON.parse(localStorage.getItem('MAURY_User') || '').id;
    this.ScrollToBottom();
  }

  ionViewWillEnter() {

    this.checkchannelUser()
    this.callData = setInterval(() => {
      // let storedata = JSON.parse(localStorage.getItem('chat') || '[]')
      // this._api.getMessageList(this.channleId).subscribe(res => {
      //   console.log('list', res);
      //   if (res.error == false) {
      //     if (res.data[res.data.length - 1].id !== storedata[storedata.length - 1].id) {
      //       this.messageList = res.data;
      //     }
      //   }
      // })
      // this.scrollToBottomOnInit();
      this.getMessage();

    }, 5000)

  }


  // Method call to check if chat channel created or not
  checkchannelUser() {
    this._api.checkChannel(this.userId).subscribe(res => {
      console.log('check', res);
      if (res.error == false) {
        this.channleId = res.data[0]?.id
        if (this.channleId) {
          this._api.getMessageList(this.channleId).subscribe(res => {
            console.log('list', res);
            if (res.error == false) {
              this.messageList = res.data;
              this.messageList.forEach((el: any) => {
                let day = moment(el.created_at).format('ddd MMM DD yyyy, hh:mm:ss a')
                el.daysago = moment(day).fromNow();
                if (el.flag == "document") {
                  let name = el.message.split("document/")
                  el.filename = name[1]
                }
              });
              localStorage.setItem('chat', JSON.stringify(this.messageList))
            }
          })
        }
      }
    })
  }

  getMessage() {
    // this.ScrollToBottom();
    this._api.getMessageList(this.channleId).subscribe(res => {
      console.log('list', res);
      if (res.error == false) {
        let storedata = JSON.parse(localStorage.getItem('chat') || '[]')
        if (res.data[res.data.length - 1].id !== storedata[storedata.length - 1].id) {
          this.messageList = res.data;
          this.messageList.forEach((el: any) => {
            let day = moment(el.created_at).format('ddd MMM DD yyyy, hh:mm:ss a')
            el.daysago = moment(day).fromNow();
            if (el.flag == "document") {
              let name = el.message.split("document/")
              el.filename = name[1]
            }
          });
          localStorage.setItem('chat', JSON.stringify(this.messageList))
        }
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
        text: 'Document Upload',
        icon: 'image-outline',
        handler: () => {
          /* *************** Selected for file ********************** */
          this.uploadWarrantyDoc();//phone library
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
        // const fileTransfer: FileTransferObject = this.transfer.create();
        // console.log('fileTransfer', fileTransfer);
        // let options1: FileUploadOptions = {
        //   fileKey: 'message',
        //   chunkedMode: false,
        //   mimeType: "", // add mimeType
        //   headers: {},
        //   params: { "message": this.imageURI },
        //   httpMethod: 'POST'
        // }
        // fileTransfer.upload(this.imageURI, 'https://mayurpaints.dev91.website/api/chat/document', options1)
        //   .then((data) => {
        //     console.log('data2', data);
        //     let value = JSON.parse(data.response);
        //     console.log('value', value);
        //     console.log('image', value.data);
        //     this.message = value.data;
        //     this.type = 'document';
        //     this._helper.dismissLoader();
        //   }, (err) => {
        //     console.log('error', err);
        //     this._helper.dismissLoader();
        //   });
        this.upload(this.imageURI)
      }
    }, (err) => {
      // Handle error
    });
  }

  /**
   * Method call 
   */
  uploadWarrantyDoc() {
    this.chooser.open({ mime: 'application/pdf' }).then(uri => {
      this.filePath.resolveNativePath(uri).then(filePath => {

        this.upload(filePath);
      })
        .catch(() => {
          console.log('Error reading path');
        });
    }).catch(e => {
      console.log(e);
    });
  }

  upload(url: any) {
    const fileTransfer: FileTransferObject = this.transfer.create();
    console.log('fileTransfer', fileTransfer);
    let options1: FileUploadOptions = {
      fileKey: 'message',
      chunkedMode: false,
      mimeType: "", // add mimeType
      headers: {},
      params: { "message": url },
      httpMethod: 'POST'
    }
    fileTransfer.upload(url, 'http://45.113.122.201/mayurpaints/public/api/chat/document', options1)
      .then((data) => {
        console.log('data2', data);
        let value = JSON.parse(data.response);
        this.message = value.data;
        this.type = 'document';
        this._helper.dismissLoader();
      }, (err) => {
        console.log('error', err);
        this._helper.dismissLoader();
      });
  }

  createMessage() {
    let extension = this.message.split(".")
    let data = {
      "channel_id": this.channleId,
      "sender_id": this.userId,
      "message": this.message,
      "file_extension": this.type == 'document' ? `.${extension[1]}` : '',
      "flag": this.type == '' ? 'text' : this.type
    }
    this._api.sendMessage(data).subscribe(res => {
      if (res.error == false) {
        this.message = '';
        this.type = '';
        this.ScrollToBottom();
        this.getMessage()
      }
    })
  }


  /**
   * Method call to download image or doc or file after clicking 
   **/
  download(pdfUrl: any) {
    console.log(pdfUrl);

    let pdfPath = this.baseImageUrl + pdfUrl;
    const filename = pdfUrl.split("/");
    console.log(filename[filename.length - 1]);

    const fileTransfer: FileTransferObject = this.transfer.create();
    console.log('file', this.file);

    fileTransfer.download(pdfPath, this.file.externalRootDirectory +
      '/Download/' + filename[filename.length - 1]).then(response => {
        console.log(response);
        this._helper.dismissLoader();
        this._helper.alertToast('File has been downloaded to the Downloads folder. View it..')
      })
      .catch(err => {
        this._helper.dismissLoader();
        this._helper.alertToast('Something went wrong. please try again.')
        console.log(err)
      });
  }

  /**
   * Method call to refresh page
   **/
  // handleRefresh(event: any) {
  //   setTimeout(() => {
  //     // Any calls to load data go here
  //     this.getMessage();
  //     event.target.complete();
  //   }, 2000);
  // };

  // Method call to scroll down page


  // scrollToBottomOnInit() {
  //   // setTimeout(() => {
  //   // if (this.content.scrollToBottom) {
  //   this.myContent.scrollToBottom(500);

  //   // }, 500);
  // }

  ScrollToBottom() {
    setTimeout(() => {
      this.myContent.scrollToBottom(300);
    }, 1000);
  }

  // Method call to off set time out after page leave
  ionViewDidLeave() {
    clearTimeout(this.callData)
  }
}