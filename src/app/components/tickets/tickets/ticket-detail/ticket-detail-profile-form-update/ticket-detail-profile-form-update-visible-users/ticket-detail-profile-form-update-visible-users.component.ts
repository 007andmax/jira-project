import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';

@Component({
    selector: 'ticket-detail-profile-form-update-visible-users',
    templateUrl: './ticket-detail-profile-form-update-visible-users.component.html',
    styleUrls: ['./ticket-detail-profile-form-update-visible-users.component.scss'],
    standalone: true
})
export class TicketDetailProfileFormUpdateVisibleUsersComponent implements OnInit {
  type: string = "PUBLIC";
  toggleType: boolean = false;
  @Output() onChangeType = new EventEmitter();
  constructor(public customerPortalStateService: CustomerPortalStateService,) { }

  ngOnInit() {
    if (this.customerPortalStateService.isCustomerPortal) this.type = "PUBLIC";
  }
  changeType(data) {
    this.toggleType = data;
    this.type = (data) ? "PRIVATE" : "PUBLIC";
    this.onChangeType.emit(this.type);
  }
}
