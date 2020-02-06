import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { ACION_OPEN_PDF, ACION_DOWNLOAD_PDF } from 'src/ng2/app/const/reports';
import { ReportsService } from 'src/ng2/app/services/reports/reports.service';
import { AppService } from 'src/ng2/app/states/app/app.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ModalQuoteComponent } from 'src/ng2/app/services/modal/modal-quote/modal-quote.component';
import { ReportSendEmailComponent } from './report-send-email/report-send-email.component';

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
    console.log('getPdfIdFromRest');
    //  disableOpenPdfBtn();
    var selectedHtml;
    var source = $("#product-list-ticket-data");
    var target = source.clone(),
      unknownLoadingStr = 'Loading...',
      sourceSVGs = source.find('svg'),
      canvas = document.createElement('canvas');

    target.find('.ng-hide').remove();
    target.find('.hide-in-report').remove();

    /*  if (!$rootScope.isPurchaseShown) {
        target.find('.purchase-cost').remove();
      }*/

    /*  if (sourceSVGs && sourceSVGs.length) {
        var svgs = target.find('svg');
        svgs.replaceWith(function (index) {
          var svg = angular.element(sourceSVGs[index]),
            img = document.createElement('img');
          var width = svg.width() + 'px';
          var height = svg.height() + 'px';
  
          svg.attr('width', width);
          svg.attr('height', height);
          var styles = svg.attr('style');
          svg.attr('style', '');
  
       //   canvg(canvas, svg[0].outerHTML);
  
          svg.attr('width', '100%');
          svg.attr('height', '100%');
          svg.attr('style', styles);
  
          img.src = canvas.toDataURL();
          img.style.width = width;
          img.style.height = height;
          return img;
        });
      }
  */

    //selectedHtml = target.wrap('div').parent().html();
    selectedHtml = target.wrap('div').html();
    if (selectedHtml.indexOf(unknownLoadingStr) !== -1) {
      selectedHtml = selectedHtml.slice(unknownLoadingStr.length);
    }


    var dto = {
      fileName: 'gl_number',
      content: selectedHtml,
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
