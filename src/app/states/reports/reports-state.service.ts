import { Injectable, EventEmitter } from "@angular/core";
import * as moment from "moment";
import { CompaniesStateService } from "../company/companies-state.service";
declare var canvg: any;
@Injectable({
  providedIn: "root",
})
export class ReportsStateService {
  includePurchaseCost: boolean = true;
  glNumber: EventEmitter<any> = new EventEmitter();
  serviceReport: EventEmitter<any> = new EventEmitter();
  accountsReceivable: EventEmitter<any> = new EventEmitter();
  exportCSV: EventEmitter<any> = new EventEmitter();
  constructor() {}

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
    if (report == "software-summary" || report == "report-device-summary") {
      var source = $("#product-list-ticket-data");
      var target = source.clone();
      var row = target.find("th");
      var column = target.find("td");
      var total = column.length / row.length;
      var clientName = target.find("span");
      let installed = "";
      if (report == "software-summary") {
        installed = "Softwares";
      }
      if (report == "report-device-summary") {
        installed = "Devices";
      }
      let html =
        `
      <style>
      * {
        padding: 0;
        margin: 0;
      }
      body {
        padding: 0;
        margin: 0;
        -ms-box-sizing: border-box;
        -o-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 12px;
        font-weight: normal;
        font-style: normal;
        line-height: 1.33;
        letter-spacing: normal;
        color: #4f5f79;
        background-color: #f3f7f9;
      }
      h1,
      h2,
      h3,
      h4,
      h5,
      h6,
      ul,
      li,
      ol {
        padding: 0;
        margin: 0;
      }
      a {
        text-decoration: none;
        border: none;
      }
      img {
        border: none;
        outline: none;
      }

      .container{
        width: 100%;
        margin: 0 auto;
        max-width:95%;
        padding:0 20px;
      }
      table{
        border-collapse: collapse;
        width: 100%;
        table-layout:fixed;
      }</style>
      <body>
      <div class="container" style="width: 960px;margin: 0 auto;max-width:95%;padding:0 20px;">
        <table style="width: 100%;border-collapse: collapse;border: solid 1px #dfe3e8;table-layout:fixed;">
        <thead style="width: 100%;font-family: Arial, Helvetica, sans-serif;">
        <tr style="width: 100%;font-family: Arial, Helvetica, sans-serif;">
            <th style="width:100px;text-align: left;color: #fff;padding: 15px 24px 15px;vertical-align: middle;font-family: Arial, Helvetica, sans-serif;background-color: #fff;" >
                <img src="/file/${localStorage.getItem(
                  "imId"
                )}.jpg" alt="Logo" title="logo" style="max-width:100px;height:auto;"/>
            </th>
            <th align="left" style="text-align:left;font-size: 16px;line-height: 1.33;color: #000;padding:15px 0 15px 70px;vertical-align: middle;font-family: Arial, Helvetica, sans-serif;background-color: #fff;">
              <div class="reports-head" style="width:585px;text-align:center;color: #364656;float:left;margin-left:-105px;">
                    <p style="margin:0;line-height:1.2;color:#364656;font-size:16px;font-family: Arial, Helvetica, sans-serif;font-weight:600;">` +
        localStorage.getItem("currentCompanyName") +
        ` - ` +
        clientName[1].innerHTML +
        ` </p>
                    <p style="line-height:1.5;color:#364656;margin:3px 0;font-size: 13px;font-family: Arial, Helvetica, sans-serif;font-weight:400;">Summary of ` +
        clientName[0].innerHTML +
        " " +
        installed +
        " " +
        `installed (` +
        total +
        ` items)</p>
                    <p style="margin:0;line-height:1;color:#4f5f79;font-size:11px;line-height: 1.09;font-family: Arial, Helvetica, sans-serif;font-weight:400;">Generated on ` +
        moment(new Date()).format("LL") +
        ` @ ` +
        moment(new Date()).format("LT") +
        `</p>
              </div>
            </th>
        </tr>
      </thead>
          <tbody style="background-color: #f3f7f9;">
            <tr style="width: 100%;">
              <td colspan="2" style="width: 100%;padding: 24px;">
                 <table style="width: 100%;border: solid 1px #dfe3e8;border-collapse: collapse;text-align: left;table-layout:fixed;">
                      <thead>
                          <tr>`;
      for (let i = 0; i < row.length; i++) {
        html =
          html +
          `<th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;">` +
          row[i].innerHTML +
          `</th>`;
      }
      html =
        html +
        `</tr>
                      </thead>
                      <tbody>`;

      html = html + `<tr style="width: 100%;">`;
      for (let j = 0; j < column.length; j++) {
        if (j != 0) {
          if (j % row.length == 0) {
            html = html + `</tr>`;
            html = html + `<tr style="width: 100%;">`;
          }
        }
        html =
          html +
          `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;vertical-align: top;">` +
          column[j].innerHTML +
          `</td>`;
      }
      html =
        html +
        `</tbody>
          </table>
       </td>
     </tr>

   </tbody>
   <tfoot style="width: 100%;">
            <tr style="width: 100%;">
              <td style="width: 100%;" colspan="2">
                <table style="width: 100%;border-collapse: collapse;table-layout:fixed;">
                  <tr>
                    <td style="width: 33.33%;color: #4f5f79;font-size: 11px;font-family: Arial, Helvetica, sans-serif;padding: 8px 24px;background-color: #fff;text-align: left;vertical-align: middle;">Report Prepare by: ` +
        localStorage.getItem("currentUser") +
        `</td>
                    <td style="width: 33.33%;color: #4f5f79;font-size:11px;font-family: Arial, Helvetica, sans-serif;padding: 8px 24px;background-color: #fff;text-align: center;vertical-align: middle;">` +
        localStorage.getItem("currentCompanyName") +
        `</td>
                    <td style="width: 33.33%;color: #4f5f79;font-size: 11px;font-family: Arial, Helvetica, sans-serif;padding: 8px 24px;background-color: #fff;text-align: right;vertical-align: middle;">Quicktech 2020 ©. All rights reserved</td>
                 </tr>
                </table>
              </td>
            </tr>
          </tfoot>
   </table>
          </div>
          </body>`;

      return html;
    }
    //  disableOpenPdfBtn();
    var selectedHtml;
    var source = $("#product-list-ticket-data");
    var target = source.clone(),
      unknownLoadingStr = "Loading...",
      sourceSVGs = source.find("svg"),
      canvas = document.createElement("canvas");

    target.find(".ng-hide").remove();
    target.find(".hide-in-report").remove();

    /*  if (!$rootScope.isPurchaseShown) {
          target.find('.purchase-cost').remove();
        }*/

    if (sourceSVGs && sourceSVGs.length) {
      var svgs = target.find("svg");
      svgs.replaceWith(function (index) {
        var svg: any = $(sourceSVGs[index]),
          img = document.createElement("img");
        var width = svg.width() + "px";
        var height = svg.height() + "px";

        svg.attr("width", width);
        svg.attr("height", height);
        var styles = svg.attr("style");
        svg.attr("style", "");

        canvg(canvas, svg[0].outerHTML);

        svg.attr("width", "100%");
        svg.attr("height", "100%");
        svg.attr("style", styles);

        img.src = canvas.toDataURL();
        img.style.width = width;
        img.style.height = height;
        return img;
      });
    }
    if (report === "company-roducts-report") {
      let products = target.find("#list-products").find("li");
      target.find("#list-products").html("");
      for (let i = 0; i < products.length; i++) {
        if (products.eq(i).find("input[type='checkbox']").prop("checked")) {
          target.find("#list-products").append(products.eq(i));
        }
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
