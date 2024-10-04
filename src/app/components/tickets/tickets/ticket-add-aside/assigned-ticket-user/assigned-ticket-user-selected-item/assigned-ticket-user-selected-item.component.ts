import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { TicketsListService } from '../../../services/tickets-list.service';
import { TechUserItem } from 'src/app/components/shared/tech-users/class/tech-user-item';

@Component({
  selector: 'app-assigned-ticket-user-selected-item',
  templateUrl: './assigned-ticket-user-selected-item.component.html',
  styleUrls: ['./assigned-ticket-user-selected-item.component.scss'],
  providers: [TicketsListService],
})
export class AssignedTicketUserSelectedItemComponent implements OnInit {
  @Input() user: TechUserItem;
  @Input() type: string;
  listColorNoAvatar = [];
  constructor(public ticketsListService: TicketsListService,
    public cd: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.listColorNoAvatar = this.ticketsListService.getListColorNoAvatar();
  }

}
