import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';
import { User } from 'src/app/components/users/class/user';

@Component({
  selector: 'marketing-email-users-item',
  templateUrl: './marketing-email-users-item.component.html',
  styleUrls: ['./marketing-email-users-item.component.scss'],
  providers: [TicketsListService]
})
export class MarketingEmailUsersItemComponent implements OnInit {
  @Input() user: User;
  @Output() onRemove: EventEmitter<any> = new EventEmitter();
  indexNoAvatar: number = 0;
  listColorNoAvatar = ['#2BC7C6',
    '#7839EE',
    '#FFB937',
    '#155EEF',
    '#D92D20',
    '#2EC866',
    '#16A4FA'];
  constructor(public ticketsListService: TicketsListService) { }

  ngOnInit() {
    this.indexNoAvatar = this.ticketsListService.randomInteger(0, 6);
  }
  remove() {
    this.onRemove.emit(null);
  }
}
