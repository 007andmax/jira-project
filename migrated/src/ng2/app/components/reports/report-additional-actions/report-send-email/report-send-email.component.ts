import { Component, OnInit, ElementRef, ChangeDetectorRef, Input, OnDestroy } from '@angular/core';
import { DraftEmail } from '../../../shared/draft-email/class/draft-email';
import { FilesInfo } from '../../../shared/draft-email/class/files-Info';
import { User } from '../../../users/class/user';
import { Company } from 'src/ng2/app/interfaces/company/company';
import { DraftEmailStateService } from 'src/ng2/app/states/draft-email/draft-email-state.service';
import { DraftEmailService } from 'src/ng2/app/services/draft-email/draft-email.service';
import { FilesInfoItem } from '../../../shared/draft-email/class/files-Info-item';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportsService } from 'src/ng2/app/services/reports/reports.service';
import { ReportEmail } from '../../class/report-email';
import { ReportsStateService } from 'src/ng2/app/states/reports/reports-state.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-report-send-email',
  templateUrl: './report-send-email.component.html',
  styleUrls: ['./report-send-email.component.scss']
})
export class ReportSendEmailComponent implements OnInit {

  messageContent: string = '';
  messageHTML: string = '';

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: false,
    height: '10rem',
    minHeight: '5rem',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'no',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Write your draft for companies',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    toolbarPosition: 'bottom',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    sanitize: true,
  };
  action: string = null;
  tab: string = 'plain';
  draftEmail: ReportEmail = new ReportEmail();
  uploadFiles: Array<File> = [];
  filesInfo: FilesInfo = new FilesInfo();
  usersSelected: Array<User> = [];
  companiesSelected: Array<Company> = [];
  @Input() report:string = "";
  @Input() fileName:string = "";
  @Input() template: string = "PDF_TEMPLATE";
  @Input() orientation;
  @Input() selectedClient;
  @Input() accountType = 'CLIENT';
  
  constructor(private draftEmailStateService: DraftEmailStateService, private elRef: ElementRef,
    private draftEmailService: DraftEmailService, public cd: ChangeDetectorRef,
    public activeModal: NgbActiveModal,
    private reportsService: ReportsService,
    private reportsStateService: ReportsStateService
  ) { }

  ngOnInit() {
    this.usersSelected = this.draftEmailStateService.getSelectedUsers();
    this.companiesSelected = this.draftEmailStateService.getSelectedCompanies();
    this.action = this.draftEmailStateService.getAction();
    this.draftEmail = new ReportEmail();
  }



  close() {
    this.draftEmail = new ReportEmail();
    this.tab = 'plain';
    this.messageContent = '';
    this.messageHTML = '';
    this.draftEmailStateService.onClear();
    this.uploadFiles = [];
    this.filesInfo = new FilesInfo();
    this.action = null;
    this.activeModal.dismiss('Cross click');
  }

  onChangeCompanyEmails(data) {
    this.draftEmail.setEmails(data);
  }

  public uploadFileOnBrower(event) {

    if (event.target.value) {
      const file = event.target.files[0];

      this.uploadFiles.push(file);
      this.filesInfo.files.push(new FilesInfoItem());
      let indexUploadFile = this.uploadFiles.length - 1;
      let indexFileInfo = this.filesInfo.files.length - 1;
      this.uploadFile(this.uploadFiles[indexUploadFile], this.filesInfo.files[indexFileInfo]).then((data: any) => {
        let res = JSON.parse(data.response);
        this.filesInfo.files[indexFileInfo].setFileId(res.id);
        event.target.value = null;
        this.setDisableUplaodFile(false);

      }).catch(err => {
        this.setDisableUplaodFile(false);
        if (err.code === 400 || err.code === 500) {
          let message = err.code === 500 ? 'Maximum upload size of 4 MB' : err.message;
          this.filesInfo.files[indexFileInfo].setError(true, message, err.code);
          this.filesInfo.quantityErrorFiles++;
        }
      })

    }
  }
  reloadAttachment(fileInfo, file) {
    if (fileInfo.error) return;
    this.setDisableUplaodFile(true);
    this.uploadFile(file, fileInfo).then((data: any) => {
      let res = JSON.parse(data.response);
      fileInfo.setFileId(res.id);
      this.setDisableUplaodFile(false);
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

    this.draftEmail.setContent(this.reportsStateService.parseReportContent(this.report));
    this.draftEmail.setNote(this.messageContent);
    this.draftEmail.setOrientation(this.orientation);
    this.draftEmail.setFileName(this.fileName);
    if (this.template === "PDF_TEMPLATE") {
      this.reportsService.sendMessage(this.draftEmail).subscribe((data) => {
        this.close();
        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }
      })
    } else {
      this.reportsService.sendCustomerMessage(this.draftEmail).subscribe((data) => {
        this.close();
        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }
      })
    }
   
  }

  removeAttachment(index) {

    this.uploadFiles.splice(index);
    this.filesInfo.files.splice(index);
  };
  setDisableUplaodFile(value) {
    this.elRef.nativeElement.querySelector('#upload-file-email').disabled = value;
  }
  uploadFile(file, fileInfo) {
    return new Promise((resolve, reject) => {
      this.setDisableUplaodFile(true);
      if (file.size > 4194304) {
        reject({ code: 500 });
        return;
      }
      var fd = new FormData();
      fd.append("file", file);
      var xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", (progress) => {
        fileInfo.progress = 100 * (progress.loaded / progress.total);
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



