import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { TicketsFilter } from '../../tickets/tickets/class/tickets-filter';
import { TicketsStateService } from 'src/ng2/app/states/tickets/tickets-state.service';
import { LeftPanelService } from 'src/ng2/app/services/left-panel/left-panel.service';
import { SelectSearchComponent } from '../../shared/select-search/select-search.component';
import { StatusColor } from './tickets-status/class/status-color';
import { TicketsColor } from './tickets-status/class/tickets-color';
import { TicketsService } from 'src/ng2/app/services/tickets/tickets.service';
import { TicketsCounts } from '../../tickets/tickets/class/tickets-counts';

@Component({
  selector: 'app-left-panel-tickets',
  templateUrl: './left-panel-tickets.component.html',
  styleUrls: ['./left-panel-tickets.component.scss']
})
export class LeftPanelTicketsComponent implements OnInit {
  @ViewChild('usersDp') usersDp: SelectSearchComponent;
  ticketsFilter: TicketsFilter = new TicketsFilter();
  listType: string = "USERS";
  blockFilterUser: boolean = false;
  ticketsCounts: TicketsCounts;
  constructor(private ticketsStateService: TicketsStateService,
    private ticketsService: TicketsService,
    public cd: ChangeDetectorRef,
    private leftPanelService: LeftPanelService) { }

  ngOnInit() {
    
    this.ticketsStateService.getOnChangeLeftPanelFilter().subscribe(data => {
      this.listType = data;
    })
  
    this.leftPanelService.getColors().subscribe((data: any) => {
      let listColors = data.map(item => {
        return new StatusColor(item.backgroundColor, item.borderColor);
      })
      this.ticketsStateService.onColorStatus(listColors);

    })
    this.leftPanelService.getTicketsStatus().subscribe((data: any) => {

      let ticketsColor = new TicketsColor(data);
      this.ticketsStateService.onInitStatus(ticketsColor);
    })
    this.getCounts();

    this.ticketsStateService.getOnUpdateCounts().subscribe(data => {
      this.ticketsCounts = new TicketsCounts(data);
      this.ticketsStateService.onInitCount(this.ticketsCounts[(this.listType === 'USERS') ? 'USER' : this.listType]);
      this.cd.detectChanges();
    })
    if (window.innerWidth < 1280) $("app-left-panel-tickets .left-panel-ng2").css({ zIndex: 990 });
  }
 
  getCountByField(field) {
    return (this.ticketsCounts) ? this.ticketsCounts[field] : 0;
  }
  private getCounts() {
    this.ticketsService.getCounts(this.ticketsFilter.getDataForCounts()).subscribe(data => {
      this.ticketsCounts = new TicketsCounts(data);
      this.ticketsStateService.onInitCount(this.ticketsCounts[(this.listType === 'USERS') ? 'USER' : this.listType]);
      this.cd.detectChanges();
    })
  }
  onChangeTags(tags) {
    this.ticketsStateService.onChangeTagsFilter(tags);
    
  }
  public trackByIndex(index, item) {
    return index;
  }
}
