import { Component, OnInit, Input } from '@angular/core';
import { TicketProfileService } from '../../../../class/ticket-profile-service';
import { TicketProfileUpdate } from '../../../../class/ticket-profile-update';
import { TicketProfileProduct } from '../../../../class/ticket-profile-product';

@Component({
  selector: 'app-ticket-profile-updates-product-item',
  templateUrl: './ticket-profile-updates-product-item.component.html',
  styleUrls: ['./ticket-profile-updates-product-item.component.scss']
})
export class TicketProfileUpdatesProductItemComponent implements OnInit {
  @Input() product: TicketProfileProduct;
  @Input() update: TicketProfileUpdate;
  editMode:boolean = false;
  constructor() { }

  ngOnInit() {
  }
  
}
