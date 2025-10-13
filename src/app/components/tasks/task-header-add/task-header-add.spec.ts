import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanySetting } from 'src/app/components/companies/class/company-setting';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { DatePickerModule } from '../../shared/date-picker/date-picker.module';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { MultiDatepickerModule } from '../../shared/multi-datepicker/multi-datepicker.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { TechUsersModule } from '../../shared/tech-users/tech-users.module';
import { TasksDatePickerModule } from '../tasks-date-picker/tasks-date-picker.module';
import { TaskHeaderAddTypeModule } from './task-header-add-type/task-header-add-type.module';
import { TaskHeaderAddTypeComponent } from './task-header-add-type/task-header-add-type.component';


describe('TaskHeaderAddTypeComponent unit test', () => {
  let component: TaskHeaderAddTypeComponent;
  let fixture: ComponentFixture<TaskHeaderAddTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        DropDownModule,
        TechUsersModule,
        DatePickerModule,
        MultiDatepickerModule,
        ReactiveFormsModule,
        NgbModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        TasksDatePickerModule,
        TaskHeaderAddTypeModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [TaskHeaderAddTypeComponent
      ]
    }).compileComponents();

  });

  it('check "toggleStatus"', () => {
    const fixture = TestBed.createComponent(TaskHeaderAddTypeComponent);
    const com = fixture.debugElement.componentInstance;
    com.initModelForm();
    com.toggleStatus();
    expect(com.modelForm.controls["taskStatus"].value).toEqual("CLOSED");
  });
  it('check "onSelectType"', () => {
    const fixture = TestBed.createComponent(TaskHeaderAddTypeComponent);
    const com = fixture.debugElement.componentInstance;
    com.initModelForm();
    com.onSelectType(null);
    expect(com.modelForm.controls["type"].value).toEqual(null);
  });

});