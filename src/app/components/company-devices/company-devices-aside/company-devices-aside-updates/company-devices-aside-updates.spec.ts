import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { PreviewPhoneMaskModule } from 'src/app/components/shared/preview-phone-mask/preview-phone-mask.module';
import { CompanyDevicesAsideUpdatesComponent } from './company-devices-aside-updates.component';


describe('CompanyDevicesAsideUpdatesComponent unit test', () => {
  let component: CompanyDevicesAsideUpdatesComponent;
  let fixture: ComponentFixture<CompanyDevicesAsideUpdatesComponent>;

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
      declarations: [CompanyDevicesAsideUpdatesComponent
      ],
    }).compileComponents();

  });
  it('check "getAntivirusFiled"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesAsideUpdatesComponent);
    const com = fixture.debugElement.componentInstance;
<<<<<<< HEAD
    com.device = {report:{antivirus:[]}};
=======
>>>>>>> QT-1398
    expect(com.getAntivirusFiled(null)).toEqual(null);
  });

});