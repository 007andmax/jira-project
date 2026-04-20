import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketsDashboardComponent } from './tickets-dashboard.component';

import { TicketsAnalyticsWidgetComponent } from './tickets-analytics-widget/tickets-analytics-widget.component';
import { TicketPriorityWidgetComponent } from './ticket-priority-widget/ticket-priority-widget.component';
import { RecurringTicketWidgetComponent } from './recurring-ticket-widget/recurring-ticket-widget.component';
import { TimeOnTicketsWidgetComponent } from './time-on-tickets-widget/time-on-tickets-widget.component';
import { TicketsBillableHoursWidgetComponent } from './tickets-billable-hours-widget/tickets-billable-hours-widget.component';
import { TechTicketsWidgetComponent } from './tech-tickets-widget/tech-tickets-widget.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { TicketsDashboardRoutingModule } from './tickets-dashboard-routing.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';




@NgModule({
    imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    TicketsDashboardRoutingModule,
    NgxChartsModule,
    TicketsDashboardComponent,
    TicketsAnalyticsWidgetComponent,
    TicketPriorityWidgetComponent,
    RecurringTicketWidgetComponent,
    TimeOnTicketsWidgetComponent,
    TicketsBillableHoursWidgetComponent,
    TechTicketsWidgetComponent
],
})
export class TicketsDashboardModule { }
