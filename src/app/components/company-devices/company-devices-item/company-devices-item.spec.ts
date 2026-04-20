import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ClickOutsideModule } from 'ng4-click-outside';
import { KeyUpEnterModule } from 'src/app/directives/key-up-enter/key-up-enter.module';
import { CompanyDevicesItemComponent } from './company-devices-item.component';
 

describe('CompanyDevicesItemComponent unit test', () => {
  let component: CompanyDevicesItemComponent;
  let fixture: ComponentFixture<CompanyDevicesItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommonModule,
        FormsModule,
        ClickOutsideModule,
        KeyUpEnterModule,
        HttpClientModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 5000,
            onActivateTick: true
        }),
        NoopAnimationsModule, CompanyDevicesItemComponent],
}).compileComponents();

  });
  it('check "getTextForTooltip"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesItemComponent);
    const com = fixture.debugElement.componentInstance;
     expect(com.getTextForTooltip("workstation")).toEqual('Workstation');
  });
    it('check "checkDefaultName"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesItemComponent);
    const com = fixture.debugElement.componentInstance;
     expect(com.checkDefaultName("network device")).toEqual(true);
  });
     it('check "getUserName"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesItemComponent);
    const com = fixture.debugElement.componentInstance;
     expect(com.getUserName(null)).toEqual('');
  });
  it('check "isLabel"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesItemComponent);
    const com = fixture.debugElement.componentInstance;
    com.device = {
      label: 'test',
      hostName: 'host',
    } as any;
    expect(com.isLabel()).toEqual(true);
  });
  it('check "returnTimeFormat"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesItemComponent);
    const com = fixture.debugElement.componentInstance;
      expect(com.returnTimeFormat(3600000)).toEqual({
      hours: 1,
      minutes: 0,
    });
  });
  it('check "returnTimeFormatUpTime"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesItemComponent);
    const com = fixture.debugElement.componentInstance;
      expect(com.returnTimeFormatUpTime(3600000)).toEqual({
        days: 0,
    hours: 1,
    minutes: 0,
    });
  });
  it('check "getWindows"', () => {
  const fixture = TestBed.createComponent(CompanyDevicesItemComponent);
  const com = fixture.debugElement.componentInstance;
  com.device = {
    system: {
      caption: "test",
      releaseId: "123"
    }
  };
    expect(com.getWindows()).toEqual('test 123');
});
});