import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import * as moment from "moment";
import { Validate } from '../class/validate';
import { GlNumber } from '../class/gl-number';
import { ReportsService } from 'src/ng2/app/services/reports/reports.service';
import { GlNumberItem } from '../class/gl-number-item';
import { ReportsStateService } from 'src/ng2/app/states/reports/reports-state.service';
import { MultiDatepickerComponent } from '../../shared/multi-datepicker/multi-datepicker.component';

@Component({
  selector: 'app-report-menu',
  templateUrl: './report-menu.component.html',
  styleUrls: ['./report-menu.component.scss']
})
export class ReportMenuComponent implements OnInit {
  validate: Validate = new Validate();
  selectedClient = null;
  className = '';
  glNumber: GlNumber = new GlNumber();
  loadingInProgress: boolean = true;
  listDetailed = ['Year to date', 'Montly'];
  @Output() getReport = new EventEmitter<any>();
  @ViewChild('dp') datePicker: any;
  constructor(private reportsService: ReportsService, private reportsStateService: ReportsStateService) { }

  ngOnInit() {



  }
  public onSelectDetailed(data) {
    if (data === 'Montly') {
      this.glNumber.setMonthlyDetailed(true);
      this.datePicker.setDisabled(false);
    } else {
      if (data === 'Year to date') {
        console.log("fffff");
        this.datePicker.clearDate();
        this.datePicker.setDisabled(true);
      } else {
        this.datePicker.setDisabled(false);
      }
      this.glNumber.setMonthlyDetailed(false);
    }
//this.reportsStateService.onChangeGlNumber(this.glNumber);
  }
  public selectClient(selectClient) {
    this.validate.resetCompany();
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


    //  this.services = [new ForCreateService()];
    // this.cd.detectChanges();
   // this.reportsStateService.onChangeGlNumber(this.glNumber);

  }
  getReportByGlNumber() {
    this.reportsService.getReportByGlNumber(this.glNumber.getForRequest()).subscribe(data => {
      console.log("data", data);
      this.reportsStateService.onChangeGlNumber(this.glNumber);
      this.getReport.emit(data);

      this.loadingInProgress = false;
    })
  }
  public trackByIndex(index, item) {
    return index;
  }
  /**
  * filter data by date
  */
  public filterByDate(value) {
    if (value.start !== '' && value.end !== '')
    {
      this.glNumber.setStartDate(moment(value.start).format('YYYY/MM/DD'));
      this.glNumber.setEndDate(moment(value.end).format('YYYY/MM/DD'));
    }
  
  //  this.reportsStateService.onChangeGlNumber(this.glNumber);
  }
}
