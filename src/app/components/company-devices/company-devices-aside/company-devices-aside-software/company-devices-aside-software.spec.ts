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
        NoopAnimationsModule],
      declarations: [CompanyDevicesAsideSoftwareComponent
      ],
    }).compileComponents();

  });
  it('check "getDate"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesAsideSoftwareComponent);
    const com = fixture.debugElement.componentInstance;
<<<<<<< HEAD
    expect(com.getDate(null)).toEqual("Invalid date");
=======
    expect(com.getDate(null)).toEqual("No installed date");
>>>>>>> QT-1398
  });
  it('check "getVersion"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesAsideSoftwareComponent);
    const com = fixture.debugElement.componentInstance;
<<<<<<< HEAD
    expect(com.getVersion(null)).toEqual(", version - null");
=======
    expect(com.getVersion(null)).toEqual(", No version");
>>>>>>> QT-1398
  });
  it('check "softSize"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesAsideSoftwareComponent);
    const com = fixture.debugElement.componentInstance;
<<<<<<< HEAD
    expect(com.softSize(null)).toEqual("0 MB");
=======
    expect(com.softSize(null)).toEqual("No size data");
>>>>>>> QT-1398
  });
});