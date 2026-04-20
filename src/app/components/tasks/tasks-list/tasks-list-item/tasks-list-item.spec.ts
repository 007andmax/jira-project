import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerModule } from 'src/app/components/shared/date-picker/date-picker.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { TechUsersModule } from 'src/app/components/shared/tech-users/tech-users.module';
import { TasksDatePickerModule } from '../../tasks-date-picker/tasks-date-picker.module';
import { TasksListItemComponent } from './tasks-list-item.component';



describe('TasksListItemComponent unit test', () => {
  let component: TasksListItemComponent;
  let fixture: ComponentFixture<TasksListItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommonModule,
        FormsModule,
        DropDownModule,
        TechUsersModule,
        DatePickerModule,
        NgbModule,
        TasksDatePickerModule,
        HttpClientModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 5000,
            onActivateTick: true
        }),
        NoopAnimationsModule, TasksListItemComponent]
}).compileComponents();

  });

  it('check "filterByDate"', () => {
    const fixture = TestBed.createComponent(TasksListItemComponent);
    const com = fixture.debugElement.componentInstance;
    com.filterByDate({ start: 1, end: 2 })
    expect(com.item.startDate).toEqual(1);
    expect(com.item.endDate).toEqual(2);
  });
  it('check "onChangeUser"', () => {
    const fixture = TestBed.createComponent(TasksListItemComponent);
    const com = fixture.debugElement.componentInstance;
    com.onChangeUser([{ id: 1 }, { id: 2 }])
    expect(com.assignedUsers).toEqual([{ id: 1 }, { id: 2 }]);
  });


});