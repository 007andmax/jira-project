import { DropDownComponent } from './';
import { MatErrorComponent } from './';
import { PreloaderTicketComponent } from './';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FORMAT_DATE_2 } from 'src/app/const/date-picker';
import { News } from '../super-admin-knowledge-base-table/class/news';
import { CompanySetting } from 'src/app/components/companies/class/company-setting';
import { SuperAdminKnowledgeBaseService } from '../../services/super-admin-knowledge-base/super-admin-knowledge-base.service';
import { KnowledgeBaseValidate } from './class/knowledge-base-validate';
import { environment } from 'src/environments/environment';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { KnowledgeBaseStateService } from '../../state/knowledge-base/knowledge-base-state.service';
import { DocumentsService } from 'src/app/services/documents/documents.service';
import { forkJoin, Subscription } from 'rxjs';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';

@Component({
  standalone: true,
  imports: [DropDownComponent, MatErrorComponent, PreloaderTicketComponent, FormsModule, CommonModule],
  selector: 'app-super-admin-knowledge-base-add',
  templateUrl: './super-admin-knowledge-base-add.component.html',
  styleUrls: ['./super-admin-knowledge-base-add.component.scss']
})
export class SuperAdminKnowledgeBaseAddComponent implements OnInit, OnDestroy {
  @ViewChild('addBtn', { static: true }) addBtn: DisabledBtnDirective;
  @Output() onClose = new EventEmitter();
  private apiUrl = environment.apiUrl;
  news: News = new News();
  public options: Object;
  attachments = [];
  validate: KnowledgeBaseValidate = new KnowledgeBaseValidate();
  selectedStatus: CompanySetting = new CompanySetting('Draft', 'DRAFT')
  list = [];
  formatDate: string = FORMAT_DATE_2;
  startDate = new Date().getTime();
  currentUser: any;
  froalaEditor: any;
  sub: Subscription = new Subscription();
  constructor(public superAdminKnowledgeBaseService: SuperAdminKnowledgeBaseService,
    public usersStateService: UsersStateService,
    public cd: ChangeDetectorRef,
    public documentsService: DocumentsService,
    public knowledgeBaseStateService: KnowledgeBaseStateService
  ) { }

  ngOnInit() {
    this.list = this.knowledgeBaseStateService.getStatusList();
    this.currentUser = this.usersStateService.getCurrentUser();
    this.onInitFloara();
  }
  ngAfterViewInit() {

    this.cd.detectChanges();
  }
  ngDoCheck() {

    if (this.news.content.length > 0) this.validate.resetContent();
  }
  onInitFloara() {
    const self = this;
    this.options = {
      key: "lSA3D-17E4B3A1C2D1H2rXYb1VPUGRHYZNRJd1JVOOb1HAc1zG2B1A2A2D6B1A1C4G1I4==",
      toolbarButtons: [
        'bold', 'italic', 'underline', '|',
        'alignLeft', 'alignCenter', 'alignRight', '|',
        'formatOL', 'formatUL', '|',
        'insertFile', '|',
        'insertLink', 'insertImage'],
      placeholderText: 'description',
      toolbarBottom: true,
      attribution: false,
      heightMin: 180,
      toolbarSticky: false,
      saveParam: 'file',
      saveMethod: 'POST',
      saveParams: { id: 'my_editor' },
      imageUploadParam: 'file',
      imageUploadURL: self.apiUrl + 'file?isAvatar=false&documentFile=true&attachmentType=ANNOUNCEMENT_DOCUMENT',
      imageUploadParams: { id: 'my_editor' },
      imageUploadMethod: 'POST',
      imageMaxSize: 4 * 1024 * 1024,
      imageAllowedTypes: ['jpeg', 'jpg', 'png'],
      filesManagerUploadURL: self.apiUrl + 'file?isAvatar=false&documentFile=true&attachmentType=ANNOUNCEMENT_DOCUMENT',
      filesManagerUploadParams: {
        id: 'my_editor'
      },
      filesManagerMaxSize: 1024 * 1024 * 4,
      fileUpload: true,
      fileUploadURL: self.apiUrl + 'file?isAvatar=false&documentFile=true&attachmentType=ANNOUNCEMENT_DOCUMENT',
      fileUploadParams: {
        id: 'my_editor'
      },
      fileUploadMethod: 'POST',
      fileMaxSize: 1024 * 1024 * 4,
      fileAllowedTypes: ['*'],
      events: {
        "initialized": function (data) {
          let config = {
            "docId": "e1626875-8d25-4f98-abd8-abfdd7010d81",
            "user": { "name": `${self.usersStateService.getCurrentUser().firstName} ${self.usersStateService.getCurrentUser().lastName}` },
            "editor": this,
            "apiKey": "58e429b0-be4a-4cd8-8c8d-9a37fb0adec0",
            "app": "froala",
            "showPointer": true,
            "cursorAlwaysOn": true,
            "pointers": {
              "shape": "arrow"
            }
          };
        },
        'image.uploaded': function ($img) {
          // Do something here.
          // this is the editor instance.
          var file = JSON.parse($img);
          self.attachments.push(file.link);
          // self.onChangeAttachments.emit(self.attachments);
          return file;
        },

        'file.uploaded': function (response) {
          var file = JSON.parse(response);
          self.attachments.push(file.link);
          // self.onChangeAttachments.emit(self.attachments);
          // File was uploaded to the server.
        },
        'file.inserted': function ($file, response) {
          $file[0].href = `${$file[0]}/attachment`;
          // File was inserted in the editor.
        },
        'filesManager.uploaded': function (response) {
          // Do something here.
          // this is the editor instance.
          var file = JSON.parse(response);
          self.attachments.push(file.link);
          //   self.onChangeAttachments.emit(self.attachments);
        }
      }
    };
  }
  initialize(initControls) {
    this.froalaEditor = initControls;
    this.froalaEditor.initialize();
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.froalaEditor.destroy();
  }
  onChangeTitle() {
    this.validate.resetTitle();
  }
  onChangeContent() {
    this.validate.resetContent();
  }
  onSelectStatus(data) {
    this.selectedStatus = data;
    this.news.status = data.value;
  }
  close() {
    this.news = new News();
    this.attachments = [];
    this.validate = new KnowledgeBaseValidate();
    this.onClose.emit(null);
  }
  checkAddAttachments(content) {
    let contentAttachments = [];
    let removedAttachments = [];
    var urlRegex = /(((https?:\/\/)|(http?:\/\/)|(www\.))[^\s]+)/g;
    if (content) content.replace(urlRegex, function (url) {
      contentAttachments.push(url.replace('\"', '').replace('/attachment', ''));
      return url;
    });
    this.attachments.forEach(item => {
      if (!contentAttachments.find(newItem => newItem === item)) removedAttachments.push(item);
    })
    let removedAttachmentsIds = removedAttachments.map(item => item.substring(item.indexOf("file/") + 5, item.length));
    forkJoin(
      [...removedAttachmentsIds.map(item => this.documentsService.removeDocumentAttachment(item))]
    )
      .subscribe(res => {
      });
  }
  add() {
    if (!this.validate.isValidate(this.news)) return;
    this.addBtn.setDisabled(true);
    this.superAdminKnowledgeBaseService.addNews(this.news.getDataForCreate()).subscribe(data => {
      this.knowledgeBaseStateService.addNews(new News(data));
      this.checkAddAttachments(this.news.content);
      this.close();
      this.addBtn.setDisabled(false);
    }, err => {
      this.addBtn.setDisabled(false);
    })
  }
}
