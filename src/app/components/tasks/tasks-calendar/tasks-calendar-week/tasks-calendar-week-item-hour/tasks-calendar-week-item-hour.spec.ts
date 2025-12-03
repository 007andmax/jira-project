import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TasksCalendarWeekItemHourComponent } from './tasks-calendar-week-item-hour.component';


describe('TasksCalendarWeekItemHourComponent unit test', () => {
  let component: TasksCalendarWeekItemHourComponent;
  let fixture: ComponentFixture<TasksCalendarWeekItemHourComponent>;

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
      declarations: [TasksCalendarWeekItemHourComponent,
      ]
    }).compileComponents();

  });

  it('check "isStartOfHour"', () => {
    const fixture = TestBed.createComponent(TasksCalendarWeekItemHourComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.isStartOfHour(new Date(2024, 5, 1, 10, 0, 0), 10)).toEqual(true);
  });
  it('check "getListStartOfHour"', () => {
    const fixture = TestBed.createComponent(TasksCalendarWeekItemHourComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getListStartOfHour()).toEqual([]);
  });
});