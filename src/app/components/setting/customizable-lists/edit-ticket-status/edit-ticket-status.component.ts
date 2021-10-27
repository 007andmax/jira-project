import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StatusColor } from 'src/app/components/tickets/class/status-color';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { TicketStatus } from '../class/ticket-status';

@Component({
  selector: 'edit-ticket-status',
  templateUrl: './edit-ticket-status.component.html',
  styleUrls: ['./edit-ticket-status.component.scss']
})
export class EditTicketStatusComponent implements OnInit {
  @Input() ticketStatus: TicketStatus;
  @Input() statusColors: Array<StatusColor> = [];
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  color: number = 0;
  name: string = "";
  constructor(private ticketsService: TicketsService) { }

  ngOnInit() {
    this.name = JSON.parse(JSON.stringify(this.ticketStatus.name));
    this.color = JSON.parse(JSON.stringify(this.ticketStatus.color));
  }
  setColor(i) {
    this.color = i;
  }
  close() {
    this.onClose.emit(null);
  }
  save() {
    if (this.name.length === 0) return;
    this.ticketsService.editStatus(this.ticketStatus.getDataForEdit(this.name, this.color)).subscribe(data => {
      this.close();
    })
  }
}
