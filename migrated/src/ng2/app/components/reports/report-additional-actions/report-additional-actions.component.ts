import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { ACION_OPEN_PDF, ACION_DOWNLOAD_PDF } from 'src/ng2/app/const/reports';
import { ReportsService } from 'src/ng2/app/services/reports/reports.service';
import { AppService } from 'src/ng2/app/states/app/app.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ModalQuoteComponent } from 'src/ng2/app/services/modal/modal-quote/modal-quote.component';
import { ReportSendEmailComponent } from './report-send-email/report-send-email.component';
import { ReportsStateService } from 'src/ng2/app/states/reports/reports-state.service';

@Component({
  selector: 'app-report-additional-actions',
  templateUrl: './report-additional-actions.component.html',
  styleUrls: ['./report-additional-actions.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class ReportAdditionalActionsComponent implements OnInit {
  ACION_OPEN_PDF = ACION_OPEN_PDF;
  ACION_DOWNLOAD_PDF = ACION_DOWNLOAD_PDF;
  listExport = ['PDF', 'CSV'];
  @Input() selectedClient;
  constructor(private reportsService: ReportsService,
    private reportsStateService: ReportsStateService,
    private appService: AppService,
    config: NgbModalConfig,
    private modalService: NgbModal,) { 
      config.backdrop = 'static';
      config.keyboard = false;
    }

  ngOnInit() {
  }

  sendEmail() {
    console.log("this.selectClient",this.selectedClient);
    const modalRef = this.modalService.open(ReportSendEmailComponent, null);
    modalRef.componentInstance.selectedClient = this.selectedClient;
  }
  getPdfIdFromRest(action) {
    var dto = {
      fileName: 'gl_number',
      content: this.reportsStateService.parseReportContent(),
      id: null,
      orientation: 'PORTRAIT'
    };
    this.reportsService.getPdfUrl(dto).subscribe((data: any) => {
      console.log("data", data);
      if (action === ACION_OPEN_PDF) window.open(data.url);
      if (action === ACION_DOWNLOAD_PDF) this.appService.downloadByUrl(`${data.url}?isDownload=true`, 'gl_number');
    })
  }
  onSelectExport(item) {
    if (item === 'PDF') this.getPdfIdFromRest(ACION_DOWNLOAD_PDF);
  }

}
