import { Component, EventEmitter, Output } from '@angular/core';
import { UploadAreaComponent } from 'src/app/components/shared/upload-area/upload-area.component';

@Component({
  selector: 'app-file-manager-add-file-drag-drop',
  templateUrl: './file-manager-add-file-drag-drop.component.html',
  styleUrls: ['./file-manager-add-file-drag-drop.component.scss']
})
export class FileManagementAddFileDragDropComponent extends UploadAreaComponent {
  isUploading: boolean = false;
  isError: boolean = false;
  isDragover: boolean = false;
  @Output() isUploadingFile = new EventEmitter<any>();
  @Output() onRemoveFile = new EventEmitter<any>();
  onFileDropped($event) {
    this.prepareFilesList($event);
    this.cd.detectChanges();
  }

  prepareFilesList(files: Array<any>) {
    if (this.idfiles.length > 0) this.onRemoveFile.emit(this.idfiles[0]);
    this.files = [];
    this.idfiles = [];
    files[files.length - 1].progress = 0;
    this.files = [files[files.length - 1]]
    this.uploadFilesSimulator(0);
  }
  removeFile() {
    this.onRemoveFile.emit(this.idfiles[0]);
    this.files = [];
    this.idfiles = [];
  }
  retryFile() {
    this.files = [];
    this.idfiles = [];
    this.isError = false;
  }
  uploadFilesSimulator(index: number) {
    if (index === this.files.length) {
      (<any>this.elRef.nativeElement.querySelector('#fileDropRef')).value = '';
      return;
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        this.files[index].src = reader.result;
      };
      reader.readAsDataURL(this.files[index]);
      if (this.files[index].size > 4194304) {
        this.isError = true;
        this.files[index].showError = true;
        this.files[index].error = "The size is too big. You can upload a file up to 4MB in size."
        this.uploadFilesSimulator(index + 1);
        return;
      }
      console.log("this.files[index]", this.files[index]);
      this.elRef.nativeElement.querySelector('.qt-fileupload').classList.add('fileupload');
      this.isUploadingFile.emit(true);
      this.isUploading = true;
      this.uploadFile(this.files[index]).then((data: any) => {
        let res = JSON.parse(data.response);
        this.idfiles.push(res.id);
        this.elRef.nativeElement.querySelector('.qt-fileupload').classList.remove('fileupload');
        this.changeFiles.emit({ id: res.id, name: this.files[index].name.substring(0, this.files[index].name.lastIndexOf('.')) });
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
  parseType(type) {
    return type.substring(type.lastIndexOf("/") + 1, type.length).toUpperCase();
  }
  parseSize(size) {
    if (size < 1024) return `${size} B`;
    if (size > 1024) return `${(size / 1024).toFixed(2)} KB`;
    if (size > 1024 * 1024) return `${(size / 1024 / 1024).toFixed(2)} MB`;
    return '';
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
