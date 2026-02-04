import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { PreviewPhoneMaskModule } from 'src/app/components/shared/preview-phone-mask/preview-phone-mask.module';
import { CompanyDevicesCustomDropDownComponent } from './company-devices-custom-drop-down.component';


describe('CompanyDevicesCustomDropDownComponent unit test', () => {
  let component: CompanyDevicesCustomDropDownComponent;
  let fixture: ComponentFixture<CompanyDevicesCustomDropDownComponent>;

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
      declarations: [CompanyDevicesCustomDropDownComponent
      ],
    }).compileComponents();

  });
  it('check "getAntivirusFiled"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesCustomDropDownComponent);
    const com = fixture.debugElement.componentInstance;
    com.selectedTag = [{ id: 1 }]
    expect(com.isSelected(1)).toEqual(true);
    expect(com.isSelected(2)).toEqual(false);
  });

});