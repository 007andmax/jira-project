import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TicketsService } from 'src/ng2/app/services/tickets/tickets.service';
import { CompanySetting } from '../../../companies/class/company-setting';
import { DashboardTicketsBillableHours } from '../class/dashboard-tickets-billable-hours';

@Component({
  selector: 'app-tickets-billable-hours-widget',
  templateUrl: './tickets-billable-hours-widget.component.html',
  styleUrls: ['./tickets-billable-hours-widget.component.scss']
})
export class TicketsBillableHoursWidgetComponent implements OnInit {
  @Output() onTicketsBillableHoursIsReady = new EventEmitter<any>();
  listIntervals = [new CompanySetting('today', 'TODAY'),new CompanySetting('this week', 'WEEK'),new CompanySetting('this month', 'CURRENT_MONTH'), new CompanySetting('last month', 'LAST_MONTH'),new CompanySetting('year to date', 'YEAR_TO_DATE')];
  currentInterval = new CompanySetting('today', 'TODAY');
  dashboardTicketsBillableHours: DashboardTicketsBillableHours = new DashboardTicketsBillableHours();
  constructor(private ticketsService: TicketsService) { }

  ngOnInit() {
   this.getDashboardByServices();
  }
  getDashboardByServices() {
    this.ticketsService.getDashboardByServices(this.dashboardTicketsBillableHours.getDataForRequest()).subscribe(data => {
      this.dashboardTicketsBillableHours.setData(data);
      this.onTicketsBillableHoursIsReady.emit(null);
      console.log('this.dashboardTicketsBillableHours',this.dashboardTicketsBillableHours);
    }, (err) => {
      this.onTicketsBillableHoursIsReady.emit(null);
    })
  }
  onSelectInterval(item) {
    this.currentInterval = item;
    this.dashboardTicketsBillableHours.onSetDates(item.value);
   // this.showPreloader = true;
    this.getDashboardByServices();
  }

}
