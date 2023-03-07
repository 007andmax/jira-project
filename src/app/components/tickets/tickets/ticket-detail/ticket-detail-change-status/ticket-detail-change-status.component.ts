import { Component, OnInit } from '@angular/core';
import { TicketChangeStatusComponent } from '../../ticket-edit-aside/ticket-change-status/ticket-change-status.component';
import { TitleListType } from '../../tickets-header/class/title-list-type';

@Component({
  selector: 'ticket-detail-change-status',
  templateUrl: './ticket-detail-change-status.component.html',
  styleUrls: ['./ticket-detail-change-status.component.scss']
})
export class TicketDetailChangeStatusComponent extends TicketChangeStatusComponent {
  selectedTicketStatus: TitleListType;
  list: Array<TitleListType> = [new TitleListType('In Progress', 'IN_PROGRESS'),
  new TitleListType('On Hold', 'ON_HOLD')];

  ngOnInit() {
    this.ticketsStateService.getOnInitColor().subscribe(data => {
      this.listColors = data;
    })
    this.ticketsStatus = this.ticketsStateService.getTicketsStatus();
    this.setList();
    let onGetTicketsStatus = this.ticketsStateService.onGetTicketsStatus.subscribe(data => {
      this.ticketsStatus = data;
      this.setList();
    })
    this.sub.add(onGetTicketsStatus);
  }
  setList() {
    this.list = [];
    this.ticketsStatus.forEach(item => {
      if (item.name !== 'COMPLETED' && item.name !== 'UNASSIGNED') this.list.push(new TitleListType(this.parseStatus(item.name), item.name));
    })
    this.selectedTicketStatus = this.list.find(item => item.type == (this.ticketProfile.customStatus ? this.ticketProfile.customStatus : this.ticketProfile.status));
    if (this.ticketProfile.status === null) this.selectedTicketStatus = new TitleListType(this.parseStatus("UNASSIGNED"), "UNASSIGNED");
    if (this.ticketProfile.status === "COMPLETED") this.selectedTicketStatus = new TitleListType(this.parseStatus("COMPLETED"), "COMPLETED");
  }
  changeTicketStatus(item) {
    this.ticketsService.changeStatus(this.ticketProfile.id, item.type).subscribe((data: any) => {
      this.selectedTicketStatus = item;
      this.toastrService.success(`The tickets “${this.ticketProfile.number}” status has been changed`);
      this.appStateService.changeDetectorRef();
    })

  }
}
