import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DraftEmailStateService } from 'src/ng2/app/states/draft-email/draft-email-state.service';
import { DraftEmail } from './class/draft-email';
import { FilesInfo } from './class/files-Info';
import { FilesInfoItem } from './class/files-Info-item';

import { DraftEmailService } from 'src/ng2/app/services/draft-email/draft-email.service';

@Component({
  selector: 'app-draft-email',
  templateUrl: './draft-email.component.html',
  styleUrls: ['./draft-email.component.scss']
})
export class DraftEmailComponent implements OnInit {
  messageContent: string = '';
  messageHTML: string = '';
  opened = false;
  editorConfig = {
    editable: true,
    spellcheck: false,
    height: '10rem',
    minHeight: '5rem',
    placeholder: 'Click here to respond to the Ticket',
    translate: 'no'
  };
  tab: string = 'plain';
  draftEmail: DraftEmail = new DraftEmail();
  uploadFiles: Array<File> = [];
  filesInfo: FilesInfo = new FilesInfo();


  constructor(private draftEmailStateService: DraftEmailStateService, private elRef: ElementRef,
    private draftEmailService: DraftEmailService) { }

  ngOnInit() {
    this.onShowAside();

  }

  public onShowAside() {
    this.draftEmailStateService.getShowAsideForAdd().subscribe(() => {
      this.opened = true;
      this.draftEmail = new DraftEmail();
    })
  }

  close() {
    this.opened = false;
    this.draftEmail = new DraftEmail();
    this.tab = 'plain';
    this.messageContent = '';
    this.messageHTML = '';
    this.draftEmailStateService.onClear();
    this.uploadFiles = [];
    this.filesInfo = new FilesInfo();

  }

  onChangeCompanyEmails(data) {
    this.draftEmail.setRecipients(data);
  }

  public uploadFileOnBrower(event) {
    console.log('event', event);
    if (event.target.value) {
      const file = event.target.files[0];
      console.log('file', file);
      this.uploadFiles.push(file);
      this.filesInfo.files.push(new FilesInfoItem());
      let indexUploadFile = this.uploadFiles.length - 1;
      let indexFileInfo = this.filesInfo.files.length - 1;
      this.uploadFile(this.uploadFiles[indexUploadFile], this.filesInfo.files[indexFileInfo]).then((data: any) => {

        let res = JSON.parse(data.response);
        // this.changeFile(file).then((base64: string): any => {
        //  this.draftEmail.addAttachment(res.id);
        this.filesInfo.files[indexFileInfo].setFileId(res.id);
        event.target.value = null;
        this.setDisableUplaodFile(false);
        console.log('this.filesInfo.files[indexFileInfo]', this.filesInfo.files[indexFileInfo]);
        // });

      }).catch(err => {
        this.setDisableUplaodFile(false);
        if (err.code === 400 || err.code === 500) {
          let message = err.code === 500 ? 'Maximum upload size of 4 MB' : err.message;
          this.filesInfo.files[indexFileInfo].setError(true, message, err.code);
          this.filesInfo.quantityErrorFiles++;
        }
      })

    } else alert('Nothing')
  }
  reloadAttachment(fileInfo, file) {
    if (fileInfo.error) return;
    this.setDisableUplaodFile(true);
    this.uploadFile(file, fileInfo).then((data: any) => {

      let res = JSON.parse(data.response);
      // this.changeFile(file).then((base64: string): any => {
      //  this.draftEmail.addAttachment(res.id);
      fileInfo.setFileId(res.id);
      //  event.target.value = null;
      this.setDisableUplaodFile(false);
      console.log('this.filesInfo.files[indexFileInfo]', fileInfo);
      // });

    }).catch(err => {
      this.setDisableUplaodFile(false);
      if (err.code === 400 || err.code === 500) {
        let message = err.code === 500 ? 'Maximum upload size of 4 MB' : err.message;
        fileInfo.setError(true, message, err.code);
        this.filesInfo.quantityErrorFiles++;
      }
    })

  }
  onSend() {
    if (this.tab === 'html') {
      this.draftEmail.setCustomHtml(true);
      this.draftEmail.setContent(this.messageHTML.replace(/(\r\n|\n|\r)/gm, ""));
    } else {
      this.draftEmail.setCustomHtml(false);
      this.draftEmail.setContent(this.messageContent);
    }

    this.filesInfo.files.forEach(item => {
      if (!item.error) this.draftEmail.setAttachment(item.id)
    });
    this.draftEmailService.sendMessage(this.draftEmail).subscribe((data) => {
      console.log('daata', data);
      this.close();

    })
  }

  removeAttachment(index) {

    this.uploadFiles.splice(index);
    this.filesInfo.files.splice(index);
  };
  setDisableUplaodFile(value) {
    this.elRef.nativeElement.querySelector('#upload-file').disabled = value;
  }
  uploadFile(file, fileInfo) {
    return new Promise((resolve, reject) => {
      this.setDisableUplaodFile(true);

      if (file.size > 4194304) {
        reject({ code: 500 });
        return;
      }
      console.log(file);
      var fd = new FormData();
      fd.append("file", file);
      var xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", (progress) => {
        console.log('progress', progress);
        fileInfo.progress = 100 * (progress.loaded / progress.total);
        console.log('fileInfo.progress', fileInfo.progress);
      }, false);
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
  styleProgressBar(progress) {
    return {
      width: progress + '%'
    };
  };

  trackByIndex(index, item) {
    return index;
  }
}
