import { Injectable, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperComponent } from '../../components/shared/image-cropper/image-cropper.component';
 

@Injectable({
  providedIn: 'root'
})
export class ImageCropperStateService {
  onConfirm: EventEmitter<any> = new EventEmitter();
  action:string = null;
  constructor(private modalService: NgbModal) { }
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
        // this.changeFile(file).then((base64: string): any => {
       /* const modalRef = this.modalService.open(ImageCropperComponent);
        modalRef.componentInstance.imageBase64 = res.base64;
        modalRef.componentInstance.id = res.id;
        event.target.value = null;*/

        // });

      });

    } else alert('Nothing')
  }
  uploadFile(file) {
    return new Promise((resolve, reject) => {
      //  var file = this.dataURLtoFile(this.img, this.fileName);
       
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
