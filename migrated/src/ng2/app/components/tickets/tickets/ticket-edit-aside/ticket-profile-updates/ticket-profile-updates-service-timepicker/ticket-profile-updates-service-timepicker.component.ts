import { Component, OnInit, Input } from '@angular/core';
import * as moment from "moment";
var $ = require("jquery");
import "timepicker";
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';

@Component({
  selector: 'app-ticket-profile-updates-service-timepicker',
  templateUrl: './ticket-profile-updates-service-timepicker.component.html',
  styleUrls: ['./ticket-profile-updates-service-timepicker.component.scss']
})
export class TicketProfileUpdatesServiceTimepickerComponent implements OnInit {
  @Input() start: number = 0;
  @Input() end: number = 0;
  @Input() duration: number = 0;
  @Input() editMode:boolean = false;
  step: number = 1;
  constructor(private companiesStateService: CompaniesStateService) { }

  ngOnInit() {
    console.log('', moment(new Date()).format('hh:mma'));
    $(document).ready(() => {
      console.log("companiesStateService", this.companiesStateService.getCurrentCompany());

      let serviceExpenseDurationPickerInterval = this.companiesStateService.getCurrentCompany().serviceExpenseDurationPickerInterval;
      if (serviceExpenseDurationPickerInterval === 'ONE_MINUTE') this.step = 1;
      if (serviceExpenseDurationPickerInterval === 'FIVE_MINUTES') this.step = 5;
      if (serviceExpenseDurationPickerInterval === 'TEN_MINUTES') this.step = 10;
      if (serviceExpenseDurationPickerInterval === 'FIFTEEN_MINUTES') this.step = 15;
      $('#datepairExample .start').timepicker({
        'showDuration': false,
        'minTime': '12:00am',
        'timeFormat': 'g:ia',
        'step': this.step

      });
      $('#datepairExample .end').timepicker({
        'showDuration': true,
        'minTime': '12:00am',
        'timeFormat': 'g:ia',
        'step': this.step
      });
      $('#datepairExample .start').on('selectTime', (data) => {
        console.log("selectTime", data);
        this.changeStart();
      });
      $('#datepairExample .end').on('selectTime', (data) => {
        console.log("selectTime", data);

      });
      $('#datepairExample .end').on('showTimepicker', (data) => {
        console.log("showTimepicker", data);
        $('.ui-timepicker-with-duration').scrollTop(0);
      });
let startDate = (this.start > 0) ? new Date(this.start) : new Date();
let endDate = (this.end > 0) ? new Date(this.end) : new Date();
      $('#datepairExample .start').timepicker('setTime', startDate);
      $('#datepairExample .end').timepicker('setTime', endDate);

      // initialize datepair
    });
  }
  changeStart() {
    

    console.log("changeStart");
    if (this.editMode) {
      let startDate = $('#getTimeExample').timepicker('getTime');
      console.log("startDate",startDate);
      let endDate = new Date(this.start)
      $('#datepairExample .end').timepicker('setTime', endDate);
    } else {
   
    }
    $('#datepairExample .end').timepicker('option', 'minTime', $('#datepairExample .start').val());



  }
}
