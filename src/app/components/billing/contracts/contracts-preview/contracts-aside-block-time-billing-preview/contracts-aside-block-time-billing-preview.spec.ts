import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { CompanyDropDownModule } from 'src/app/components/shared/company-drop-down/company-drop-down.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { MultiDatepickerModule } from 'src/app/components/shared/multi-datepicker/multi-datepicker.module';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ContractsAsideBlockTimeBillingPreviewComponent } from './contracts-aside-block-time-billing-preview.component';


describe('ContractsAsideBlockTimeBillingPreviewComponent unit test', () => {
  let component: ContractsAsideBlockTimeBillingPreviewComponent;
  let fixture: ComponentFixture<ContractsAsideBlockTimeBillingPreviewComponent>;

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
      declarations: [ContractsAsideBlockTimeBillingPreviewComponent
      ],
    }).compileComponents();

  });

  it('check "getDiscount"', () => {
    const fixture = TestBed.createComponent(ContractsAsideBlockTimeBillingPreviewComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getDiscount({ discountAmount: 300 })).toEqual(`300 %`);
  });
  it('check "getDiscount"', () => {
    const fixture = TestBed.createComponent(ContractsAsideBlockTimeBillingPreviewComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getIntervalText()).toEqual(`monthly`);
  });
  it('check "getDiscount"', () => {
    const fixture = TestBed.createComponent(ContractsAsideBlockTimeBillingPreviewComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getIntervalText()).toEqual(`monthly`);
  });
  it('check "getSelectedTaxes"', () => {
    const fixture = TestBed.createComponent(ContractsAsideBlockTimeBillingPreviewComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getSelectedTaxes([{ name: "test", rate: 10 }])).toEqual("");
  });
  it('check "getAssignedUserNameForAvatar"', () => {
    const fixture = TestBed.createComponent(ContractsAsideBlockTimeBillingPreviewComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getAssignedUserNameForAvatar(null)).toEqual("");
  });
  it('check "getUserName"', () => {
    const fixture = TestBed.createComponent(ContractsAsideBlockTimeBillingPreviewComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getUserName(null)).toEqual('');
  });
});