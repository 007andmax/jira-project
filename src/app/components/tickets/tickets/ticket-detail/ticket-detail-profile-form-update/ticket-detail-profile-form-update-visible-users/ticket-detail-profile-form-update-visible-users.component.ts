import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ticket-detail-profile-form-update-visible-users',
  templateUrl: './ticket-detail-profile-form-update-visible-users.component.html',
  styleUrls: ['./ticket-detail-profile-form-update-visible-users.component.scss']
})
export class TicketDetailProfileFormUpdateVisibleUsersComponent implements OnInit {
  type: string = "PUBLIC";
  @Output() onChangeType = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  getText() {
    if (this.type === "PUBLIC") return "Visible to All users";
    if (this.type === "PRIVATE") return "Visible to tech users only";
  }
  changeType(data) {
    this.type = data;
    this.onChangeType.emit(data);
  }
}
