import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { CompanyDropDownModule } from 'src/app/components/shared/company-drop-down/company-drop-down.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { MultiDatepickerModule } from 'src/app/components/shared/multi-datepicker/multi-datepicker.module';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ContractsAsideUserDeviceBillingPreviewComponent } from './contracts-aside-user-device-billing-preview.component';


describe('ContractsAsideUserDeviceBillingPreviewComponent unit test', () => {
  let component: ContractsAsideUserDeviceBillingPreviewComponent;
  let fixture: ComponentFixture<ContractsAsideUserDeviceBillingPreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        DropDownModule,
        MultiDatepickerModule,
        CompanyDropDownModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [ContractsAsideUserDeviceBillingPreviewComponent
      ],
    }).compileComponents();

  });

  it('check "getSelectedInterval"', () => {
    const fixture = TestBed.createComponent(ContractsAsideUserDeviceBillingPreviewComponent);
    const com = fixture.debugElement.componentInstance;
    com.getSelectedInterval();
    expect(com.selectedInterval).toEqual(`7 days`);
  });
  it('check "getSelectedTaxes"', () => {
    const fixture = TestBed.createComponent(ContractsAsideUserDeviceBillingPreviewComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getSelectedTaxes([{ name: "test", rate: 10 }])).toEqual("test 10%");
  });
  it('check "getDiscount"', () => {
    const fixture = TestBed.createComponent(ContractsAsideUserDeviceBillingPreviewComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getDiscount({ discountAmount: 300 })).toEqual(`300 %`);
  });
});