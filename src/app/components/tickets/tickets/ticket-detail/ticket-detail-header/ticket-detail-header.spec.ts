import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { DeviceCompany } from 'src/app/components/company-devices/class/device-company';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TicketDetailHeaderComponent } from './ticket-detail-header.component';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';

describe('TicketDetailHeaderComponent unit test', () => {
  let component: TicketDetailHeaderComponent;
  let fixture: ComponentFixture<TicketDetailHeaderComponent>;

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
      declarations: [TicketDetailHeaderComponent
      ]
    }).compileComponents();

  });

  it('check "getDataForClose"', () => {
    const fixture = TestBed.createComponent(TicketDetailHeaderComponent);
    const com = fixture.debugElement.componentInstance;
    com.ticketProfile.id = "123";
    expect(com.getDataForClose()).toEqual({
      note: "Ticket has been closed",
      type: "NOTE",
      noteType: "PUBLIC",
      shares: [],
      ticket: { id: "123" },
      attachments: []
    })
  });
  it('check "parseDate"', () => {
    const fixture = TestBed.createComponent(TicketDetailHeaderComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.parseDate(10)).toEqual(10)
  });
});