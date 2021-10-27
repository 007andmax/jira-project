import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { data } from 'jquery';
import { StatusColor } from 'src/app/components/left-panel/left-panel-tickets/tickets-status/class/status-color';
import { TicketsService } from 'src/app/services/tickets/tickets.service';


@Component({
  selector: 'add-ticket-status',
  templateUrl: './add-ticket-status.component.html',
  styleUrls: ['./add-ticket-status.component.scss']
})
export class AddTicketStatusComponent implements OnInit {
  @Input() statusColors: Array<StatusColor> = [];
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  color: number = 0;
  name: string = "";
  constructor(private ticketsService: TicketsService,) { }

  ngOnInit() {
  }
  setColor(i) {
    this.color = i;
  }
  close() {
    this.onClose.emit(null);
  }
  save() {
    if (this.name.length === 0) return;
    this.ticketsService.addStatus(this.name, this.color).subscribe(data => {
      this.close();
    })
  }
}
