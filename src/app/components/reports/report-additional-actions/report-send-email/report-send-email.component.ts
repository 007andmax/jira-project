import { Component, OnInit, ElementRef, ChangeDetectorRef, Input, OnDestroy } from '@angular/core';
import { DraftEmail } from '../../../shared/draft-email/class/draft-email';
import { FilesInfo } from '../../../shared/draft-email/class/files-Info';
import { User } from '../../../users/class/user';
import { Company } from 'src/app/interfaces/company/company';
import { DraftEmailStateService } from 'src/app/states/draft-email/draft-email-state.service';
import { DraftEmailService } from 'src/app/services/draft-email/draft-email.service';
import { FilesInfoItem } from '../../../shared/draft-email/class/files-Info-item';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { ReportEmail } from '../../class/report-email';
import { ReportsStateService } from 'src/app/states/reports/reports-state.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { forkJoin } from 'rxjs';

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
  usersSelected: Array<User> = [];
  companiesSelected: Array<Company> = [];
  @Input() report: string = "";
  @Input() fileName: string = "";
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
    this.action = null;
    this.activeModal.dismiss('Cross click');
  }

  onChangeCompanyEmails(data) {
    this.draftEmail.setEmails(data);
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

  trackByIndex(index, item) {
    return index;
  }

}



