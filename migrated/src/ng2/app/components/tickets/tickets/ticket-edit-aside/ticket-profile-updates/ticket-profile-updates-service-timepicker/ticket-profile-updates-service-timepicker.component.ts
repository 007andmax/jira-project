import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectorRef, ElementRef } from '@angular/core';
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
  isShowEnd: boolean = false;
  isShowStart: boolean = false;
  inputTarget = null;
  timePickerStart;
  timePickerEnd;
  constructor(private companiesStateService: CompaniesStateService, public cd: ChangeDetectorRef, private elRef: ElementRef, ) { }

  ngOnInit() {

    this.currentCompany = this.companiesStateService.getCurrentCompany();
    $(document).ready(() => {
      let serviceExpenseDurationPickerInterval = this.companiesStateService.getCurrentCompany().serviceExpenseDurationPickerInterval;
      if (serviceExpenseDurationPickerInterval === 'ONE_MINUTE') this.step = 1;
      if (serviceExpenseDurationPickerInterval === 'FIVE_MINUTES') this.step = 5;
      if (serviceExpenseDurationPickerInterval === 'TEN_MINUTES') this.step = 10;
      if (serviceExpenseDurationPickerInterval === 'FIFTEEN_MINUTES') this.step = 15;
      this.timePickerStart = $(this.elRef.nativeElement).find('#datepairExample .start');
      this.timePickerEnd = $(this.elRef.nativeElement).find('#datepairExample .end');
      this.timePickerStart.timepicker({
        'showDuration': false,
        'minTime': '12:00am',
        'timeFormat': 'g:ia',
        'step': this.step

      });
      this.timePickerEnd.timepicker({
        'showDuration': true,
        'minTime': '12:00am',
        'timeFormat': 'g:ia',
        'step': this.step
      });
      this.timePickerStart.on('selectTime', (data) => {
        this.changeStart();
        let startDate = new Date(this.timePickerStart.timepicker('getTime'));
        this.onChangeStart.emit(startDate.getTime());
      });
      this.timePickerStart.on('showTimepicker', (data) => {
        this.inputTarget = data.currentTarget;
        this.isShowStart = true;
        this.onSetPosition();
      });
      this.timePickerStart.on('hideTimepicker', (data) => {
        this.isShowStart = false;
        this.inputTarget = null;
      });
      this.timePickerEnd.on('selectTime', (data) => {
        let endDate = new Date(this.timePickerEnd.timepicker('getTime'));
        this.onChangeEnd.emit(endDate.getTime());
      });
      this.timePickerEnd.on('showTimepicker', (data) => {
        this.inputTarget = data.currentTarget;
        $('.ui-timepicker-with-duration').scrollTop(0);
        this.isShowEnd = true;
        this.onSetPosition();
      });
      this.timePickerEnd.on('hideTimepicker', (data) => {
        this.isShowEnd = false;
        this.inputTarget = null;
      });
      if (this.editMode) {
        let startDate = new Date(this.start);
        let endDate = new Date(this.end);
        this.timePickerStart.timepicker('setTime', startDate);
        this.timePickerEnd.timepicker('setTime', endDate);
      } else {
        this.timePickerStart.timepicker('setTime', new Date());
        this.timePickerEnd.timepicker('setTime', new Date());
      }
      this.timePickerEnd.timepicker('option', 'minTime', this.timePickerStart.val());
      $(".ticket-edit-aside__body").scroll(() => {
        if (!this.inputTarget) return;
        this.onSetPosition();
      })
      $(window).scroll(() => {
        if (!this.inputTarget) return;
        this.onSetPosition();
      })
    });
  }
  private onSetPosition() {
    let topInput = $(this.inputTarget).offset().top;
    let height = $(".ui-timepicker-wrapper").height();
    $(".ui-timepicker-wrapper").offset({ top: topInput - height - 15 });
  }
  public refresh() {
    let startDate = new Date();
    let endDate = new Date();
    this.timePickerStart.timepicker('setTime', startDate);
    this.timePickerEnd.timepicker('setTime', endDate);
    this.cd.detectChanges();
  }
  getEndText() {
    if (!this.timePickerStart) return '';
    let startDate = this.timePickerStart.timepicker('getTime');
    let endDate = new Date(new Date(startDate).getTime() + (this.quantity * 3600000));
    return moment(endDate).format('hh:mma');
  }

  public changeStart() {
    if (this.editMode) {
      let startDate = this.timePickerStart.timepicker('getTime');
      let endDate = new Date(new Date(startDate).getTime() + (this.quantity * 3600000));
      this.timePickerEnd.timepicker('setTime', endDate);
      this.onSetEnd.emit(endDate.getTime());
    }
    this.timePickerEnd.timepicker('option', 'minTime', this.timePickerStart.val());
  }
}
