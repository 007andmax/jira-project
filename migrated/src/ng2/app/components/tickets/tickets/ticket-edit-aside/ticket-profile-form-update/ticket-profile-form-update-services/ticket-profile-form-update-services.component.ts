import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { ServiceAgreementsService } from 'src/ng2/app/services/service-agreements/service-agreements.service';
import { TicketProfile } from '../../../class/ticket-profile';
import { RecurringService } from 'src/ng2/app/services/recurring/recurring.service';
import { TicketProfileFormService } from '../../class/ticket-profile-form-service';
import { ServicesListComponent } from 'src/ng2/app/components/shared/services-list/services-list.component';
import * as moment from "moment";
import { TicketStateService } from '../../services/ticket-state.service';

@Component({
  selector: 'app-ticket-profile-form-update-services',
  templateUrl: './ticket-profile-form-update-services.component.html',
  styleUrls: ['./ticket-profile-form-update-services.component.scss']
})
export class TicketProfileFormUpdateServicesComponent implements OnInit {
  @ViewChild('serviceDP') serviceDP: ServicesListComponent;
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  @Output() changeServices = new EventEmitter<any>();
  areTicketsTerminated: boolean = false;
  areTicketsPresented: boolean = false;
  servicesList = [];
  addedServiceList = [];
  currentService: TicketProfileFormService = new TicketProfileFormService();
  constructor(private serviceAgreementsService: ServiceAgreementsService, 
    private recurringService: RecurringService,
    private ticketStateService:TicketStateService) { }

  ngOnInit() {
    this.getServices();
    this.ticketStateService.getOnGetServicesList().subscribe(data => {
     this.getServices();
    })
    

  }
  private getServices() {
    this.servicesList = this.ticketStateService.getServicesForTicket();
    this.areTicketsPresented = this.ticketStateService.isTicketsTerminated();
    this.areTicketsPresented = this.ticketStateService.isTicketsPresented();
  }
 
  public onChangeDatePicker(data) {
    console.log("data", data);
    this.currentService.setDate(new Date(data.day,data.month,data.year).toISOString());
  }
  public addService() {
    this.addedServiceList.push(JSON.parse(JSON.stringify(this.currentService)));
    console.log("addedServiceList",this.addedServiceList);
    this.currentService = new TicketProfileFormService();
   // this.serviceDP.;
    this.changeServices.emit(this.addedServiceList);
  }
  
  public selectService(item) {
    console.log("item", item);
    this.currentService.setData(item, this.getItemOrger());
  }
  public removeService(i) {
    this.addedServiceList.splice(i, 1);
    this.currentService.setItemOrder(this.getItemOrger());
    this.changeServices.emit(this.addedServiceList);
  }
  public onChangeDescription(event) {
    //  this.company.description = event.target.value;
    this.currentService.setDescription(event.target.value);

  }
  private getItemOrger() {
    return (this.addedServiceList.length - 1) >= 0 ? this.addedServiceList.length - 1 : 0;
  }
  public onPastDescription(value) {
    this.currentService.setDescription(value);
    //    this.inventory.description = value;
  }

}
