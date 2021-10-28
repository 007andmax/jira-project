import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { TicketProfile } from '../../class/ticket-profile';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { TitleListType } from '../../tickets-header/class/title-list-type';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { ToastrService } from 'ngx-toastr';
import { AppStateService } from 'src/app/states/app/app-state.service';
import { TicketStatus } from 'src/app/components/setting/customizable-lists/class/ticket-status';
import { Subscription } from 'rxjs';
import { StatusColor } from '../../../class/status-color';

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
  constructor(private ticketsStateService: TicketsStateService,
    private toastrService: ToastrService,
    private appStateService: AppStateService,
    private ticketsService: TicketsService,) { }


  ngOnInit() {
    this.ticketsStateService.getOnInitColor().subscribe(data => {
      this.listColors = data;
    })
    this.ticketsStatus = this.ticketsStateService.getTicketsStatus();
    let onGetTicketsStatus = this.ticketsStateService.onGetTicketsStatus.subscribe(data => {
      this.ticketsStatus = data;
    })
    this.sub.add(onGetTicketsStatus);
  }
  getStyleStatus(name) {
    let find = this.ticketsStatus.find(item => item.name === name);
    return { 'border-color': (this.listColors) ? this.listColors[find.color].borderColor : null, 'background-color': (this.listColors) ? this.listColors[find.color].backgroundColor : null, 'color': (this.listColors) ? this.listColors[find.color].borderColor : null }
  }
  changeTicketStatus(item) {
    this.ticketsService.changeStatus(this.ticketProfile.id, item.name).subscribe((data: any) => {
      this.toastrService.success(`The tickets “${this.ticketProfile.number}” status has been changed`);
      this.appStateService.changeDetectorRef();
    })

  }
  parseStatus(name) {
    if (name === "IN_PROGRESS") return "In progress";
    if (name === "ON_HOLD") return "On hold";
    return name;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
