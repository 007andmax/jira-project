import { ChangeDetectorRef, Component, ElementRef, Input, OnInit } from '@angular/core';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { TicketProfileFormUpdate } from '../../../ticket-edit-aside/class/ticket-profile-form-update';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
    selector: 'ticket-detail-profile-form-update-note',
    templateUrl: './ticket-detail-profile-form-update-note.component.html',
    styleUrls: ['./ticket-detail-profile-form-update-note.component.scss'],
    standalone: true
})
export class TicketDetailProfileFormUpdateNoteComponent implements OnInit {
  files: any[] = [];
  @Input() ticketProfileFormUpdate: TicketProfileFormUpdate = new TicketProfileFormUpdate();
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: false,
    height: '100%',
    minHeight: '5rem',
    width: 'auto',
    minWidth: '0',
    translate: 'no',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Write ticket conversation here…',
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
    sanitize: false,
  };
  isDragover: boolean = false;
  constructor(public cd: ChangeDetectorRef,
    private companiesService: CompaniesService,
    private elRef: ElementRef) { }

  ngOnInit() {
    //  if (this.ticketProfileFormUpdate.note) this.elRef.nativeElement.querySelector("#chat").innerHTML = this.ticketProfileFormUpdate.note;
  }
  public fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }
  setNote(data) {
    // this.elRef.nativeElement.querySelector("#chat").innerHTML = data;
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
      if (this.files[index].size > 15000000) {
        this.files[index].showError = true;
        this.files[index].error = "The size is too big. You can upload a file up to 15MB in size."
        this.uploadFilesSimulator(index + 1);
        return;
      }
      this.uploadFile(this.files[index]).then((data: any) => {
        let res = JSON.parse(data.response);
        this.ticketProfileFormUpdate.addFile(res.id);
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
      xhr.open("POST", "/file?isAvatar=false");
      xhr.send(fd);
    });
  }
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
  public onChangeChat(event) {
    let value = "";
    if (event.target.innerHTML.length >= 50000) {
      event.preventDefault();
      event.target.innerHTML = event.target.innerHTML.substring(0, 50000);
      value = event.target.innerHTML;
      var range = window.getSelection(); // 创建range
      range.selectAllChildren(event.target); // Range 选择obj下所有子内容
      range.collapseToEnd();
    } else {
      value = event.target.innerHTML;
    }
    this.ticketProfileFormUpdate.setChatMessage(value.replace(/\n/g, '<br/>'));
  }
  onKeyPress(event) {
    if (event.target.innerHTML.length >= 50000) {
      event.preventDefault();
      return false;
    }
    return true;
  }
  deleteFile(index: number) {
    this.companiesService.removeAttachment(this.ticketProfileFormUpdate.attachFileIds[index]).subscribe(data => {

    })
    this.files.splice(index, 1);
    this.ticketProfileFormUpdate.removeFile(index);
  }
}
