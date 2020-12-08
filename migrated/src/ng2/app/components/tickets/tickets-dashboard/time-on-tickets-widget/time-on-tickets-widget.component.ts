import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TicketsDashboardService } from 'src/ng2/app/services/tickets-dashboard/tickets-dashboard.service';
import { CompanySetting } from '../../../companies/class/company-setting';
import { DashboardTicketsTime } from '../class/dashboard-tickets-time';

@Component({
  selector: 'app-time-on-tickets-widget',
  templateUrl: './time-on-tickets-widget.component.html',
  styleUrls: ['./time-on-tickets-widget.component.scss']
})
export class TimeOnTicketsWidgetComponent implements OnInit {
  dashboardTicketsTime: DashboardTicketsTime = new DashboardTicketsTime();
  showPreloader: boolean = true;
  listIntervals = [new CompanySetting('last month', 'LAST_MONTH'), new CompanySetting('current month', 'CURRENT_MONTH'), new CompanySetting('year to date', 'YEAR_TO_DATE')];
  currentInterval = new CompanySetting('last month', 'LAST_MONTH');
  constructor(private ticketsDashboardService: TicketsDashboardService) { }

  ngOnInit() {
    this.onGetTicketsTime();
  }
  onSelectInterval(item) {
    this.currentInterval = item;
    this.dashboardTicketsTime.onSetDates(item.value);
    this.showPreloader = true;
    this.onGetTicketsTime();
  }
  onGetTicketsTime() {
    this.ticketsDashboardService.getResponseTime(this.dashboardTicketsTime.startDate, this.dashboardTicketsTime.endDate).subscribe(data => {
      this.dashboardTicketsTime.setData(data);
      this.showPreloader = false;
    })
  }

}
