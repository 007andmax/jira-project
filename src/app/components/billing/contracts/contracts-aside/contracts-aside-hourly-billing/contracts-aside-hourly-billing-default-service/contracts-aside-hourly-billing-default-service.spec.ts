import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { DefaultServicesHourlyContract } from '../../class/default-service-hourly-contract';
import { FormsModule } from '@angular/forms';
import { CompanyDropDownModule } from 'src/app/components/shared/company-drop-down/company-drop-down.module';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';
import { TaxesModule } from 'src/app/components/shared/taxes/taxes.module';
import { DecimalNumberModule } from 'src/app/directives/decimal-number/decimal-number.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { ContractsAsideHourlyBillingDefaultServiceComponent } from './contracts-aside-hourly-billing-default-service.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';



describe('ContractsAsideHourlyBillingDefaultServiceComponent unit test', () => {
  let component: ContractsAsideHourlyBillingDefaultServiceComponent;
  let fixture: ComponentFixture<ContractsAsideHourlyBillingDefaultServiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommonModule,
        FormsModule,
        NgbModule,
        DecimalNumberModule,
        TaxesModule,
        NumberModule,
        CompanyDropDownModule,
        MatErrorModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        HttpClientModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 5000,
            onActivateTick: true
        }),
        NoopAnimationsModule, ContractsAsideHourlyBillingDefaultServiceComponent],
}).compileComponents();

  });

  it('check "defaultService"', () => {
    const fixture = TestBed.createComponent(ContractsAsideHourlyBillingDefaultServiceComponent);
    const com = fixture.debugElement.componentInstance;
    com.defaultService = new DefaultServicesHourlyContract({
      count: 1,
      versionedId: { id: 70 },
      name: "name",
      rate: 100,
      taxes: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
      basedOnDefault: true
    });
    com.onChangeRate("123");
    expect(com.defaultService.rate).toEqual(123);
    expect(com.defaultService.getDataFromBillableService()).toEqual({
      count: 1,
      id: 70,
      name: "name",
      rate: 123,
      taxIds: [1, 2, 3, 4, 5],
      subscriptionService: { id: 70 },
      parentDefaultServiceId: 70,
      basedOnDefault: true
    });
  });
});