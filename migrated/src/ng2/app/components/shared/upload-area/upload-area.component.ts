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
  error: string = "- The uploaded file cannot be more than 4 MB.";
  constructor(public cd: ChangeDetectorRef, ) { }

  ngOnInit() {

  }

  onClearState() {
    this.files = [];
    this.idfiles = [];
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
        if (this.files[index].size > 4000000) {
          this.files[index].showError = true;
          this.uploadFilesSimulator(index + 1);
          return;
         } 
        this.uploadFile(this.files[index]).then((data: any) => {
          let res = JSON.parse(data.response);
            this.idfiles.push(res.id);
          this.changeFiles.emit(this.idfiles);
          this.uploadFilesSimulator(index + 1);
          this.cd.detectChanges();
        }).catch(() => {
          this.files[index].showError = true;
          this.uploadFilesSimulator(index + 1);
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

      xhr.upload.onprogress = (event)=> {
        file.progress = Math.round((event.loaded /  event.total) * 100);
      }
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
