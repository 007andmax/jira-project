import { Component, Input, OnInit } from '@angular/core';
import { TicketProfileProduct } from '../../../../class/ticket-profile-product';
import { TicketProfileUpdate } from '../../../../class/ticket-profile-update';

@Component({
  selector: 'ticket-detail-profile-updates-product-item',
  templateUrl: './ticket-detail-profile-updates-product-item.component.html',
  styleUrls: ['./ticket-detail-profile-updates-product-item.component.scss']
})
export class TicketDetailProfileUpdatesProductItemComponent implements OnInit {
  @Input() showCompleteLabel: boolean = false;
  @Input() index: number; @Input() product: TicketProfileProduct;
  @Input() update: TicketProfileUpdate;
  @Input() isBlockChange: boolean;
  editMode: boolean = false;
  constructor() { }

  ngOnInit() {
  }
}
