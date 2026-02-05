import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { PreviewPhoneMaskModule } from 'src/app/components/shared/preview-phone-mask/preview-phone-mask.module';
import { CompanyDevicesAsideNetworkTabComponent } from './company-devices-aside-network-tab.component';


describe('CompanyDevicesAsideNetworkTabComponent unit test', () => {
  let component: CompanyDevicesAsideNetworkTabComponent;
  let fixture: ComponentFixture<CompanyDevicesAsideNetworkTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        NgbModule,
        PreviewPhoneMaskModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [CompanyDevicesAsideNetworkTabComponent
      ],
    }).compileComponents();

  });
  it('check "refresh"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesAsideNetworkTabComponent);
    const com = fixture.debugElement.componentInstance;
    com.refresh({ ip: "192.168.1.1" });
    expect(com.customDevice.ip).toEqual("192.168.1.1");
  });
  it('check "chackDefaultValue"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesAsideNetworkTabComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.chackDefaultValue()).toEqual("N\A");
  });
  it('check "formatMacAddress"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesAsideNetworkTabComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.formatMacAddress()).toEqual("N/A");
  });
});