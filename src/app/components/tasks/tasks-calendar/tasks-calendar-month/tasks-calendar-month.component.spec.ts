import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TaskHeaderAddComponent } from '../../task-header-add/task-header-add.component';
import { TasksCalendarMonthComponent } from './tasks-calendar-month.component';
import { TasksCalendarMonthItemWeekComponent } from './tasks-calendar-month-item-week/tasks-calendar-month-item-week.component';


describe('TasksCalendarMonthComponent unit test', () => {
  let component: TasksCalendarMonthComponent;
  let fixture: ComponentFixture<TasksCalendarMonthComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [FormsModule,
        CommonModule,
        NgbModule,
        HttpClientModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 5000,
            onActivateTick: true
        }),
        NoopAnimationsModule, TasksCalendarMonthComponent,
        TasksCalendarMonthItemWeekComponent,
        TaskHeaderAddComponent]
}).compileComponents();

  });


});