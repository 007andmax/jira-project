import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LeftPanelService } from 'src/ng2/app/services/left-panel/left-panel.service';
import { StatusColor } from './class/status-color';
import { TicketsColor } from './class/tickets-color';
import { CompaniesService } from 'src/ng2/app/services/company/companies.service';
import { ItemStatus } from './class/item-status';
import { TicketsStateService } from 'src/ng2/app/states/tickets/tickets-state.service';

@Component({
  selector: 'app-tickets-status',
  templateUrl: './tickets-status.component.html',
  styleUrls: ['./tickets-status.component.scss']
})
export class TicketsStatusComponent implements OnInit {
  listType: string = '';
  listColors: Array<StatusColor> = [];
  statusColor: TicketsColor;
  listsStatus = [new ItemStatus('Unassigned', 'unassigned', 'UNASSIGNED'),
  new ItemStatus('Completed', 'completed', 'COMPLETED'),
  new ItemStatus('In Progress', 'inProgress', 'IN_PROGRESS'),
  new ItemStatus('On Hold', 'onHold', 'ON_HOLD')]
  @Output() onSetStatus = new EventEmitter<any>();
  constructor(private ticketsStateService: TicketsStateService,
    private companiesService: CompaniesService) { }

  ngOnInit() {
    this.ticketsStateService.getOnInitColor().subscribe(data => {
      this.listColors = data;
    })
    this.ticketsStateService.getOnInitStatus().subscribe(data => {
      this.statusColor = data;
    })
  }
  changeColor(field, index) {
    this.statusColor[field] = index;
    this.companiesService.setСustomStorage('ticketsTagsColors', this.statusColor).subscribe(data => {
      this.ticketsStateService.onInitStatus(this.statusColor);
    })
  }
  getStyleStatus(field) {
    return {'border-color' : (this.statusColor && this.listColors) ?  this.listColors[this.statusColor[field]].borderColor : null,'background-color' : (this.statusColor && this.listColors) ?  this.listColors[this.statusColor[field]].backgroundColor : null}
  }
  public setStatus(data) {
    this.listType = data;
    this.onSetStatus.emit(data);
  }
}
