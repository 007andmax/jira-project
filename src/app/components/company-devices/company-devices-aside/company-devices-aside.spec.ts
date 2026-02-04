import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { PreviewPhoneMaskModule } from 'src/app/components/shared/preview-phone-mask/preview-phone-mask.module';
import { CompanyDevicesAsideUpdatesComponent } from './company-devices-aside-updates.component';
import { CompanyDevicesAsideComponent } from './company-devices-aside.component';


describe('CompanyDevicesAsideComponent unit test', () => {
  let component: CompanyDevicesAsideComponent;
  let fixture: ComponentFixture<CompanyDevicesAsideComponent>;

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
      declarations: [CompanyDevicesAsideComponent
      ],
    }).compileComponents();

  });
  it('check "getAntivirusFiled"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.setCurrentDevice({ hostName: 'test' });
    expect(com.currentDevice.hostName).toEqual('test');
  });
  it('check "setCustomDevice"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.setCustomDevice({ hostName: 'test' });
    expect(com.currentDevice.hostName).toEqual('test');
    expect(com.tab).toEqual('SYSTEM');
  });
  it('check "getFieldForCheckIcon"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.currentDevice = {
      iconName: 'test'
    } as any;
    expect(com.getFieldForCheckIcon()).toEqual('test');
  });
  it('check "getTextForDisplayName"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.customDevice = {
      name: 'test'
    } as any;
    expect(com.getTextForDisplayName()).toEqual('test');
  });
  it('check "isLabel"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.currentDevice = {
      label: 'test',
      hostName: 'host',
    } as any;
    expect(com.isLabel()).toEqual(true);
  });
  it('check "close"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.close();
    expect(com.open).toEqual(false);
    expect(com.tab).toEqual("SYSTEM");
  });
});