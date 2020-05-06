import { Component, OnInit } from '@angular/core';
import * as moment from "moment";
var $ = require("jquery");
import  "timepicker";
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';

@Component({
  selector: 'app-ticket-profile-updates-service-timepicker',
  templateUrl: './ticket-profile-updates-service-timepicker.component.html',
  styleUrls: ['./ticket-profile-updates-service-timepicker.component.scss']
})
export class TicketProfileUpdatesServiceTimepickerComponent implements OnInit {
start:string = '';
step:number = 1;
  constructor(private companiesStateService:CompaniesStateService) { }

  ngOnInit() {
   console.log('',moment(new Date()).format('hh:mma'));
    $(document).ready(() => {
     console.log("companiesStateService",this.companiesStateService.getCurrentCompany());
      
     let serviceExpenseDurationPickerInterval = this.companiesStateService.getCurrentCompany().serviceExpenseDurationPickerInterval;
     if (serviceExpenseDurationPickerInterval === 'ONE_MINUTE') this.step = 1;
     if (serviceExpenseDurationPickerInterval === 'FIVE_MINUTES') this.step = 5;
     if (serviceExpenseDurationPickerInterval === 'TEN_MINUTES') this.step = 10;
     if (serviceExpenseDurationPickerInterval === 'FIFTEEN_MINUTES') this.step = 15;
      $('#datepairExample .start').timepicker({
        'showDuration': false,
        'minTime' : '12:00am',
        'timeFormat': 'g:ia',
        'step': this.step
        
      });
      $('#datepairExample .end').timepicker({
        'showDuration': true,
        'minTime' : '12:00am',
        'timeFormat': 'g:ia',
        'step': this.step
      });
      $('#datepairExample .end').on('selectTime',(data) => {
console.log("selectTime",data);
      });
      $('#datepairExample .start').on('selectTime',(data) => {
        console.log("selectTime",data);
              });
       $('#datepairExample .start').timepicker('setTime', new Date());
      $('#datepairExample .end').timepicker('setTime', new Date());
      this.changeStart();
      // initialize datepair
    });
  }
  changeStart () {
    console.log("changeStart");
    $('#datepairExample .end').timepicker({
      'showDuration': true,
      'minTime' : $('#datepairExample .start').val(),
      'timeFormat': 'g:ia',
      'step': this.step
    });
  
  }
}
