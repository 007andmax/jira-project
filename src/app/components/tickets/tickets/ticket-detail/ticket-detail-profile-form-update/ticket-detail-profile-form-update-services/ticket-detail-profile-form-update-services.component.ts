import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { TicketProfileFormService } from '../../../ticket-edit-aside/class/ticket-profile-form-service';
import { Subscription } from 'rxjs';
import { DatePickerComponent } from 'src/app/components/shared/date-picker/date-picker.component';
import { ServicesListComponent } from 'src/app/components/shared/services-list/services-list.component';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { TicketProfile } from '../../../class/ticket-profile';
import { TicketStateService } from '../../../ticket-edit-aside/services/ticket-state.service';
import { TicketProfileUpdatesServiceDurationComponent } from '../../../ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-service-duration/ticket-profile-updates-service-duration.component';
import { TicketProfileUpdatesServiceTimepickerComponent } from '../../../ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-service-timepicker/ticket-profile-updates-service-timepicker.component';

@Component({
  selector: 'ticket-detail-profile-form-update-services',
  templateUrl: './ticket-detail-profile-form-update-services.component.html',
  styleUrls: ['./ticket-detail-profile-form-update-services.component.scss']
})
export class TicketDetailProfileFormUpdateServicesComponent implements OnInit, OnDestroy {
  isUpdate: boolean = false;
  @ViewChild('durationPicker', { static: false }) durationPicker: TicketProfileUpdatesServiceDurationComponent;
  @ViewChild('timePicker', { static: false }) timePicker: TicketProfileUpdatesServiceTimepickerComponent;
  @ViewChild('serviceDP', { static: false }) serviceDP: ServicesListComponent;
  @ViewChild('datePicker', { static: false }) datePicker: DatePickerComponent;
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  areTicketsTerminated: boolean = false;
  areTicketsPresented: boolean = false;
  servicesList = [];
  addedServiceList = [];
  currentCompany = null;
  currentService: TicketProfileFormService = new TicketProfileFormService();
  sub: Subscription = new Subscription();
  constructor(
    private elRef: ElementRef,
    private permissionsService: PermissionsService,
    private ticketsStateService: TicketsStateService,
    public companiesStateService: CompaniesStateService,
    public ticketStateService: TicketStateService) { }


  ngOnInit() {

    let getOnClearFormUpdate = this.ticketsStateService.getOnClearFormUpdate().subscribe(data => {
      this.addedServiceList = [];
      this.elRef.nativeElement.querySelector('#service-description').value = "";
      this.currentService = new TicketProfileFormService();

      this.serviceDP.clear();
      this.datePicker.reset();
      if (this.currentCompany.serviceExpenseDurationPresentation === 'TIME_PICKER') this.timePicker.refresh();
      if (this.currentCompany.serviceExpenseDurationPresentation === 'DURATION_PICKER') this.durationPicker.refresh();
    })
    this.sub.add(getOnClearFormUpdate);
    this.currentCompany = this.companiesStateService.getCurrentCompany();

    this.getServices();
    this.ticketStateService.getOnGetServicesList().subscribe(data => {
      this.getServices();
    })

    let currentDate = new Date();
    this.currentService.setDate(currentDate.getDate(), currentDate.getMonth() + 1, currentDate.getFullYear(), this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);

  }
  initUpdateMobile() {
    this.isUpdate = true;
  }
  public complateUpdateMobile() {
    this.isUpdate = false;
  }
  public getServices() {
    this.servicesList = this.ticketStateService.getServicesForTicket();
    this.areTicketsTerminated = this.ticketStateService.isTicketsTerminated();
    this.areTicketsPresented = this.ticketStateService.isTicketsPresented();
  }

  public onChangeDatePicker(data) {
    this.currentService.setDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
    this.currentService.setComplated(data.day, data.month, data.year);
  }
  public onChangeDatePickerService(data, i) {
    this.addedServiceList[i].setDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
    this.addedServiceList[i].setComplated(data.day, data.month, data.year);
  }
  public addService() {
    this.addedServiceList.push(new TicketProfileFormService(JSON.parse(JSON.stringify(this.currentService))));
    this.currentService = new TicketProfileFormService();
    let currentDate = new Date();
    this.currentService.setDate(currentDate.getDate(), currentDate.getMonth() + 1, currentDate.getFullYear(), this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);

    this.serviceDP.clear();
    this.elRef.nativeElement.querySelector('#service-description').value = "";
    if (this.currentCompany.serviceExpenseDurationPresentation === 'DURATION_PICKER') this.durationPicker.refresh();
    if (this.currentCompany.serviceExpenseDurationPresentation === 'TIME_PICKER') this.timePicker.refresh();
  }
  public getHours(service) {
    let timeInMinutes = service.quantity * 60;
    return Math.floor(timeInMinutes / 60);

  }
  public getMinutes(service) {
    let timeInMinutes = service.quantity * 60;
    let hours = Math.floor(timeInMinutes / 60);
    return Math.round(timeInMinutes - (hours * 60));

  }
  public onChangeDuration(data) {
    this.currentService.setQuantity(data);
    let durationEnd = (3600000 * data) + this.currentService.durationStart;
    this.currentService.setDurationEnd(durationEnd);
  }
  public onChangeDurationService(data, i) {
    this.addedServiceList[i].setQuantity(data);
    let durationEnd = (3600000 * data) + this.addedServiceList[i].durationStart;
    this.addedServiceList[i].setDurationEnd(durationEnd);
  }
  public onSelectService(item, i) {
    this.addedServiceList[i].setItem(item);
    this.addedServiceList[i].setValidate(true);
  }
  public selectService(item) {
    this.currentService.setItem(item);
    this.currentService.setItemOrder(this.getItemOrger());
    this.currentService.setValidate(true);
  }
  public removeService(i) {
    this.addedServiceList.splice(i, 1);
    this.currentService.setItemOrder(this.getItemOrger());
  }
  public onChangeStartTimePickerService(data, i) {
    this.addedServiceList[i].setDurationStart(data);
    this.addedServiceList[i].calculateQuantity();
  }
  public onChangeEndTimePickerSerice(data, i) {
    this.addedServiceList[i].setDurationEnd(data);
    this.addedServiceList[i].calculateQuantity();
  }
  public onChangeStartTimePicker(data) {
    this.currentService.setDurationStart(data);
    this.currentService.calculateQuantity();
  }
  public onChangeEndTimePicker(data) {
    this.currentService.setDurationEnd(data);
    this.currentService.calculateQuantity();
  }
  private getItemOrger() {
    return (this.addedServiceList.length - 1) >= 0 ? this.addedServiceList.length - 1 : 0;
  }
  public onChangeDescription(event) {
    this.currentService.setDescription(event.target.value);

  }
  public onChangeDescriptionService(event, i) {
    this.addedServiceList[i].setDescription(event.target.value);

  }
  public onPastDescription(value) {
    this.currentService.setDescription(value);
  }
  public onPastDescriptionService(value, i) {
    this.addedServiceList[i].setDescription(value);
  }
  public getSelectedServices() {
    return (this.currentService.item && this.currentService.item.versionedId) ? [...this.addedServiceList, this.currentService] : this.addedServiceList;
  }
  public onValidateServices() {
    this.addedServiceList.forEach((item, index) => {
      item.checkValidate();
      item.checkQuantity();
    })
    let find = this.addedServiceList.find(item => !item.validate || !item.validateQuantity);
    this.currentService.checkValidate();
    this.currentService.checkQuantity();
    return ((find) ? false : true) && this.currentService.validate && this.currentService.validateQuantity;
  }
  public trackByIndex(index, item) {
    return index;
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  clearForm() {
    this.currentService = new TicketProfileFormService(JSON.parse(JSON.stringify(this.addedServiceList[0])));
    if (this.currentService.item) this.serviceDP.setEditItem(this.currentService.item);
    if (this.timePicker) this.timePicker.setEditItem(this.currentService.durationStart, this.currentService.durationEnd);
    if (this.durationPicker) {
      let timeInMinutes = this.currentService.quantity * 60,
        hours = Math.floor(timeInMinutes / 60),
        minutes = Math.round(timeInMinutes - (hours * 60));
      this.durationPicker.hour = hours;
      this.durationPicker.minute = minutes;
      this.durationPicker.refresh();
    }
    this.datePicker.setEditDate(this.currentService.getDateTimeWithTimeOffset(this.companiesStateService.getCurrentCompany()));
    this.addedServiceList = [];
  }
}
