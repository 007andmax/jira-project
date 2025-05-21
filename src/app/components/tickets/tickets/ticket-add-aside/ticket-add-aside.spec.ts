import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatChipListModule } from 'src/app/components/shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from 'src/app/components/shared/mat-chip/mat-chip.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { MatFormFieldModule } from 'src/app/components/shared/mat-form-field/mat-form-field.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { DynamicTooltipModule } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.module';
import { CompanyDropDownModule } from 'src/app/components/shared/company-drop-down/company-drop-down.module';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';
import { TechUsersModule } from 'src/app/components/shared/tech-users/tech-users.module';
import { UploadAreaProgressModule } from 'src/app/components/shared/upload-area/upload-area-progress/upload-area-progress.module';
import { UploadAreaModule } from 'src/app/components/shared/upload-area/upload-area.module';
import { UsersDropDownModule } from 'src/app/components/shared/users-drop-down/users-drop-down.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { AssignedTicketUserModule } from './assigned-ticket-user/assigned-ticket-user.module';
import { CompanyUsersDropDownModule } from './company-users-drop-down/company-users-drop-down.module';
import { PriorityLevelDropDownComponent } from './priority-level-drop-down/priority-level-drop-down.component';
import { TicketAddAsideComponent } from './ticket-add-aside.component';

describe('TicketAddAsideComponent unit test', () => {
  let component: TicketAddAsideComponent;
  let fixture: ComponentFixture<TicketAddAsideComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        MatFormFieldModule,
        FormsModule,
        DropDownModule,
        TechUsersModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        UploadAreaProgressModule,
        NgbModule,
        UploadAreaModule,
        CompanyDropDownModule,
        DynamicTooltipModule,
        CompanyUsersDropDownModule,
        AssignedTicketUserModule,
        MatErrorModule,
        UsersDropDownModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [TicketAddAsideComponent, PriorityLevelDropDownComponent
      ]
    }).compileComponents();

  });

  it('check "getPriorityLevel"', () => {
    const fixture = TestBed.createComponent(TicketAddAsideComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getPriorityLevel()).toEqual("");
  });

  it('check "onSelectDevice"', () => {
    const fixture = TestBed.createComponent(TicketAddAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSelectDevice({ deviceId: "test" });
    expect(com.ticketAdd.linkedAgentId).toEqual("test");
  });

  it('check "setPriorityLevel"', () => {
    const fixture = TestBed.createComponent(TicketAddAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.setPriorityLevel({ id: "test" });
    expect(com.ticketAdd.priorityLevel.id).toEqual("test");
  });
  it('check "onPastNote"', () => {
    const fixture = TestBed.createComponent(TicketAddAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.onPastNote("test");
    expect(com.ticketAdd.note).toEqual("test");
  });
  it('check "onChangeNote"', () => {
    const fixture = TestBed.createComponent(TicketAddAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.onChangeNote({ target: { innerHTML: "123" } });
    expect(com.ticketAdd.note).toEqual("123");
  });
});