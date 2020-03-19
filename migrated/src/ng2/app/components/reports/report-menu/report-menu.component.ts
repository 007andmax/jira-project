import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import * as moment from "moment";
import { Validate } from '../class/validate';
import { GlNumber } from '../class/gl-number';
import { ReportsService } from 'src/ng2/app/services/reports/reports.service';
import { GlNumberItem } from '../class/gl-number-item';
import { ReportsStateService } from 'src/ng2/app/states/reports/reports-state.service';
import { MultiDatepickerComponent } from '../../shared/multi-datepicker/multi-datepicker.component';
import { ReportValidate } from '../class/report-validate';

@Component({
  selector: 'app-report-menu',
  templateUrl: './report-menu.component.html',
  styleUrls: ['./report-menu.component.scss']
})
export class ReportMenuComponent implements OnInit {

  selectedClient = null;
  className = '';
  glNumber: GlNumber = new GlNumber();
  loadingInProgress: boolean = true;
  listDetailed = ['Year to date', 'Monthly'];
  yearToDate = false;
  validate: ReportValidate = new ReportValidate();
  @Output() getReport = new EventEmitter<any>();
  @Output() onRequest = new EventEmitter<any>();
  @Output() onSelectedClient = new EventEmitter<any>();
  @ViewChild('dp') datePicker: any;
  constructor(private reportsService: ReportsService, private reportsStateService: ReportsStateService) { }

  ngOnInit() {



  }
  public onSelectDetailed(data) {
    this.yearToDate = false;
    if (data === 'Monthly') {
      this.datePicker.clearDate();
      this.glNumber.setMonthlyDetailed(true);
      this.datePicker.setDisabled(true);

    } else {
      if (data === 'Year to date') {
        this.datePicker.clearDate();
        this.datePicker.setDisabled(true);
        this.yearToDate = true;
      } else {
        this.datePicker.setDisabled(false);
      }
      this.glNumber.setMonthlyDetailed(false);
    }
    this.glNumber.resetDates();
    this.validate.resetDates();
    this.validate.resetMonthlyDetailed();

    //this.reportsStateService.onChangeGlNumber(this.glNumber);
  }
  public selectClient(selectClient) {

    if (selectClient === 'null') {

      //  this.recurringState.getCreateTicket().setCompany(null);

      this.selectedClient = null;
      this.glNumber.setClientCompanyId(null);
      //  this.recurringState.setClient(selectClient);

    } else {
      // this.recurringState.getCreateTicket().setCompany(selectClient.item.id);
      this.selectedClient = selectClient.item;
      this.glNumber.setClientCompanyId(selectClient.item.id);
      //  this.recurringState.setClient(selectClient);
      //  this.onCheckListServices();
      //  this.getCompanyDevices();

    }
    this.onSelectedClient.emit(this.selectedClient);
    //  this.services = [new ForCreateService()];
    // this.cd.detectChanges();
    // this.reportsStateService.onChangeGlNumber(this.glNumber);

  }


  getReportByGlNumber() {

    if (!this.validate.isValidate(this.glNumber.monthlyDetailed, this.yearToDate, this.glNumber.startDate, this.glNumber.endDate)) return;

    this.onRequest.emit(true);

    if (this.yearToDate) {
      this.reportsService.getAccountingStartDate().subscribe((res: any) => {
        this.glNumber.setStartDate(moment(res.accountingStartDate).format('YYYY/MM/DD'));
        this.glNumber.setEndDate(moment(new Date()).format('YYYY/MM/DD'));
        this.reportsService.getReportByGlNumber(this.glNumber.getForRequest()).subscribe(data => this.setDatareport(data));
      })
    } else {
      if (this.glNumber.getMonthlyDetailed()) this.glNumber.setDatesForMonthly();
      this.reportsService.getReportByGlNumber(this.glNumber.getForRequest()).subscribe(data => this.setDatareport(data));
    }


  }
  private setDatareport(data) {
    this.glNumber.clearDates();
    this.glNumber.clearList();
    if (this.glNumber.getMonthlyDetailed()) {
      let keys = Object.keys(data);
      keys = keys.sort();
      keys.forEach((key, indexKey) => {
        const element = data[key];
        this.glNumber.addDate(key);
        element.forEach((item, indexItem) => {
          let index = this.glNumber.getList().findIndex(itemList => itemList.glNumber === item.glNumber);
          if (index > -1) {
            this.glNumber.getList()[index].setSum(indexKey, item.sum);
            this.glNumber.getList()[index].updateTotal(item.sum);
          } else {
            this.glNumber.addItem(new GlNumberItem(item.glNumber, item.description, keys.length));
            let indexLast = this.glNumber.getList().length - 1;
            this.glNumber.getList()[indexLast].setSum(indexKey, item.sum);
            this.glNumber.getList()[indexLast].updateTotal(item.sum);
          }
        });

      });
    } else {
      data.forEach((item, index) => {
        this.glNumber.addItem(new GlNumberItem(item.glNumber, item.description, null));
        let indexLast = this.glNumber.getList().length - 1;
        this.glNumber.getList()[indexLast].updateTotal(item.sum);
      });
    }
    this.reportsStateService.onChangeGlNumber(this.glNumber);
    // this.getReport.emit(data);

    this.loadingInProgress = false;
    this.onRequest.emit(false);
  }
  public trackByIndex(index, item) {
    return index;
  }
  /**
  * filter data by date
  */
  public filterByDate(value) {
    if (value.start !== '' && value.end !== '') {

      this.glNumber.setStartDate(moment(value.start).format('YYYY/MM/DD'));
      this.glNumber.setEndDate(moment(value.end).format('YYYY/MM/DD'));
      this.validate.resetDates();
      this.validate.resetMonthlyDetailed();
    } else {
      this.glNumber.resetDates();
    }

    //  this.reportsStateService.onChangeGlNumber(this.glNumber);
  }
}
