import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { CompanyDropDownModule } from '../../shared/company-drop-down/company-drop-down.module';
import { DatePickerModule } from '../../shared/date-picker/date-picker.module';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { MatErrorModule } from '../../shared/mat-error/mat-error.module';
import { ClickOutsideModule } from 'ng4-click-outside';
import { TicketProfileUpdatesServiceTimepickerModule } from '../../tickets/tickets/ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-service-timepicker/ticket-profile-updates-service-timepicker.module';
import { TasksDatePickerComponent } from './tasks-date-picker.component';


describe('TasksDatePickerComponent unit test', () => {
  let component: TasksDatePickerComponent;
  let fixture: ComponentFixture<TasksDatePickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        ReactiveFormsModule,
        NgbModule,
        MatErrorModule,
        FormsModule,
        TicketProfileUpdatesServiceTimepickerModule,
        ClickOutsideModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [TasksDatePickerComponent
      ]
    }).compileComponents();

  });

  it('check "onToggleTimePicker"', () => {
    const fixture = TestBed.createComponent(TasksDatePickerComponent);
    const com = fixture.debugElement.componentInstance;
    com.onToggleTimePicker(false)
    expect(com.isInitCloseOutside).toEqual(false);
  });
  it('check "onChangeStartTimePickerService"', () => {
    const fixture = TestBed.createComponent(TasksDatePickerComponent);
    const com = fixture.debugElement.componentInstance;
    com.onChangeStartTimePickerService(123)
    expect(com.durationStart).toEqual(123);
  });
  it('check "onChangeEndTimePickerSerice"', () => {
    const fixture = TestBed.createComponent(TasksDatePickerComponent);
    const com = fixture.debugElement.componentInstance;
    com.onChangeEndTimePickerSerice(123)
    expect(com.durationEnd).toEqual(123);
  });
});