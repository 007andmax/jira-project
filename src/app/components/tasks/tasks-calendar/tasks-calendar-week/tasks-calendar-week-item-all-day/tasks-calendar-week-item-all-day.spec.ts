import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TasksCalendarWeekItemAllDayComponent } from './tasks-calendar-week-item-all-day.component';


describe('TasksCalendarWeekItemAllDayComponent unit test', () => {
  let component: TasksCalendarWeekItemAllDayComponent;
  let fixture: ComponentFixture<TasksCalendarWeekItemAllDayComponent>;

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
        NoopAnimationsModule, TasksCalendarWeekItemAllDayComponent]
}).compileComponents();

  });
  it('check "setShowMore"', () => {
    const fixture = TestBed.createComponent(TasksCalendarWeekItemAllDayComponent);
    const com = fixture.debugElement.componentInstance;
    com.setShowMore(true);
    expect(com.showMore).toEqual(true);

  });

});