import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { AddAssignedUserNoteModule } from './add-assigned-user-note/add-assigned-user-note.module';
import { TicketDetailProfileFormUpdateHeaderComponent } from './ticket-detail-profile-form-update-header.component';

describe('TicketDetailProfileFormUpdateHeaderComponent unit test', () => {
  let component: TicketDetailProfileFormUpdateHeaderComponent;
  let fixture: ComponentFixture<TicketDetailProfileFormUpdateHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        NgbModule,
        FormsModule,
        AddAssignedUserNoteModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        })
      ],
      declarations: [TicketDetailProfileFormUpdateHeaderComponent
      ],
    }).compileComponents();

  });

  it('check "getUserName"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileFormUpdateHeaderComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getUserName({ firstName: "test", lastName: "123" })).toEqual("test 123");
  });
});