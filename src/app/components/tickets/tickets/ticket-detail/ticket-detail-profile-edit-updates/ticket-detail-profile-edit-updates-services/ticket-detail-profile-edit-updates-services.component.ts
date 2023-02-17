import { Component, Input, OnInit } from '@angular/core';
import { TicketProfileService } from '../../../class/ticket-profile-service';
import { TicketProfileUpdate } from '../../../class/ticket-profile-update';
import { TicketProfileFormService } from '../../../ticket-edit-aside/class/ticket-profile-form-service';
import { TicketProfileFormUpdateServicesComponent } from '../../../ticket-edit-aside/ticket-profile-form-update/ticket-profile-form-update-services/ticket-profile-form-update-services.component';

@Component({
  selector: 'ticket-detail-profile-edit-updates-services',
  templateUrl: './ticket-detail-profile-edit-updates-services.component.html',
  styleUrls: ['./ticket-detail-profile-edit-updates-services.component.scss']
})
export class TicketDetailProfileEditUpdatesServicesComponent extends TicketProfileFormUpdateServicesComponent {
  @Input() update: TicketProfileUpdate;
  service: TicketProfileService;
  ngOnInit() {
    this.service = new TicketProfileService(this.update.services[0]);
    console.log("this.currentService", this.currentService);
    this.currentCompany = this.companiesStateService.getCurrentCompany();
    this.getServices();
    this.ticketStateService.getOnGetServicesList().subscribe(data => {
      this.getServices();
    })
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
