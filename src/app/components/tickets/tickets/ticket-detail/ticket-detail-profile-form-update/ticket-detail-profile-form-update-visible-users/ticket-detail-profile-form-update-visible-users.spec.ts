import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { TicketDetailProfileFormUpdateVisibleUsersComponent } from './ticket-detail-profile-form-update-visible-users.component';

describe('TicketDetailProfileFormUpdateVisibleUsersComponent unit test', () => {
  let component: TicketDetailProfileFormUpdateVisibleUsersComponent;
  let fixture: ComponentFixture<TicketDetailProfileFormUpdateVisibleUsersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NgbModule
      ],
      declarations: [TicketDetailProfileFormUpdateVisibleUsersComponent
      ],
      providers: [FormBuilder]
    }).compileComponents();

  });

  it('check "changeType"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileFormUpdateVisibleUsersComponent);
    const com = fixture.debugElement.componentInstance;
    com.changeType(true);
    expect(com.type).toEqual("PRIVATE")
  });
});