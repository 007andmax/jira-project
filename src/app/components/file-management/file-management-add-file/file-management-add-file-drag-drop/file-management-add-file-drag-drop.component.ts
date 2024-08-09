import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UploadAreaComponent } from 'src/app/components/shared/upload-area/upload-area.component';

@Component({
  selector: 'app-file-management-add-file-drag-drop',
  templateUrl: './file-management-add-file-drag-drop.component.html',
  styleUrls: ['./file-management-add-file-drag-drop.component.scss']
})
export class FileManagementAddFileDragDropComponent extends UploadAreaComponent {
  isUploading: boolean = false;
  @Output() isUploadingFile = new EventEmitter<any>();
  @Output() onRemoveFile = new EventEmitter<any>();
  onFileDropped($event) {
    if (this.idfiles.length > 0) this.onRemoveFile.emit(this.idfiles[0]);
    this.files = [];
    this.idfiles = [];
    this.prepareFilesList($event);
    this.cd.detectChanges();
  }

  prepareFilesList(files: Array<any>) {
    console.log("files", files.length);
    files[files.length - 1].progress = 0;
    this.files = [files[files.length - 1]]
    console.log("this.files", this.files);
    this.uploadFilesSimulator(0);
  }
  uploadFilesSimulator(index: number) {
    if (index === this.files.length) {
      (<any>this.elRef.nativeElement.querySelector('#fileDropRef')).value = '';
      return;
    } else {
      if (this.files[index].size > 4194304) {
        this.files[index].showError = true;
        this.files[index].error = "The size is too big. You can upload a file up to 4MB in size."
        this.uploadFilesSimulator(index + 1);
        return;
      }
      this.elRef.nativeElement.querySelector('.qt-fileupload').classList.add('fileupload');
      this.isUploadingFile.emit(true);
      this.isUploading = true;
      console.log("this.files[index]", this.files[index]);
      this.files[index].src = URL.createObjectURL(this.files[index]);
      this.uploadFile(this.files[index]).then((data: any) => {
        let res = JSON.parse(data.response);
        this.idfiles.push(res.id);
        this.elRef.nativeElement.querySelector('.qt-fileupload').classList.remove('fileupload');
        this.changeFiles.emit(this.idfiles);
        this.uploadFilesSimulator(index + 1);
        this.cd.detectChanges();
        this.isUploadingFile.emit(false);
        this.isUploading = false;
      }).catch(() => {
        this.elRef.nativeElement.querySelector('.qt-fileupload').classList.remove('fileupload');
        this.files[index].showError = true;
        this.uploadFilesSimulator(index + 1);
        this.isUploadingFile.emit(false);
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

      xhr.upload.onprogress = (event) => {
        file.progress = Math.round((event.loaded / event.total) * 100);
      }
      xhr.addEventListener("error", (error) => {
        reject(error);
      }, false);
      xhr.open("POST", "/file?isAvatar=false&attachmentType=FILE_MANAGEMENT");
      xhr.send(fd);
    });
  }
}
