import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';
import { AssignedTicketUserSelectedItemComponent } from 'src/app/components/tickets/tickets/ticket-add-aside/assigned-ticket-user/assigned-ticket-user-selected-item/assigned-ticket-user-selected-item.component';

@Component({
  standalone: true,
  imports: [CommonModule],
    selector: 'app-add-user-to-company-selected-item',
    templateUrl: './add-user-to-company-selected-item.component.html',
    styleUrls: ['./add-user-to-company-selected-item.component.scss'],
    providers: [TicketsListService],
    standalone: true,
})
export class AddUserToCompanySelectedItemComponent extends AssignedTicketUserSelectedItemComponent {
  @Output() onSelectUser = new EventEmitter<any>();

  remove() {
    this.user.selected = false;
    this.onSelectUser.emit(this.user);
    if (!this.cd['destroyed']) this.cd.detectChanges();
  }
}
