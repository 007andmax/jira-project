import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';
import { User } from 'src/app/components/users/class/user';

@Component({
  selector: 'marketing-email-users-add-item',
  templateUrl: './marketing-email-users-add-item.component.html',
  styleUrls: ['./marketing-email-users-add-item.component.scss'],
  providers: [TicketsListService]

})
export class MarketingEmailUsersAddItemComponent implements OnInit {
  @Input() user: User;
  indexNoAvatar: number = 0;
  listColorNoAvatar = ['#2BC7C6',
    '#7839EE',
    '#FFB937',
    '#155EEF',
    '#D92D20',
    '#2EC866',
    '#16A4FA'];
  @Output() onSelect: EventEmitter<any> = new EventEmitter();
  constructor(public cd: ChangeDetectorRef,
    public ticketsListService: TicketsListService,) { }

  ngOnInit() {
    this.indexNoAvatar = this.ticketsListService.randomInteger(0, 6);
  }
  selectUser() {
    this.user.selected = !this.user.selected;
    this.onSelect.emit(this.user);
  }
  parseNameUser(user) {
    return `${this.user.firstName} ${user.lastName}`;
  }

}
