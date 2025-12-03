import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TasksDashboardRoutingModule } from './tasks-dashboard-routing.module';
import { TasksDashboardComponent } from './tasks-dashboard.component';
import { TasksDashboardStatsComponent } from './tasks-dashboard-stats/tasks-dashboard-stats.component';
import { TasksDashboardMyTasksComponent } from './tasks-dashboard-my-tasks/tasks-dashboard-my-tasks.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TasksDashboardMyTasksListComponent } from './tasks-dashboard-my-tasks-list/tasks-dashboard-my-tasks-list.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TasksListItemModule } from '../tasks/tasks-list/tasks-list-item/tasks-list-item.module';
import { TasksDashboardMyCalendarComponent } from './tasks-dashboard-my-calendar/tasks-dashboard-my-calendar.component';
import { TasksDashboardMyCalendarItemComponent } from './tasks-dashboard-my-calendar/tasks-dashboard-my-calendar-item/tasks-dashboard-my-calendar-item.component';


@NgModule({
    declarations: [TasksDashboardComponent, TasksDashboardStatsComponent, TasksDashboardMyTasksComponent, TasksDashboardMyTasksListComponent, TasksDashboardMyCalendarComponent, TasksDashboardMyCalendarItemComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        TasksDashboardRoutingModule,
        NgbModule,
        InfiniteScrollModule,
        TasksListItemModule
    ],

})
export class TasksDashboardModule { }
