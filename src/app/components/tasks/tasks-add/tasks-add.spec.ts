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
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { ServicesListModule } from '../../shared/services-list/services-list.module';
import { UploadAreaProgressModule } from '../../shared/upload-area/upload-area-progress/upload-area-progress.module';
import { TasksDatePickerModule } from '../tasks-date-picker/tasks-date-picker.module';
import { TasksAddAssignedUsersModule } from './tasks-add-assigned-users/tasks-add-assigned-users.module';
import { TasksAddAssociateTicketsComponent } from './tasks-add-associate-tickets/tasks-add-associate-tickets.component';
import { TasksAddAssociateTicketsModule } from './tasks-add-associate-tickets/tasks-add-associate-tickets.module';
import { TasksAddComponent } from './tasks-add.component';
import { CompanySetting } from '../../companies/class/company-setting';


describe('TasksAddComponent unit test', () => {
  let component: TasksAddComponent;
  let fixture: ComponentFixture<TasksAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        MatErrorModule,
        CompanyDropDownModule,
        TasksAddAssignedUsersModule,
        ServicesListModule,
        DropDownModule,
        TasksDatePickerModule,
        DatePickerModule,
        PreloaderTicketModule,
        UploadAreaProgressModule,
        NgbModule,
        AngularEditorModule,
        TasksAddAssociateTicketsModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [TasksAddComponent
      ]
    }).compileComponents();

  });

  it('check "setAssociatedTicketId"', () => {
    const fixture = TestBed.createComponent(TasksAddComponent);
    const com = fixture.debugElement.componentInstance;
    com.ngOnInit();
    com.setAssociatedTicketId({ id: "test" })
    expect(com.modelForm.controls["associatedTicketId"].value).toEqual("test");
  });
  it('check "onSelectType"', () => {
    const fixture = TestBed.createComponent(TasksAddComponent);
    const com = fixture.debugElement.componentInstance;
    com.ngOnInit();
    com.onSelectType(new CompanySetting('Meeting', 'Meeting'))
    expect(com.modelForm.controls["type"].value).toEqual("Meeting");
  });
  it('check "filterByDate"', () => {
    const fixture = TestBed.createComponent(TasksAddComponent);
    const com = fixture.debugElement.componentInstance;
    com.ngOnInit();
    com.filterByDate({ start: 1, end: 2 });
    expect(com.modelForm.controls["startDate"].value).toEqual(1);
    expect(com.modelForm.controls["endDate"].value).toEqual(2);
  });
  it('check "formatBytes"', () => {
    const fixture = TestBed.createComponent(TasksAddComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.formatBytes(1024)).toEqual("1 KB");
  });
});