import { Injectable, EventEmitter } from '@angular/core';
import { ModalImageCropperStateService } from '../../services/modal/modal-image-cropper/services/modal-image-cropper-state.service';
import { ImageCroper } from '../../services/modal/modal-image-cropper/class/image-croper';
 
 

@Injectable({
  providedIn: 'root'
})
export class ImageCropperStateService {
  onConfirm: EventEmitter<any> = new EventEmitter();
  action:string = null;
  constructor(private modalImageCropperStateService:ModalImageCropperStateService) { }
  public setConfirm(data) {
    this.onConfirm.emit(data);
  }
  public getConfirm () {
    return this.onConfirm;
  }
  public getAction() {
    return this.action;
  }
  public setAction(data) {
    this.action =data;
  }
  public uploadFileOnBrower(event) {
     
    if (event.target.value) {
      const file = event.target.files[0];
      this.uploadFile(file).then((data: any) => {
        let res = JSON.parse(data.response);
          this.modalImageCropperStateService.onInitOpen(new ImageCroper(res.base64,res.id));
      });
    }  
  }
  uploadFile(file) {
    return new Promise((resolve, reject) => {
      var fd = new FormData();
      fd.append("file", file);
      var xhr = new XMLHttpRequest();
      xhr.addEventListener("load", (event) => {
        resolve(xhr);
      }, false);
      xhr.addEventListener("error", (error) => {
        reject(error);
      }, false);
      xhr.open("POST", "/file?isAvatar=true&ratio=1");
      xhr.send(fd);
    });
  }
}
