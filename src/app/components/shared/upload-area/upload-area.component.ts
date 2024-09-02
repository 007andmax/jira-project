import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter, ElementRef, Input } from '@angular/core';
import { CompaniesService } from 'src/app/services/company/companies.service';

@Component({
  selector: 'app-upload-area',
  templateUrl: './upload-area.component.html',
  styleUrls: ['./upload-area.component.scss']
})
export class UploadAreaComponent implements OnInit {
  @Input() uploadType = 'MULTIPLE';
  isDragover: boolean = false;
  files: any[] = [];
  idfiles: Array<String> = [];
  @Output() onRemoveFile = new EventEmitter<any>();
  @Output() changeFiles = new EventEmitter<any>();
  constructor(public cd: ChangeDetectorRef,
    private companiesService: CompaniesService,
    public elRef: ElementRef,) { }

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
    this.isDragover = false;
    this.prepareFilesList($event);
    this.cd.detectChanges();
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }
  isImage(file) {
    return file.type === "image/jpg" || file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/gif";
  }
  isOdt(name) {
    return name.includes("odt");
  }
  isOds(name) {
    return name.includes("ods");
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {
    if (index === this.files.length) {
      this.files[index - 1].isUploading = false;
      (<any>document.getElementById('fileDropRef')).value = null;
      return;
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        this.files[index].src = reader.result;
      };
      reader.readAsDataURL(this.files[index]);
      if (this.files[index].size > 4194304) {
        this.files[index].showError = true;
        this.files[index].error = "The size is too big. You can upload a file up to 4MB in size."
        this.uploadFilesSimulator(index + 1);
        return;
      }
      this.elRef.nativeElement.querySelector('.qt-fileupload').classList.add('fileupload');
      this.files[index].isUploading = true;
      this.uploadFile(this.files[index]).then((data: any) => {
        let res = JSON.parse(data.response);
        this.idfiles.push(res.id);
        this.files[index].id = res.id;
        this.elRef.nativeElement.querySelector('.qt-fileupload').classList.remove('fileupload');
        this.changeFiles.emit(this.files.map((item, i) => ({ id: item.id, name: item.name.substring(0, item.name.lastIndexOf('.')) })));
        this.uploadFilesSimulator(index + 1);
        this.cd.detectChanges();
        this.files[index].isUploading = false;
      }, err => {
        this.elRef.nativeElement.querySelector('.qt-fileupload').classList.remove('fileupload');
        this.files[index].showError = true;
        this.files[index].error = err.message;
        this.uploadFilesSimulator(index + 1);
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
        if (xhr.status == 200) resolve(xhr);
        if (xhr.status != 200) reject(JSON.parse(xhr.response));
      }, false);

      xhr.upload.onprogress = (event) => {
        file.progress = Math.round((event.loaded / event.total) * 100);
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
      item.isUploading = false;
      item.id = null;
      this.files.push(item);
    }
    this.uploadFilesSimulator((this.idfiles.length == 0) ? 0 : this.idfiles.length);
  }
  removeFile(id) {
    this.companiesService.removeAttachment(id).subscribe(data => {
    })
    let filesIndex = this.files.findIndex(item => item.id == id);
    if (filesIndex > -1) this.files.splice(filesIndex, 1)
    let idfilesIndex = this.idfiles.findIndex(item => item == id);
    if (idfilesIndex > -1) this.idfiles.splice(idfilesIndex, 1)
    this.changeFiles.emit(this.files.map((item, i) => ({ id: item.id, name: item.name.substring(0, item.name.lastIndexOf('.')) })));
  }
  retryFile(index) {
    this.files.splice(index, 1)
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
