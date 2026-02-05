import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { PreviewPhoneMaskModule } from 'src/app/components/shared/preview-phone-mask/preview-phone-mask.module';
<<<<<<< HEAD
=======
import { CompanyDevicesAsideSoftwareComponent } from './company-devices-aside-software.component';
>>>>>>> QT-1398
import { CompanyDevicesAsideSystemComponent } from './company-devices-aside-system.component';


describe('CompanyDevicesAsideSystemComponent unit test', () => {
  let component: CompanyDevicesAsideSystemComponent;
  let fixture: ComponentFixture<CompanyDevicesAsideSystemComponent>;

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
      declarations: [CompanyDevicesAsideSystemComponent
      ],
    }).compileComponents();

  });
  it('check "setIsInitEditNote"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesAsideSystemComponent);
    const com = fixture.debugElement.componentInstance;
    com.setIsInitEditNote(true);
    expect(com.isInitEditNote).toEqual(true);
  });
  it('check "refresh"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesAsideSystemComponent);
    const com = fixture.debugElement.componentInstance;
    com.refresh({ name: "Device 1" });
    expect(com.customDevice.name).toEqual("Device 1");
  });
  it('check "getLabelForEdit"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesAsideSystemComponent);
    const com = fixture.debugElement.componentInstance;
<<<<<<< HEAD
    com.device = { label: "Device 1" } as any;
    expect(com.getLabelForEdit()).toEqual("Device 1");
  });
=======
    com.device = { name: "Device 1" } as any;
    expect(com.getLabelForEdit()).toEqual("Device 1");
  });
  it('check "getNetworkAdapterField"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesAsideSystemComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getNetworkAdapterField(null)).toEqual(null);
  });
>>>>>>> QT-1398
  it('check "chackDefaultValue"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesAsideSystemComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.chackDefaultValue(null)).toEqual("N\A");
  });
  it('check "getDate"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesAsideSystemComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getDate(null)).toEqual("");
  });
  it('check "getSystemField"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesAsideSystemComponent);
    const com = fixture.debugElement.componentInstance;
<<<<<<< HEAD
    com.device = {report: {system:null}};
=======
>>>>>>> QT-1398
    expect(com.getSystemField(null)).toEqual(null);
  });
  it('check "getWindowsInfo"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesAsideSystemComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getWindowsInfo()).toEqual('');
  });
  it('check "getRamSize"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesAsideSystemComponent);
    const com = fixture.debugElement.componentInstance;
<<<<<<< HEAD
    expect(com.getRamSize(0)).toEqual('0GB');
=======
    expect(com.getRamSize()).toEqual('0 GB');
>>>>>>> QT-1398
  });
});