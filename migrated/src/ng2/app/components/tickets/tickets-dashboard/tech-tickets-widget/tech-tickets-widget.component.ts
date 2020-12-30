import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TicketsService } from 'src/ng2/app/services/tickets/tickets.service';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { DashboardTechTickets } from '../class/dashboard-tech-tickets';

@Component({
  selector: 'app-tech-tickets-widget',
  templateUrl: './tech-tickets-widget.component.html',
  styleUrls: ['./tech-tickets-widget.component.scss']
})
export class TechTicketsWidgetComponent implements OnInit {
  techTickets: DashboardTechTickets = new DashboardTechTickets();
  showPreloader: boolean = true;
  @Output() onTechTicketsIsReady = new EventEmitter<any>();
  constructor(private ticketsService: TicketsService,
    private usersStateService: UsersStateService,) { }

  ngOnInit() {
    this.techTickets.onDayDashboard();
    this.getDashboardByServices();
  }
  onChangeType() {
    this.showPreloader = true;
    if (this.techTickets.sort.toUpperCase() === "DAY") this.techTickets.onDayDashboard();
    if (this.techTickets.sort.toUpperCase() === "MONTH") this.techTickets.onMonthDashboard();
    this.getDashboardByServices();
  }
  public getUserName(userId) {
    let user = this.usersStateService.getAllUsers().find(item => item.id === userId);
    return (user) ? `${user.firstName} ${user.lastName}` : '';
  }
  getDashboardByServices() {
    this.ticketsService.getDashboardByTech(this.techTickets.startDate, this.techTickets.endDate).subscribe(data => {
      this.techTickets.setData(data);
      this.onTechTicketsIsReady.emit(null);
      this.showPreloader = false;
    }, (err) => {
      this.onTechTicketsIsReady.emit(null);
      this.showPreloader = false;
    })
  }

}
