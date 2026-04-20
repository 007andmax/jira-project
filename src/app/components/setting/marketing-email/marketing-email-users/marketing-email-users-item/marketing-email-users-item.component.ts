import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';
import { User } from 'src/app/components/users/class/user';

@Component({
    selector: 'marketing-email-users-item',
    templateUrl: './marketing-email-users-item.component.html',
    styleUrls: ['./marketing-email-users-item.component.scss'],
    providers: [TicketsListService],
    standalone: true
})
export class MarketingEmailUsersItemComponent implements OnInit {
  @Input() user: User;
  @Output() onRemove: EventEmitter<any> = new EventEmitter();
  indexNoAvatar: number = 0;
  listColorNoAvatar = [];
  constructor(public ticketsListService: TicketsListService) { }

  ngOnInit() {
    this.listColorNoAvatar = this.ticketsListService.getListColorNoAvatar();
    this.indexNoAvatar = this.ticketsListService.randomInteger(0, 6);
  }
  remove() {
    this.onRemove.emit(null);
  }
}
