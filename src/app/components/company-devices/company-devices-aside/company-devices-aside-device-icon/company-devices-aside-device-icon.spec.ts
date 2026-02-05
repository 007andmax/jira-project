import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { PreviewPhoneMaskModule } from 'src/app/components/shared/preview-phone-mask/preview-phone-mask.module';
import { CompanyDevicesAsideDeviceIconComponent } from './company-devices-aside-device-icon.component';


describe('CompanyDevicesAsideDeviceIconComponent unit test', () => {
  let component: CompanyDevicesAsideDeviceIconComponent;
  let fixture: ComponentFixture<CompanyDevicesAsideDeviceIconComponent>;

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
      declarations: [CompanyDevicesAsideDeviceIconComponent
      ],
    }).compileComponents();

  });
  it('check "isArchive"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesAsideDeviceIconComponent);
    const com = fixture.debugElement.componentInstance;
    com.device = { label: "Test Label", hostName: "Test Host" } as any;
    expect(com.isLabel()).toEqual(true);
    com.device = { label: "Test Label", hostName: "Test Label" } as any;
    expect(com.isLabel()).toEqual(false);
  });
  it('check "getTextForTooltip"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesAsideDeviceIconComponent);
    const com = fixture.debugElement.componentInstance;
    com.device = { label: "Test Label", hostName: "Test Host", ip: "192.168.1.1" } as any;
    expect(com.getTextForTooltip()).toEqual("Test Label");
    com.device = { label: "Test Label", hostName: "Test Host", ip: "192.168.1.1" } as any;
    expect(com.getTextForTooltip()).toEqual("Test Label");
  });
  it('check "getFieldForCheckIcon"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesAsideDeviceIconComponent);
    const com = fixture.debugElement.componentInstance;
    com.device = { iconName: "icon-test" } as any;
    expect(com.getFieldForCheckIcon()).toEqual("icon-test");
    com.customDevice = { type: "custom-type" } as any;
    expect(com.getFieldForCheckIcon()).toEqual("icon-test");
  });
});