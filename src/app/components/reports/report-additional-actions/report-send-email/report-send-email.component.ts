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
import { DraftEmailComponent } from 'src/app/components/shared/draft-email/draft-email.component';

@Component({
  selector: 'app-report-send-email',
  templateUrl: './report-send-email.component.html',
  styleUrls: ['./report-send-email.component.scss']
})
export class ReportSendEmailComponent extends DraftEmailComponent {







  draftReport: ReportEmail = new ReportEmail();


  @Input() report: string = "";
  @Input() fileName: string = "";
  @Input() template: string = "PDF_TEMPLATE";
  @Input() orientation;
  @Input() selectedClient;
  @Input() accountType = 'CLIENT';

  /* constructor(private draftEmailStateService: DraftEmailStateService, private elRef: ElementRef,
     private draftEmailService: DraftEmailService, public cd: ChangeDetectorRef,
     public activeModal: NgbActiveModal,
     private reportsService: ReportsService,
     private reportsStateService: ReportsStateService
   ) { }*/

  ngOnInit() {
    this.draftEmailStateService.showAsideSendReport.subscribe((data) => {
      this.usersSelected = this.draftEmailStateService.getSelectedUsers();
      this.companiesSelected = this.draftEmailStateService.getSelectedCompanies();
      this.action = this.draftEmailStateService.getAction();

      this.selectedClient = data.selectedClient;
      this.orientation = data.orientation;
      this.report = data.report;
      this.template = data.template;
      this.fileName = data.fileName;
      this.accountType = data.accountType;


      this.opened = true;
      this.draftReport = new ReportEmail();
    })
  }





  onChangeCompanyEmails(data) {
    this.draftReport.setEmails(data);
  }

  onSend() {
    this.addBtn.setDisabled(true);
    this.draftReport.setContent(this.reportsStateService.parseReportContent(this.report));
    this.draftReport.setNote(this.messageContent);
    this.draftReport.setOrientation(this.orientation);
    this.draftReport.setFileName(this.fileName);
    if (this.template === "PDF_TEMPLATE") {
      this.reportsService.sendMessage(this.draftReport).subscribe((data) => {
        this.addBtn.setDisabled(false);
        this.close();
        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }
      }, err => {
        this.addBtn.setDisabled(false);
      })
    } else {
      this.reportsService.sendCustomerMessage(this.draftReport).subscribe((data) => {
        this.addBtn.setDisabled(false);
        this.close();
        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }
      }, err => {
        this.addBtn.setDisabled(false);
      })
    }

  }

  trackByIndex(index, item) {
    return index;
  }

}



