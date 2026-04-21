import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { TicketDetailDevicesItemComponent } from './ticket-detail-devices-item.component';
import { DeviceCompany } from 'src/app/components/company-devices/class/device-company';

describe('TicketDetailDevicesItemComponent unit test', () => {
  let component: TicketDetailDevicesItemComponent;
  let fixture: ComponentFixture<TicketDetailDevicesItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommonModule,
        HttpClientModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 5000,
            onActivateTick: true
        }),
        NoopAnimationsModule, TicketDetailDevicesItemComponent]
}).compileComponents();

  });

  it('check "returnTimeFormat"', () => {
    const fixture = TestBed.createComponent(TicketDetailDevicesItemComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.returnTimeFormat(3600000)).toEqual({
      hours: 1,
      minutes: 0,
    })
  });
  it('check "returnTimeFormat"', () => {
    const fixture = TestBed.createComponent(TicketDetailDevicesItemComponent);
    const com = fixture.debugElement.componentInstance;
    com.device = new DeviceCompany({ isCustom: true, name: "test", tags: [] }, "123");
    expect(com.getLabelForEdit()).toEqual("test")
  });
  it('check "returnTimeFormat"', () => {
    const fixture = TestBed.createComponent(TicketDetailDevicesItemComponent);
    const com = fixture.debugElement.componentInstance;
    com.device = new DeviceCompany({ label: "label", tags: [] }, "123");
    expect(com.getLabelForEdit()).toEqual("label")
  });
  it('check "returnTimeFormat"', () => {
    const fixture = TestBed.createComponent(TicketDetailDevicesItemComponent);
    const com = fixture.debugElement.componentInstance;
    com.device = new DeviceCompany({ hostName: "hostName", tags: [] }, "123");
    expect(com.getLabelForEdit()).toEqual("hostName")
  });
  it('check "getTimeStatus"', () => {
    const fixture = TestBed.createComponent(TicketDetailDevicesItemComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getTimeStatus(86400000)).toEqual("(1 day )")
  });
});