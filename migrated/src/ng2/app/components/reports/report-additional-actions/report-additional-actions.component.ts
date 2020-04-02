import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { ACION_OPEN_PDF, ACION_DOWNLOAD_PDF } from 'src/ng2/app/const/reports';
import { ReportsService } from 'src/ng2/app/services/reports/reports.service';
import { AppService } from 'src/ng2/app/states/app/app.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ModalQuoteComponent } from 'src/ng2/app/services/modal/modal-quote/modal-quote.component';
import { ReportSendEmailComponent } from './report-send-email/report-send-email.component';
import { ReportsStateService } from 'src/ng2/app/states/reports/reports-state.service';
import { GlNumber } from '../class/gl-number';

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
  glNumber: GlNumber = new GlNumber();
  @Input() report: string = "";
  @Input() fileName: string = "";
  @Input() id: string = null;
  @Input() template: string = "PDF_TEMPLATE";
  @Input() selectedClient;
  constructor(private reportsService: ReportsService,
    private reportsStateService: ReportsStateService,
    private appService: AppService,
    config: NgbModalConfig,
    private modalService: NgbModal, ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    if (this.report === "service-report") this.listExport = ['PDF'];
    this.reportsStateService.glNumber.subscribe((data: GlNumber) => {
      this.glNumber = data;

    })
  }

  sendEmail() {
    console.log("this.selectClient", this.selectedClient);
    const modalRef = this.modalService.open(ReportSendEmailComponent, null);
    modalRef.componentInstance.selectedClient = this.selectedClient;
    if (this.report === "byProducts") {
      modalRef.componentInstance.orientation = "LANDSCAPE";
    } else {
      modalRef.componentInstance.orientation = (!this.glNumber.getMonthlyDetailed()) ? 'PORTRAIT' : 'LANDSCAPE';
    }

    modalRef.componentInstance.template = this.template;
    modalRef.componentInstance.fileName = this.fileName;
  }
  getPdfIdFromRest(action) {
    let orientation;
    if (this.report === "byProducts") {
      orientation = "LANDSCAPE";
    } else {
      orientation = (!this.glNumber.getMonthlyDetailed()) ? 'PORTRAIT' : 'LANDSCAPE';
    }
    var dto = {
      fileName: this.fileName,
      content: this.reportsStateService.parseReportContent(),
      id: this.id,
      orientation: orientation
    };
    if (this.template === "PDF_TEMPLATE") {
      this.reportsService.getPdfUrl(dto).subscribe((data: any) => {
        console.log("data", data);
        if (action === ACION_OPEN_PDF) window.open(data.url);
        if (action === ACION_DOWNLOAD_PDF) this.appService.downloadByUrl(`${data.url}?isDownload=true`, this.fileName);
      })
    } else {
      this.reportsService.getCustomPdfUrl(dto).subscribe((data: any) => {
        console.log("data", data);
        if (action === ACION_OPEN_PDF) window.open(data.url);
        if (action === ACION_DOWNLOAD_PDF) this.appService.downloadByUrl(`${data.url}?isDownload=true`, this.fileName);
      })
    }

  }
  onSelectExport(item) {
    if (item === 'PDF') this.getPdfIdFromRest(ACION_DOWNLOAD_PDF);
  }

}
