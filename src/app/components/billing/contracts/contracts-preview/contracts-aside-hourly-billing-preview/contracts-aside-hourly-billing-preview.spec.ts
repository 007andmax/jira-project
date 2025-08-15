import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { CompanyDropDownModule } from 'src/app/components/shared/company-drop-down/company-drop-down.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { MultiDatepickerModule } from 'src/app/components/shared/multi-datepicker/multi-datepicker.module';
import { ContractsAsideHourlyBillingPreviewComponent } from './contracts-aside-hourly-billing-preview.component';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';


describe('ContractsAsideHourlyBillingPreviewComponent unit test', () => {
  let component: ContractsAsideHourlyBillingPreviewComponent;
  let fixture: ComponentFixture<ContractsAsideHourlyBillingPreviewComponent>;

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
      declarations: [ContractsAsideHourlyBillingPreviewComponent
      ],
    }).compileComponents();

  });

  it('check "getDiscount"', () => {
    const fixture = TestBed.createComponent(ContractsAsideHourlyBillingPreviewComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getDiscount({ discountAmount: 300 })).toEqual(`300 %`);
  });
  it('check "getSelectedTaxes"', () => {
    const fixture = TestBed.createComponent(ContractsAsideHourlyBillingPreviewComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getSelectedTaxes([{ name: "test", rate: 10 }])).toEqual("");
  });
});