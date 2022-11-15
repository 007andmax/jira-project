import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketsDashboardComponent } from './tickets-dashboard.component';
import { DashboardStatsModule } from '../../billing/dashboard-billing/dashboard-stats/dashboard-stats.module';
import { TicketsAnalyticsWidgetComponent } from './tickets-analytics-widget/tickets-analytics-widget.component';
import { TicketPriorityWidgetComponent } from './ticket-priority-widget/ticket-priority-widget.component';
import { RecurringTicketWidgetComponent } from './recurring-ticket-widget/recurring-ticket-widget.component';
import { TimeOnTicketsWidgetComponent } from './time-on-tickets-widget/time-on-tickets-widget.component';
import { TicketsBillableHoursWidgetComponent } from './tickets-billable-hours-widget/tickets-billable-hours-widget.component';
import { TechTicketsWidgetComponent } from './tech-tickets-widget/tech-tickets-widget.component';
import { NvD3Module } from 'ng2-nvd3';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { TicketsDashboardRoutingModule } from './tickets-dashboard-routing.module';




@NgModule({
    declarations: [TicketsDashboardComponent,
        TicketsAnalyticsWidgetComponent,
        TicketPriorityWidgetComponent,
        RecurringTicketWidgetComponent,
        TimeOnTicketsWidgetComponent,
        TicketsBillableHoursWidgetComponent,
        TechTicketsWidgetComponent

    ],
    imports: [
        CommonModule,
        DashboardStatsModule,
        NvD3Module,
        NgbModule,
        FormsModule,
        TicketsDashboardRoutingModule
    ],



})
export class TicketsDashboardModule { }
