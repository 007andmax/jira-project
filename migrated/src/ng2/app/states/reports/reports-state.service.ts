import { Injectable, EventEmitter } from '@angular/core';
import { CompaniesStateService } from '../company/companies-state.service';
declare var canvg: any;
@Injectable({
  providedIn: 'root'
})
export class ReportsStateService {
  includePurchaseCost:boolean = true;
  glNumber: EventEmitter<any> = new EventEmitter();
  serviceReport: EventEmitter<any> = new EventEmitter();
  accountsReceivable: EventEmitter<any> = new EventEmitter();
  exportCSV: EventEmitter<any> = new EventEmitter();
  constructor() { }

  public onChangeExportCSV(data) {
    this.exportCSV.emit(data);
  }
  public onChangeGlNumber(data) {
    this.glNumber.emit(data);
  }
  public onChangeServiceReport(data) {
    this.serviceReport.emit(data);
  }
  public onChangeAccountsReceivable(data) {
    this.accountsReceivable.emit(data);
  }

  public parseReportContent(report) {
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
        console.log("sourceSVGs[index]", sourceSVGs[index]);
        var svg: any = $(sourceSVGs[index]),
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
    if (report === 'company-roducts-report') {
      console.log("this.includePurchaseCost",this.includePurchaseCost);
      let products = target.find("#list-products").find("li");
      // console.log("proucts",proucts);
      target.find("#list-products").html("");
      for (let i = 0; i < products.length; i++) {
        if (products.eq(i).find("input[type='checkbox']").prop('checked')) {
          target.find("#list-products").append(products.eq(i));
        }
        //console.log(target.find("#list-products").html());
        console.log(products.eq(i).find("input[type='checkbox']").prop('checked'));
      }
      if (!this.includePurchaseCost) target.find(".purchase-cost").hide();

    }

    //  selectedHtml = target.wrap('div').parent().html();
    selectedHtml = `<div>${target.html()}</div>`;
    if (selectedHtml.indexOf(unknownLoadingStr) !== -1) {
      selectedHtml = selectedHtml.slice(unknownLoadingStr.length);
    }
    return selectedHtml;
  }
}