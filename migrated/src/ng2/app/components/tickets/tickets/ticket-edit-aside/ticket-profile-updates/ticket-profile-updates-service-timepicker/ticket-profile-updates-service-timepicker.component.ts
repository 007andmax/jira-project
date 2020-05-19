import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
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
  @Input() quantity: number = 0;
  @Input() editMode: boolean = false;
  @Output() onChangeEnd = new EventEmitter<any>();
  @Output() onSetEnd = new EventEmitter<any>();
  @Output() onChangeStart = new EventEmitter<any>();
  currentCompany = null;
  step: number = 1;
  isShowEnd:boolean = false;
  isShowStart:boolean = false;
  inputTarget = null;
  constructor(private companiesStateService: CompaniesStateService) { }

  ngOnInit() {

    this.currentCompany = this.companiesStateService.getCurrentCompany();
    $(document).ready(() => {

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
        let startDate = new Date($('#datepairExample .start').timepicker('getTime'));
        this.onChangeStart.emit(startDate.getTime());
      });
      $('#datepairExample .start').on('showTimepicker', (data) => {
      this.inputTarget = data.currentTarget;
       this.isShowStart = true;
       this.onSetPosition();
      });
      $('#datepairExample .start').on('hideTimepicker', (data) => {
        
        this.isShowStart = false;
        this.inputTarget = null;
      });

      /*$('#datepairExample .start').on('showTimepicker', (data) => {
        $('body').append("<div class='igx-overlay'><div class='igx-overlay__wrapper'></div></div>");
        $('.igx-overlay__wrapper').append($(".ui-timepicker-wrapper"));
      });*/
      $('#datepairExample .end').on('selectTime', (data) => {
        console.log("selectTime", data);
        let endDate = new Date($('#datepairExample .end').timepicker('getTime'));
        this.onChangeEnd.emit(endDate.getTime());
      });
      $('#datepairExample .end').on('showTimepicker', (data) => {
        this.inputTarget = data.currentTarget;
        console.log("showTimepicker", data);
        $('.ui-timepicker-with-duration').scrollTop(0);
       this.isShowEnd = true;
       this.onSetPosition();
      });
      $('#datepairExample .end').on('hideTimepicker', (data) => {
        this.isShowEnd = false;
        this.inputTarget = null;
      });
      
      if (this.editMode) {
        let startDate = new Date(this.start);
        let endDate = new Date(this.end);
        $('#datepairExample .start').timepicker('setTime', startDate);
        $('#datepairExample .end').timepicker('setTime', endDate);


      } else {
        $('#datepairExample .start').timepicker('setTime', new Date());
        $('#datepairExample .end').timepicker('setTime', new Date());
      }
      $('#datepairExample .end').timepicker('option', 'minTime', $('#datepairExample .start').val());

      $(".ticket-edit-aside__body").scroll(() => {
        if (!this.inputTarget) return;
        this.onSetPosition();
      })
     /* window.addEventListener('scroll', ()=> {
        console.log("html");
        if (!this.inputTarget) return;
        let topInput =  $(this.inputTarget).offset().top;
        let height = $(".ui-timepicker-wrapper").height();
        $(".ui-timepicker-wrapper").offset({ top: topInput - height - 15 });
      });*/
      $(window).scroll(() => {
        console.log("html");
        if (!this.inputTarget) return;
     this.onSetPosition();
      })
      // initialize datepair
    });
  }
  private onSetPosition () {
    let topInput =  $(this.inputTarget).offset().top;
    let height = $(".ui-timepicker-wrapper").height();
    $(".ui-timepicker-wrapper").offset({ top: topInput - height - 15 });
  }
  public refresh() {
    let startDate = new Date();
    let endDate = new Date();
    $('#datepairExample .start').timepicker('setTime', startDate);
    $('#datepairExample .end').timepicker('setTime', endDate);
  }
  getEndText() {
    let startDate = $('#datepairExample .start').timepicker('getTime');
    let endDate = new Date(new Date(startDate).getTime() + (this.quantity * 3600000));
    return moment(new Date(endDate)).format('hh:mma');
  }

  public changeStart() {
    if (this.editMode) {
      let startDate = $('#datepairExample .start').timepicker('getTime');
      console.log("startDate", startDate);
      let endDate = new Date(new Date(startDate).getTime() + (this.quantity * 3600000));
      console.log("endDate", endDate);
      console.log("quantity,this.", this.quantity);
      $('#datepairExample .end').timepicker('setTime', endDate);
      this.onSetEnd.emit(endDate.getTime());
    }
    $('#datepairExample .end').timepicker('option', 'minTime', $('#datepairExample .start').val());
  }
}
