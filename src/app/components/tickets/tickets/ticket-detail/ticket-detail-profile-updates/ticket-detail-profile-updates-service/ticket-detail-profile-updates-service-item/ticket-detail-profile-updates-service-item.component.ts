import { TicketDetailProfileUpdatesServiceInfoComponent } from './';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TicketProfileService } from '../../../../class/ticket-profile-service';
import { TicketProfileUpdate } from '../../../../class/ticket-profile-update';

@Component({
  standalone: true,
  imports: [TicketDetailProfileUpdatesServiceInfoComponent, CommonModule],
  selector: 'ticket-detail-profile-updates-service-item',
  templateUrl: './ticket-detail-profile-updates-service-item.component.html',
  styleUrls: ['./ticket-detail-profile-updates-service-item.component.scss']
})
export class TicketDetailProfileUpdatesServiceItemComponent implements OnInit {
  @Input() showCompleteLabel: boolean = false;
  @Input() index: number;
  @Input() service: TicketProfileService;
  @Input() update: TicketProfileUpdate;
  @Input() isBlockChange: boolean;
  editMode: boolean = false;

  constructor() { }

  ngOnInit() {
  }
}
