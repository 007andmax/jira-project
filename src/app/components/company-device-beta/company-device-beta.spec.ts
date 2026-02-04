import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { CompanyDashboardComponent } from '../company-dashboard/company-dashboard.component';
import { ReportSendEmailModule } from '../reports/report-additional-actions/report-send-email/report-send-email.module';
import { DatePickerModule } from '../shared/date-picker/date-picker.module';
import { DropDownModule } from '../shared/drop-down/drop-down.module';
import { DynamicTooltipModule } from '../shared/dynamic-tooltip/dynamic-tooltip.module';
import { MatChipListModule } from '../shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from '../shared/mat-chip/mat-chip.module';
import { MatFormFieldModule } from '../shared/mat-form-field/mat-form-field.module';
import { MatOptionModule } from '../shared/mat-option/mat-option.module';
import { CompanyDeviceBetaRoutingModule } from './company-device-beta-routing.module';
import { CompanyDeviceBetaComponent } from './company-device-beta.component';
import { DeviceBeta } from 'src/app/pipe/device-beta.pipe';
declare var jasmine;
const mockRouter = {
  navigate: jasmine.createSpy('navigate'),
  routerState: {
    root: {}
  },
  events: of(),
};

describe('CompanyDashboardComponent unit test', () => {
  let component: CompanyDashboardComponent;
  let fixture: ComponentFixture<CompanyDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        CompanyDeviceBetaRoutingModule,
        DropDownModule,
        DatePickerModule,
        ReactiveFormsModule,
        FormsModule,
        DynamicTooltipModule,
        NgbModule,
        DisabledBtnModule,
        ReportSendEmailModule,
        MatChipModule,
        MatFormFieldModule,
        MatChipListModule,
        MatOptionModule,
        HttpClientModule,
        RouterTestingModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      providers: [{ provide: Router, useValue: mockRouter }],
      declarations: [CompanyDeviceBetaComponent,
        DeviceBeta
      ],
    }).compileComponents();

  });
  it('check "isArchive"', () => {
    const fixture = TestBed.createComponent(CompanyDeviceBetaComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.parseTitleAndName({ title: "Test Title" })).toEqual(undefined);
  });
  it('check "getCountSelected"', () => {
    const fixture = TestBed.createComponent(CompanyDeviceBetaComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getCountSelected()).toEqual(0);
  });
  it('check "toogleDevices"', () => {
    const fixture = TestBed.createComponent(CompanyDeviceBetaComponent);
    const com = fixture.debugElement.componentInstance;
    com.toogleDevices(false);
    expect(com.selectedAssetList).toEqual([]);
  });
  it('check "menuclose"', () => {
    const fixture = TestBed.createComponent(CompanyDeviceBetaComponent);
    const com = fixture.debugElement.componentInstance;
    com.menuclose();
    expect(com.open).toEqual(false);
    expect(com.device_beta_resize).toEqual(false);
  });
  it('check "getVersion"', () => {
    const fixture = TestBed.createComponent(CompanyDeviceBetaComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getVersion("")).toEqual(", No version");
  });
  it('check "chackDefaultValue"', () => {
    const fixture = TestBed.createComponent(CompanyDeviceBetaComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.chackDefaultValue("")).toEqual("N/A");
  });
  it('check "getLinkSpeed"', () => {
    const fixture = TestBed.createComponent(CompanyDeviceBetaComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getLinkSpeed(undefined)).toEqual(0);
  });
  it('check "formatMacAddress"', () => {
    const fixture = TestBed.createComponent(CompanyDeviceBetaComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.formatMacAddress(undefined)).toEqual('N/A');
  });
  it('check "serviceClass"', () => {
    const fixture = TestBed.createComponent(CompanyDeviceBetaComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.serviceClass(true, true)).toEqual({ updated: true, alert: true });
  });
  it('check "getDeviceName"', () => {
    const fixture = TestBed.createComponent(CompanyDeviceBetaComponent);
    const com = fixture.debugElement.componentInstance;
    com.getDeviceName("Device 1");
    expect(com.deviceTypId).toEqual("Device 1");
  });
  it('check "onSelectTag"', () => {
    const fixture = TestBed.createComponent(CompanyDeviceBetaComponent);
    const com = fixture.debugElement.componentInstance;
    com.asset = { ID: 1, Name: "Device 1" };
    com.onSelectTag({ ID: 1, Name: "Device 1" });
    expect(com.selectId).toEqual([1]);
  });
  it('check "onSelectCompanyName"', () => {
    const fixture = TestBed.createComponent(CompanyDeviceBetaComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSelectCompanyName(null);
    expect(com.companyDeviceSelect).toEqual(null);
  });
  it('check "onLinkDeviceSelectTag"', () => {
    const fixture = TestBed.createComponent(CompanyDeviceBetaComponent);
    const com = fixture.debugElement.componentInstance;
    com.onLinkDeviceSelectTag({ ID: 1, Name: "Device 1" });
    expect(com.linkDevicesFilterValue).toEqual("");
  });
  it('check "getclear"', () => {
    const fixture = TestBed.createComponent(CompanyDeviceBetaComponent);
    const com = fixture.debugElement.componentInstance;
    com.getclear();
    expect(com.deviceName).toEqual("");
    expect(com.assetTagName).toEqual("");
  });
  it('check "onSelectSecurityDevice"', () => {
    const fixture = TestBed.createComponent(CompanyDeviceBetaComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSelectSecurityDevice();
    expect(com.selectAllSecurityDevices).toEqual(true);
  });
  it('check "getSecurityCountSelected"', () => {
    const fixture = TestBed.createComponent(CompanyDeviceBetaComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getSecurityCountSelected()).toEqual(0);
  });
});