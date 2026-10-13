import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatChipComponent } from '../../../../../shared/mat-chip/mat-chip.component';
import { NgFor, NgStyle } from '@angular/common';
import { MatChipListComponent } from '../../../../../shared/mat-chip-list/mat-chip-list.component';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';
import { TicketsTableItemRequestedByComponent } from 'src/app/components/tickets/tickets/tickets-table/tickets-table-item/tickets-table-item-requested-by/tickets-table-item-requested-by.component';
import { UserLogoPopoverDirective } from 'src/app/directives/user-logo-popover/user-logo-popover.directive';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-contracts-aside-block-time-billing-users',
  templateUrl: './contracts-aside-block-time-billing-users.component.html',
  styleUrls: ['./contracts-aside-block-time-billing-users.component.scss'],
  standalone: true,
  imports: [MatChipListComponent, UserLogoPopoverDirective, NgbModule, NgFor, MatChipComponent, NgStyle, TicketsTableItemRequestedByComponent],
  providers: [TicketsListService]
})
export class ContractsAsideBlockTimeBillingUsersComponent implements OnInit {
  @Input() selectedUsers = [];
  @Output() onSelected = new EventEmitter<any>();
  selectable = true;
  removable = true;
  indexNoAvatar: number = 0;
  listColorNoAvatar = [];
  constructor(public ticketsListService: TicketsListService,) { }

  ngOnInit() {
    this.listColorNoAvatar = this.ticketsListService.getListColorNoAvatar();
    this.indexNoAvatar = this.ticketsListService.randomInteger(0, 6);
  }
  public remove(index): void {
    if (index >= 0) {
      this.selectedUsers.splice(index, 1);
      this.onSelected.emit(this.selectedUsers);
    }
  }
  getAssignedUserNameForAvatar(user) {
    if (!user) return '';
    if (!user.avatar) return `${(user.firstName) ? user.firstName[0].toUpperCase() : ''}${(user.lastName) ? user.lastName[0].toUpperCase() : ''}`;
    return '';
  }
  getStyleAvatar(user) {
    if (!(user && user.avatar)) {
      return '#16a4fa';
    }
    if (user.id) {
      return `url(${'/users/' + (user.id || 'default') + '/image' + (user.avatar ? '.jpg?t=' + user.avatar.updatedAt :
        '')}) no-repeat`
    } else if (user.avatar && user.avatar.origin && user.avatar.origin.id) {
      return `url(/file/${(user.avatar.origin.id)}.jpg) no-repeat`;
    } else {
      return '#16a4fa';
    }
  };
  public getUserName(user) {
    return (user) ? `${user.firstName} ${user.lastName}` : '';
  }

}
