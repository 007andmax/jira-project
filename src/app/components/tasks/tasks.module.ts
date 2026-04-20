import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksComponent } from './tasks.component';
import { TasksRoutingModule } from './tasks-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TasksHeaderComponent } from './tasks-header/tasks-header.component';
import { TasksAddComponent } from './tasks-add/tasks-add.component';
import { TasksAddAssignedUsersComponent } from './tasks-add/tasks-add-assigned-users/tasks-add-assigned-users.component';






import { NgbModule } from '@ng-bootstrap/ng-bootstrap';






import { AngularEditorModule } from '@kolkov/angular-editor';

import { TasksListComponent } from './tasks-list/tasks-list.component';
import { TasksTabsComponent } from './tasks-tabs/tasks-tabs.component';
import { TasksListItemComponent } from './tasks-list/tasks-list-item/tasks-list-item.component';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { TasksEditComponent } from './tasks-edit/tasks-edit.component';



import { TasksCalendarComponent } from './tasks-calendar/tasks-calendar.component';
import { TasksCalendarMonthComponent } from './tasks-calendar/tasks-calendar-month/tasks-calendar-month.component';
import { TasksCalendarWeekComponent } from './tasks-calendar/tasks-calendar-week/tasks-calendar-week.component';
import { TasksCalendarMonthItemWeekComponent } from './tasks-calendar/tasks-calendar-month/tasks-calendar-month-item-week/tasks-calendar-month-item-week.component';
import { TasksCalendarWeekItemHourComponent } from './tasks-calendar/tasks-calendar-week/tasks-calendar-week-item-hour/tasks-calendar-week-item-hour.component';

import { TasksCalendarWeekItemAllDayComponent } from './tasks-calendar/tasks-calendar-week/tasks-calendar-week-item-all-day/tasks-calendar-week-item-all-day.component';


@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    TasksRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    AngularEditorModule,
    InfiniteScrollModule,
    TasksComponent, TasksHeaderComponent, TasksListComponent, TasksTabsComponent, TasksCalendarComponent, TasksCalendarMonthComponent, TasksCalendarWeekComponent, TasksCalendarMonthItemWeekComponent, TasksCalendarWeekItemHourComponent, TasksCalendarWeekItemAllDayComponent
],
})
export class TasksModule { }
