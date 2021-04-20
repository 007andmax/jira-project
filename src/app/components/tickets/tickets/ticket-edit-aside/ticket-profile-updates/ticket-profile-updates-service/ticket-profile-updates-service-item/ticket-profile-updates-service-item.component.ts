import { Component, OnInit, Input } from '@angular/core';
import { TicketProfileService } from '../../../../class/ticket-profile-service';
import { TicketProfileUpdate } from '../../../../class/ticket-profile-update';

@Component({
  selector: 'app-ticket-profile-updates-service-item',
  templateUrl: './ticket-profile-updates-service-item.component.html',
  styleUrls: ['./ticket-profile-updates-service-item.component.scss']
})
export class TicketProfileUpdatesServiceItemComponent implements OnInit {
  @Input() service: TicketProfileService;
  @Input() update: TicketProfileUpdate;
  @Input() isBlockChange: boolean;
  editMode: boolean = false;
  constructor() { }

  ngOnInit() {
  }

}
