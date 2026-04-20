import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { UsersDetailsTabMessagesFullBodyComponent } from './users-details-tab-messages-full-body.component';
import { FormsModule } from '@angular/forms';
import { TicketProfileAttachmentsComponent } from 'src/app/components/tickets/tickets/ticket-edit-aside/ticket-profile-attachments/ticket-profile-attachments.component';

describe('UsersDetailsTabMessagesFullBodyComponent unit test', () => {
  let component: UsersDetailsTabMessagesFullBodyComponent;
  let fixture: ComponentFixture<UsersDetailsTabMessagesFullBodyComponent>;

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
        NoopAnimationsModule, UsersDetailsTabMessagesFullBodyComponent,
        TicketProfileAttachmentsComponent]
}).compileComponents();

  });

  it('check "getCountUsers"', () => {
    const fixture = TestBed.createComponent(UsersDetailsTabMessagesFullBodyComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getCountUsers()).toEqual('');
  });
  it('check "getUserName"', () => {
    const fixture = TestBed.createComponent(UsersDetailsTabMessagesFullBodyComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getUserName({ firstName: "test", lastName: "123" })).toEqual('test 123');
  });
  it('check "close"', () => {
    const fixture = TestBed.createComponent(UsersDetailsTabMessagesFullBodyComponent);
    const com = fixture.debugElement.componentInstance;
    com.opened = true;
    com.close();
    expect(com.opened).toEqual(false);
  });
});