import { Injectable, EventEmitter } from '@angular/core';
declare var canvg: any;
@Injectable({
  providedIn: 'root'
})
export class ReportsStateService {
  glNumber: EventEmitter<any> = new EventEmitter();
  serviceReport: EventEmitter<any> = new EventEmitter();
  accountsReceivable: EventEmitter<any> = new EventEmitter();
  constructor() { }

  public onChangeGlNumber(data) {
    this.glNumber.emit(data);
  }
  public onChangeServiceReport(data) {
    this.serviceReport.emit(data);
  }
  public onChangeAccountsReceivable(data) {
    this.accountsReceivable.emit(data);
  }

  public parseReportContent() {
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

      if (sourceSVGs && sourceSVGs.length) {
        var svgs = target.find('svg');
        svgs.replaceWith(function (index) {
          console.log("sourceSVGs[index]",sourceSVGs[index]);
          var svg:any = $(sourceSVGs[index]),
            img = document.createElement('img');
          var width = svg.width() + 'px';
          var height = svg.height() + 'px';
  
          svg.attr('width', width);
          svg.attr('height', height);
          var styles = svg.attr('style');
          svg.attr('style', '');
  
          canvg(canvas, svg[0].outerHTML);
  
          svg.attr('width', '100%');
          svg.attr('height', '100%');
          svg.attr('style', styles);
  
          img.src = canvas.toDataURL();
          img.style.width = width;
          img.style.height = height;
          return img;
        });
      }
  

  //  selectedHtml = target.wrap('div').parent().html();
    selectedHtml = target.wrap('div').html();
    if (selectedHtml.indexOf(unknownLoadingStr) !== -1) {
      selectedHtml = selectedHtml.slice(unknownLoadingStr.length);
    }
    return selectedHtml;
  }
}