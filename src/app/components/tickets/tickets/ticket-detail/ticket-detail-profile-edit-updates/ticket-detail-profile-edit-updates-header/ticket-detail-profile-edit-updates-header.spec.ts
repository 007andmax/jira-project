import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { DeviceCompany } from 'src/app/components/company-devices/class/device-company';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TicketDetailProfileEditUpdatesHeaderComponent } from './ticket-detail-profile-edit-updates-header.component';
import { TicketDetailHeaderComponent } from '../../ticket-detail-header/ticket-detail-header.component';

describe('TicketDetailProfileEditUpdatesHeaderComponent unit test', () => {
  let component: TicketDetailProfileEditUpdatesHeaderComponent;
  let fixture: ComponentFixture<TicketDetailProfileEditUpdatesHeaderComponent>;

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
        NoopAnimationsModule, TicketDetailProfileEditUpdatesHeaderComponent]
}).compileComponents();

  });

  it('check "getUserName"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileEditUpdatesHeaderComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getUserName({ firstName: "test", lastName: "123" })).toEqual("test 123")
  });
});