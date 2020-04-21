import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-upload-area',
  templateUrl: './upload-area.component.html',
  styleUrls: ['./upload-area.component.scss']
})
export class UploadAreaComponent implements OnInit {

  files: any[] = [];
  idfiles: Array<String> = [];
  @Output() changeFiles = new EventEmitter<any>();
  constructor(public cd: ChangeDetectorRef, ) { }

  ngOnInit() {

  }
  /**
   * on file drop handler
   */
  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    this.files.splice(index, 1);
    this.idfiles.splice(index, 1);
    this.changeFiles.emit(this.idfiles);
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {
   
      if (index === this.files.length) {
        return;
      } else {
        this.uploadFile(this.files[index]).then((data: any) => {
          let res = JSON.parse(data.response);
          // this.changeFile(file).then((base64: string): any => {
          console.log("res", res);
          this.idfiles.push(res.id);
          this.changeFiles.emit(this.idfiles);
          //  this.modalImageCropperStateService.onInitOpen(new ImageCroper(res.base64,res.id));

          //   const modalRef = this.modalService.open(ImageCropperComponent);
          //   modalRef.componentInstance.imageBase64 = res.base64;
          //   modalRef.componentInstance.id = res.id;
          this.uploadFilesSimulator(index + 1);
          this.cd.detectChanges();
          // });

        });

      }
   
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


      xhr.open("POST", "/file?isAvatar=false");
      xhr.send(fd);
    });
  }
  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    this.uploadFilesSimulator(0);
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

}
