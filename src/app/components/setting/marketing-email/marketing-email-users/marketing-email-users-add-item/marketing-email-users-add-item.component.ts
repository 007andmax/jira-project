import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';
import { User } from 'src/app/components/users/class/user';

@Component({
    selector: 'marketing-email-users-add-item',
    templateUrl: './marketing-email-users-add-item.component.html',
    styleUrls: ['./marketing-email-users-add-item.component.scss'],
    providers: [TicketsListService],
    standalone: true
})
export class MarketingEmailUsersAddItemComponent implements OnInit {
  @Input() user: User;
  indexNoAvatar: number = 0;
  listColorNoAvatar = [];
  @Output() onSelect: EventEmitter<any> = new EventEmitter();
  constructor(public cd: ChangeDetectorRef,
    public ticketsListService: TicketsListService,) { }

  ngOnInit() {
    this.listColorNoAvatar = this.ticketsListService.getListColorNoAvatar();
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
