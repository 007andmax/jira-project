import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FileManagementAddFile } from './class/file-management-add-file';
import { FileManagementService } from 'src/app/services/file-management/file-management.service';
import { FileManagementStateService } from 'src/app/states/file-management/file-management-state.service';

@Component({
  selector: 'app-file-management-add-file',
  templateUrl: './file-management-add-file.component.html',
  styleUrls: ['./file-management-add-file.component.scss']
})
export class FileManagementAddFileComponent implements OnInit {
  file: FileManagementAddFile = new FileManagementAddFile();
  files: any[] = [];
  opened: boolean = false;
  constructor(public cd: ChangeDetectorRef,
    private fileManagementService: FileManagementService,
    private fileManagementStateService: FileManagementStateService
  ) { }

  ngOnInit() {
    this.fileManagementStateService.onShowAsideForAdd.subscribe(() => {
      this.file = new FileManagementAddFile();
      this.opened = true;
    })
  }
  public fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }
  close() {
    this.opened = false;
    this.file = new FileManagementAddFile();
    this.files = [];
  }
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    this.uploadFilesSimulator(0);
  }
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
        this.file.setMediaFileId(res.id);
        // this.ticketProfileFormUpdate.addFile(res.id);
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
  onSend() {
    this.fileManagementService.addFile(this.file).subscribe(data => {
      this.close();
    })
  }
}
