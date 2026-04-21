import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { TicketProfileService } from '../../../class/ticket-profile-service';
import { TicketProfileUpdate } from '../../../class/ticket-profile-update';
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
  standalone: true,
  imports: [FormsModule, CommonModule],
  selector: 'ticket-detail-profile-edit-updates-services',
  templateUrl: './ticket-detail-profile-edit-updates-services.component.html',
  styleUrls: ['./ticket-detail-profile-edit-updates-services.component.scss']
})
export class TicketDetailProfileEditUpdatesServicesComponent implements OnInit, OnDestroy {
  isUpdate: boolean = false;
  @ViewChild('durationPicker', { static: false }) durationPicker: TicketProfileUpdatesServiceDurationComponent;
  @ViewChild('timePicker', { static: false }) timePicker: TicketProfileUpdatesServiceTimepickerComponent;
  @ViewChild('serviceDP', { static: false }) serviceDP: ServicesListComponent;
  @ViewChild('datePicker', { static: false }) datePicker: DatePickerComponent;
  @Output() onUpdateMobile = new EventEmitter();
  @Output() onAddMoreMobile = new EventEmitter();
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  areTicketsTerminated: boolean = false;
  areTicketsPresented: boolean = false;
  servicesList = [];
  addedServiceList = [];
  currentCompany = null;
  currentService: TicketProfileFormService = new TicketProfileFormService();
  sub: Subscription = new Subscription();
  @Input() update: TicketProfileUpdate;
  service: TicketProfileService;

  constructor(
    private elRef: ElementRef,
    private permissionsService: PermissionsService,
    public companiesStateService: CompaniesStateService,
    public ticketStateService: TicketStateService) { }
  initUpdateMobile() {
    this.isUpdate = true;
  }
  updateMobile() {
    this.onUpdateMobile.emit(null);
  }
  addMoreMobile() {
    this.onAddMoreMobile.emit(null);
  }
  public complateUpdateMobile() {
    this.isUpdate = false;
  }
  public getServices() {
    this.servicesList = this.ticketStateService.getServicesForTicket();
    this.areTicketsTerminated = this.ticketStateService.isTicketsTerminated();
    this.areTicketsPresented = this.ticketStateService.isTicketsPresented();
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

  public onChangeDurationService(data, i) {
    this.addedServiceList[i].setQuantity(data);
    let durationEnd = (3600000 * data) + this.addedServiceList[i].durationStart;
    this.addedServiceList[i].setDurationEnd(durationEnd);
  }
  public onSelectService(item, i) {
    this.addedServiceList[i].setItem(item);
    this.addedServiceList[i].setValidate(true);
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
  ngOnInit() {
    this.service = new TicketProfileService(this.update.services[0]);
    this.currentCompany = this.companiesStateService.getCurrentCompany();
    this.getServices();
    let getOnGetServicesList = this.ticketStateService.getOnGetServicesList().subscribe(data => {
      this.getServices();
    })
    this.sub.add(getOnGetServicesList);
  }
  public selectService(item) {
    this.service.setItem(item);
  }
  public onChangeStartTimePicker(data) {
    this.service.setDurationStart(data);
    this.service.calculateQuantity();
  }
  public onChangeEndTimePicker(data) {
    this.service.setDurationEnd(data);
    this.service.calculateQuantity();
  }
  public onChangeDuration(data) {
    this.service.setQuantity(data);
    let durationEnd = (3600000 * data) + this.service.durationStart;
    this.service.setDurationEnd(durationEnd);
  }
  public onChangeDatePicker(data) {
    this.service.setDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
    this.service.setComplated(data.day, data.month, data.year);
  }
}
