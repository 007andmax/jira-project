import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ElementRef, OnDestroy } from '@angular/core';
import { ServiceAgreementsService } from 'src/ng2/app/services/service-agreements/service-agreements.service';
import { TicketProfile } from '../../../class/ticket-profile';
import { RecurringService } from 'src/ng2/app/services/recurring/recurring.service';
import { TicketProfileFormService } from '../../class/ticket-profile-form-service';
import { ServicesListComponent } from 'src/ng2/app/components/shared/services-list/services-list.component';
import * as moment from "moment";
import { TicketStateService } from '../../services/ticket-state.service';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { TicketProfileUpdatesServiceDurationComponent } from '../../ticket-profile-updates/ticket-profile-updates-service-duration/ticket-profile-updates-service-duration.component';
import { TicketsStateService } from 'src/ng2/app/states/tickets/tickets-state.service';
import { Subscription } from 'rxjs';
import { DatePickerComponent } from 'src/ng2/app/components/shared/date-picker/date-picker.component';
import { TicketProfileUpdatesServiceTimepickerComponent } from '../../ticket-profile-updates/ticket-profile-updates-service-timepicker/ticket-profile-updates-service-timepicker.component';

@Component({
  selector: 'app-ticket-profile-form-update-services',
  templateUrl: './ticket-profile-form-update-services.component.html',
  styleUrls: ['./ticket-profile-form-update-services.component.scss']
})
export class TicketProfileFormUpdateServicesComponent implements OnInit, OnDestroy {
  @ViewChild('durationPicker') durationPicker: TicketProfileUpdatesServiceDurationComponent;
  @ViewChild('timePicker') timePicker: TicketProfileUpdatesServiceTimepickerComponent;

  @ViewChild('serviceDP') serviceDP: ServicesListComponent;
  @ViewChild('datePicker') datePicker: DatePickerComponent;

  @Input() ticketProfile: TicketProfile = new TicketProfile();
  areTicketsTerminated: boolean = false;
  areTicketsPresented: boolean = false;
  servicesList = [];
  addedServiceList = [];
  currentCompany = null;
  currentService: TicketProfileFormService = new TicketProfileFormService();
  sub: Subscription = new Subscription();
  constructor(private serviceAgreementsService: ServiceAgreementsService,
    private recurringService: RecurringService,
    private elRef: ElementRef,
    private ticketsStateService: TicketsStateService,
    private companiesStateService: CompaniesStateService,
    private ticketStateService: TicketStateService) { }


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
    console.log("this.currentCompany", this.currentCompany);
    this.getServices();
    this.ticketStateService.getOnGetServicesList().subscribe(data => {
      this.getServices();
    })
    let currentDate = new Date();
    this.currentService.setDate(currentDate.getDate(), currentDate.getMonth() + 1, currentDate.getFullYear(), this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
  }
  private getServices() {
    this.servicesList = this.ticketStateService.getServicesForTicket();
    this.areTicketsPresented = this.ticketStateService.isTicketsTerminated();
    this.areTicketsPresented = this.ticketStateService.isTicketsPresented();
  }

  public onChangeDatePicker(data) {
    console.log("data", data);
    this.currentService.setDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
    this.currentService.setComplated(data.day, data.month, data.year);
  }
  public onChangeDatePickerService(data, i) {
    this.addedServiceList[i].setDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
    this.addedServiceList[i].setComplated(data.day, data.month, data.year);
  }
  public addService() {
    this.addedServiceList.push(new TicketProfileFormService(this.currentService));
    console.log("addedServiceList", this.addedServiceList);
    this.currentService = new TicketProfileFormService();
    this.serviceDP.clear();
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
  public selectService(item) {
    console.log("item", item);
    this.currentService.setItem(item);
    this.currentService.setItemOrder(this.getItemOrger());
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
    //  this.company.description = event.target.value;
    this.currentService.setDescription(event.target.value);

  }
  public onChangeDescriptionService(event, i) {
    //  this.company.description = event.target.value;
    this.addedServiceList[i].setDescription(event.target.value);

  }
  public onPastDescription(value) {
    this.currentService.setDescription(value);
    //    this.inventory.description = value;
  }
  public onPastDescriptionService(value, i) {
    this.addedServiceList[i].setDescription(value);
    //    this.inventory.description = value;
  }
  public getSelectedServices() {
    return (this.currentService.item && this.currentService.item.versionedId) ? [...this.addedServiceList, this.currentService] : this.addedServiceList;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
