import { Component, OnInit, ViewChild } from '@angular/core';
import { TicketChangeStatusComponent } from '../../ticket-edit-aside/ticket-change-status/ticket-change-status.component';
import { TitleListType } from '../../tickets-header/class/title-list-type';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';

@Component({
  selector: 'ticket-detail-change-status',
  templateUrl: './ticket-detail-change-status.component.html',
  styleUrls: ['./ticket-detail-change-status.component.scss']
})
export class TicketDetailChangeStatusComponent extends TicketChangeStatusComponent {
  @ViewChild('dp', { static: true }) dp: DropDownComponent;
  selectedTicketStatus: TitleListType;
  list: Array<TitleListType> = [new TitleListType('In Progress', 'IN_PROGRESS'),
  new TitleListType('Pending Review', 'PENDING_REVIEW'),
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
    let getOnUpdateTicket = this.ticketsStateService.getOnUpdateTicket().subscribe(data => {
      this.setList();
      this.cd.detectChanges();
    })
    this.sub.add(getOnUpdateTicket);
    let onCloseTicketForReview = this.ticketStateService.onCloseTicketForReview.subscribe(res => {
      this.dp.selectedItem = this.list.find(item => item.type == "PENDING_REVIEW");
      this.changeTicketStatus(this.dp.selectedItem);
    })
    this.sub.add(onCloseTicketForReview);
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
  setStatusWithoutChange(data) {
    this.selectedTicketStatus = new TitleListType(this.parseStatus(data), data);
    this.dp.selectItemWithOutChanges(this.selectedTicketStatus);
  }
  changeTicketStatus(item) {
    this.selectedTicketStatus = item;
    this.ticketsService.changeStatus(this.ticketProfile.id, item.type).subscribe((data: any) => {
      this.toastrService.success(`The tickets “${this.ticketProfile.number}” status has been changed`);
      this.appStateService.changeDetectorRef();
    })

  }
}
