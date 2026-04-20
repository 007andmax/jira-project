import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { DeviceCompany } from 'src/app/components/company-devices/class/device-company';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { TicketDetailHeaderComponent } from '../ticket-detail-header/ticket-detail-header.component';
import { TicketDetailMessageComponent } from './ticket-detail-message.component';
import { CurrentUser } from 'src/class/current-user/current-user';

describe('TicketDetailMessageComponent unit test', () => {
  let component: TicketDetailMessageComponent;
  let fixture: ComponentFixture<TicketDetailMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommonModule,
        HttpClientModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 5000,
            onActivateTick: true
        }),
        NgbModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        NoopAnimationsModule],
    declarations: [TicketDetailMessageComponent]
}).compileComponents();

  });

  it('check "getUserName"', () => {
    const fixture = TestBed.createComponent(TicketDetailMessageComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getUserName()).toEqual("")
  });
  it('check "reset"', () => {
    const fixture = TestBed.createComponent(TicketDetailMessageComponent);
    const com = fixture.debugElement.componentInstance;
    com.reset();
    expect(com.isClaimTicket).toEqual(false)
    expect(com.isMarkAsOpen).toEqual(false)
  });
  it('check "markAsOpen"', () => {
    const fixture = TestBed.createComponent(TicketDetailMessageComponent);
    const com = fixture.debugElement.componentInstance;
    com.markAsOpen();
    expect(com.isMarkAsOpen).toEqual(true)
  });
  it('check "getSpamMessages"', () => {
    const fixture = TestBed.createComponent(TicketDetailMessageComponent);
    const com = fixture.debugElement.componentInstance;
    com.currentUser = new CurrentUser({ id: "test" });
    expect(com.getSpamMessages("123", "MARK")).toEqual("has marked it as spam. You can restore the ticket status anytime, using the respective option.")
    expect(com.getSpamMessages("123", "")).toEqual("has reported it as spam. You can restore the ticket status anytime, using the respective option.")

  });
});