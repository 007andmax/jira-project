import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { PreviewPhoneMaskModule } from 'src/app/components/shared/preview-phone-mask/preview-phone-mask.module';
import { CompanyDevicesAsideSoftwareComponent } from './company-devices-aside-software.component';


describe('CompanyDevicesAsideSoftwareComponent unit test', () => {
  let component: CompanyDevicesAsideSoftwareComponent;
  let fixture: ComponentFixture<CompanyDevicesAsideSoftwareComponent>;

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
        NoopAnimationsModule, CompanyDevicesAsideSoftwareComponent],
}).compileComponents();

  });
  it('check "getDate"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesAsideSoftwareComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getDate(null)).toEqual("Invalid date");
  });
  it('check "getVersion"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesAsideSoftwareComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getVersion(null)).toEqual(", version - null");
  });
  it('check "softSize"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesAsideSoftwareComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.softSize(null)).toEqual("0 MB");
  });
});