import { Component, OnInit } from '@angular/core';
import { TicketProfileFormService } from '../../../ticket-edit-aside/class/ticket-profile-form-service';
import { TicketProfileFormUpdateServicesComponent } from '../../../ticket-edit-aside/ticket-profile-form-update/ticket-profile-form-update-services/ticket-profile-form-update-services.component';

@Component({
  selector: 'ticket-detail-profile-form-update-services',
  templateUrl: './ticket-detail-profile-form-update-services.component.html',
  styleUrls: ['./ticket-detail-profile-form-update-services.component.scss']
})
export class TicketDetailProfileFormUpdateServicesComponent extends TicketProfileFormUpdateServicesComponent {


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
