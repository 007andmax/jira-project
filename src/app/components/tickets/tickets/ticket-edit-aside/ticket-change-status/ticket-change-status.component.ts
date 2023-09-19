import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { TicketProfile } from '../../class/ticket-profile';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { TitleListType } from '../../tickets-header/class/title-list-type';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { ToastrService } from 'ngx-toastr';
import { AppStateService } from 'src/app/states/app/app-state.service';
import { TicketStatus } from 'src/app/components/setting/ticket-settings-page/tickets-status/class/ticket-status';
import { Subscription } from 'rxjs';
import { StatusColor } from '../../../class/status-color';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { LeftPanelService } from 'src/app/services/left-panel/left-panel.service';

@Component({
  selector: 'app-ticket-change-status',
  templateUrl: './ticket-change-status.component.html',
  styleUrls: ['./ticket-change-status.component.scss']
})
export class TicketChangeStatusComponent implements OnInit, OnDestroy {
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  listColors: Array<StatusColor> = [];
  list: Array<TitleListType> = [new TitleListType('In Progress', 'IN_PROGRESS'),
  new TitleListType('On Hold', 'ON_HOLD')];
  ticketsStatus: Array<TicketStatus> = [];
  sub: Subscription = new Subscription();
  constructor(public ticketsStateService: TicketsStateService,
    public toastrService: ToastrService,
    public appStateService: AppStateService,
    public customerPortalStateService: CustomerPortalStateService,
    public ticketsService: TicketsService,
    public cd: ChangeDetectorRef,
    private leftPanelService: LeftPanelService,) { }


  ngOnInit() {
    if (this.ticketsStateService.getListStatusColor().length === 0) {
      this.leftPanelService.getColors().subscribe((data: any) => {
        this.listColors = data.map(item => {
          return new StatusColor(item.borderColor, item.textColor);
        })
        this.ticketsStateService.onColorStatus(this.listColors);
      })
    } else {
      this.listColors = this.ticketsStateService.getListStatusColor();
    }
    this.ticketsStatus = this.ticketsStateService.getTicketsStatus();
    let onGetTicketsStatus = this.ticketsStateService.onGetTicketsStatus.subscribe(data => {
      this.ticketsStatus = data;
    })
    this.sub.add(onGetTicketsStatus);
  }
  public getStyleStatus(name) {
    let find = this.ticketsStatus.find(item => item.name === name);
    return {
      'border-color': (this.listColors && find && this.listColors[find.color]) ? this.listColors[find.color].textColor : null,
      'background-color': (this.listColors && find && this.listColors[find.color]) ? this.listColors[find.color].borderColor : null, 'color': (this.listColors && find && this.listColors[find.color]) ? this.listColors[find.color].textColor : null
    }
  }
  changeTicketStatus(item) {
    this.ticketsService.changeStatus(this.ticketProfile.id, item.name).subscribe((data: any) => {
      this.ticketProfile.status = item.name;
      this.toastrService.success(`The tickets “${this.ticketProfile.number}” status has been changed`);
      this.appStateService.changeDetectorRef();
    })

  }
  parseStatus(name) {
    if (name === "IN_PROGRESS") return "In progress";
    if (name === "ON_HOLD") return "On hold";
    if (name === "COMPLETED") return "Completed";
    if (name === "UNASSIGNED") return "Unassigned";
    return name;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
