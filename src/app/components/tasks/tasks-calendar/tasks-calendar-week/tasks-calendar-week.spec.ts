import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TasksCalendarWeekItemHourComponent } from './tasks-calendar-week-item-hour/tasks-calendar-week-item-hour.component';
import { TasksCalendarWeekComponent } from './tasks-calendar-week.component';


describe('TasksCalendarWeekComponent unit test', () => {
  let component: TasksCalendarWeekComponent;
  let fixture: ComponentFixture<TasksCalendarWeekComponent>;

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
        NoopAnimationsModule],
      declarations: [TasksCalendarWeekComponent,
        TasksCalendarWeekItemHourComponent
      ]
    }).compileComponents();

  });
  it('check "isCurrentDay"', () => {
    const fixture = TestBed.createComponent(TasksCalendarWeekComponent);
    const com = fixture.debugElement.componentInstance;
    com.day = { date: new Date() } as any;
    expect(com.isCurrentDay(com.day.date)).toEqual(true);
    com.day = { date: new Date(2000, 1, 1) } as any;
    expect(com.isCurrentDay(com.day.date)).toEqual(false);
  });
  it('check "isToday"', () => {
    const fixture = TestBed.createComponent(TasksCalendarWeekComponent);
    const com = fixture.debugElement.componentInstance;
    com.day = { date: new Date() } as any;
    expect(com.isToday(com.day.date)).toEqual(true);
    com.day = { date: new Date(2000, 1, 1) } as any;
    expect(com.isToday(com.day.date)).toEqual(false);
  });

});