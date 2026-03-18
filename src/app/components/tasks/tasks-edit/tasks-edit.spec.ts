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
import { ClickOutsideModule } from 'ng4-click-outside';
import { TasksAddAssignedUsersModule } from '../tasks-add/tasks-add-assigned-users/tasks-add-assigned-users.module';
import { TasksAddAssociateTicketsModule } from '../tasks-add/tasks-add-associate-tickets/tasks-add-associate-tickets.module';
import { TasksDatePickerComponent } from '../tasks-date-picker/tasks-date-picker.component';
import { TasksDatePickerModule } from '../tasks-date-picker/tasks-date-picker.module';
import { TasksEditComponent } from './tasks-edit.component';
import { CompanySetting } from '../../companies/class/company-setting';
import { HttpClientTestingModule } from '@angular/common/http/testing';


describe('TasksEditComponent unit test', () => {
  let component: TasksEditComponent;
  let fixture: ComponentFixture<TasksEditComponent>;

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
        ClickOutsideModule,
        ClickOutsideModule,
        HttpClientModule,
        HttpClientTestingModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [TasksEditComponent
      ]
    }).compileComponents();

  });

  it('check "onKeyDown"', () => {
    const fixture = TestBed.createComponent(TasksEditComponent);
    const com = fixture.debugElement.componentInstance;
    com.onKeyDown({ keyCode: 11 })
    expect(com.isInitTitle).toEqual(true);
  });
  it('check "setAssociatedTicketId"', () => {
    const fixture = TestBed.createComponent(TasksEditComponent);
    const com = fixture.debugElement.componentInstance;
    com.ngOnInit();
    com.setAssociatedTicketId({ id: "test" })
    expect(com.modelForm.controls["associatedTicketId"].value).toEqual("test");
  });
  it('check "onSelectTechUser"', () => {
    const fixture = TestBed.createComponent(TasksEditComponent);
    const com = fixture.debugElement.componentInstance;
    com.ngOnInit();
    com.onSelectTechUser([{ id: "test" }])
    expect(com.selectedAssignedUsers).toEqual([{ id: "test" }]);
  });
  it('check "onSelectType"', () => {
    const fixture = TestBed.createComponent(TasksEditComponent);
    const com = fixture.debugElement.componentInstance;
    com.ngOnInit();
    com.onSelectType(new CompanySetting('Meeting', 'Meeting'))
    expect(com.modelForm.controls["type"].value).toEqual("Meeting");
  });
  it('check "filterByDate"', () => {
    const fixture = TestBed.createComponent(TasksEditComponent);
    const com = fixture.debugElement.componentInstance;
    com.ngOnInit();
    com.filterByDate({ start: 1, end: 2 });
    expect(com.modelForm.controls["startDate"].value).toEqual(1);
    expect(com.modelForm.controls["endDate"].value).toEqual(2);
  });
  it('check "onFocusDescription"', () => {
    const fixture = TestBed.createComponent(TasksEditComponent);
    const com = fixture.debugElement.componentInstance;
    com.onFocusDescription();
    expect(com.isInitEditNote).toEqual(true);
  });


});