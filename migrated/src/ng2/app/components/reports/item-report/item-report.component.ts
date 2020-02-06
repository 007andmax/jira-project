import { Component, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportsStateService } from 'src/ng2/app/states/reports/reports-state.service';
import { GlNumber } from '../class/gl-number';
import { GlNumberItem } from '../class/gl-number-item';
import * as $ from 'jquery';
import { ReportsService } from 'src/ng2/app/services/reports/reports.service';
import { ACION_OPEN_PDF, ACION_DOWNLOAD_PDF } from 'src/ng2/app/const/reports';
import { AppService } from 'src/ng2/app/states/app/app.service';

@Component({
  selector: 'app-item-report',
  templateUrl: './item-report.component.html',
  styleUrls: ['./item-report.component.scss']
})
export class ItemReportComponent implements OnInit {
  ACION_OPEN_PDF = ACION_OPEN_PDF;
  ACION_DOWNLOAD_PDF = ACION_DOWNLOAD_PDF;
  report: string;
  glNumber: GlNumber = new GlNumber();
  loadingInProgress: boolean = false;
  constructor(private route: ActivatedRoute, private reportsStateService: ReportsStateService,
    private reportsService: ReportsService,
    public cd: ChangeDetectorRef,
    private elRef: ElementRef,
    private appService:AppService) { }

  ngOnInit() {
    if (localStorage.report) this.report = localStorage.report;
    this.reportsStateService.glNumber.subscribe((data:GlNumber) => {
      this.glNumber = data;
      console.log("this.glNumber",this.glNumber);
      console.log("this.glNumber.list",this.glNumber.list);
      this.cd.detectChanges();
    })
  }
  public onRequest(data) {
this.loadingInProgress = data;
  }
  public getReport(data) {
 
  }

   getPdfIdFromRest(action) {
    console.log('getPdfIdFromRest');
  //  disableOpenPdfBtn();
var selectedHtml;
    var source = $(this.elRef.nativeElement.querySelector(".product-list-ticket"));
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
      orientation:  'PORTRAIT'
    };
    this.reportsService.getPdfUrl(dto).subscribe((data:any)=> {
      console.log("data",data);
      if (action === ACION_OPEN_PDF) window.open(data.url);
      if (action === ACION_DOWNLOAD_PDF) this.appService.downloadByUrl(`${data.url}?isDownload=true`,'gl_number');
    })
  /*  $http.post(attrs.convertToPdf, dto).then(function (resp) {
      if (resp.data) {
        $rootScope.reportUrl = resp.data.url || 'data:application/pdf;base64,' + resp.data;
        //scope.$apply();

        disableElement = angular.element(document).find(attrs.disableSelector);
        if (disableElement.length) {
          disableElement.attr('disabled', null);
          disableElement.removeClass('disabled');
        }
      }
    });*/
  }
  

}
