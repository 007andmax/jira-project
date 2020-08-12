import { NgModule, ViewChild } from '@angular/core';
import { Component, OnInit,ViewEncapsulation  } from '@angular/core';
import {NgbDropdownToggle,NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { TicketProfileFormService } from '../../../../ng2/app/components/tickets/tickets/ticket-edit-aside/class/ticket-profile-form-service';
import { TicketProfileUpdatesServiceTimepickerComponent } from '../../components/tickets/tickets/ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-service-timepicker/ticket-profile-updates-service-timepicker.component';
@Component({
  selector: 'company-dashboard',
  templateUrl: './company-dashboard.component.html',
  styleUrls: ['./company-dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})

@NgModule({
  imports: [NgbDropdownToggle,NgbModal]  
})
export class CompanyDashboardComponent implements OnInit {
  @ViewChild('timePicker1') timePicker1: TicketProfileUpdatesServiceTimepickerComponent;
  @ViewChild('timePicker2') timePicker2: TicketProfileUpdatesServiceTimepickerComponent;
  @ViewChild('timePicker3') timePicker3: TicketProfileUpdatesServiceTimepickerComponent;
  @ViewChild('timePicker4') timePicker4: TicketProfileUpdatesServiceTimepickerComponent;
  @ViewChild('timePicker5') timePicker5: TicketProfileUpdatesServiceTimepickerComponent;
  @ViewChild('timePicker6') timePicker6: TicketProfileUpdatesServiceTimepickerComponent;
  @ViewChild('timePicker7') timePicker7: TicketProfileUpdatesServiceTimepickerComponent;
  currentService: TicketProfileFormService = new TicketProfileFormService();
  constructor(private modalService: NgbModal) {}
  closeResult = '';

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',centered: true , windowClass: 'cmp-comapny-modal'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    });
  }

  ngOnInit() {
    this.currentService = new TicketProfileFormService();
  }

  public onChangeStartTimePicker(data) {
    this.currentService.setDurationStart(data);
  }

  public onChangeEndTimePicker(data) {
    this.currentService.setDurationEnd(data);
  }

}
