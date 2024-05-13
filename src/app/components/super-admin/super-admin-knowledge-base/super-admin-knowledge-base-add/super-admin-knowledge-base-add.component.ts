import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FORMAT_DATE_2 } from 'src/app/const/date-picker';
import { News } from '../super-admin-knowledge-base-table/class/news';
import { CompanySetting } from 'src/app/components/companies/class/company-setting';
import { SuperAdminKnowledgeBaseService } from '../../services/super-admin-knowledge-base/super-admin-knowledge-base.service';
import { KnowledgeBaseValidate } from './class/knowledge-base-validate';

@Component({
  selector: 'app-super-admin-knowledge-base-add',
  templateUrl: './super-admin-knowledge-base-add.component.html',
  styleUrls: ['./super-admin-knowledge-base-add.component.scss']
})
export class SuperAdminKnowledgeBaseAddComponent implements OnInit {
  @Output() onClose = new EventEmitter();
  news: News = new News();
  validate: KnowledgeBaseValidate = new KnowledgeBaseValidate();
  selectedStatus: CompanySetting = new CompanySetting('Draft', 'DRAFT')
  list = [new CompanySetting('Published', 'PUBLISHED'), new CompanySetting('Draft', 'DRAFT'), new CompanySetting('Archived', 'ARCHIVED')];
  messageContent: string = '';
  formatDate: string = FORMAT_DATE_2;
  startDate = new Date().getTime();
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
    placeholder: 'Add description',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    toolbarPosition: 'bottom',
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
  constructor(private superAdminKnowledgeBaseService: SuperAdminKnowledgeBaseService,) { }

  ngOnInit() {
  }
  onChangeTitle() {
    this.validate.resetTitle();
  }
  onChangeContent() {
    this.validate.resetContent();
  }
  onSelectStatus(data) {
    this.selectedStatus = data;
    this.news.announcementType = data.value;
  }
  close() {
    this.onClose.emit(null);
  }
  add() {
    if (!this.validate.isValidate(this.news)) return;
    this.superAdminKnowledgeBaseService.addNews(this.news.getDataForCreate()).subscribe(data => {

    })
  }
}
