import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { FormsModule } from '@angular/forms';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { TaxesModule } from 'src/app/components/shared/taxes/taxes.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { DefaultServicesHourlyContract } from '../../../contracts-aside/class/default-service-hourly-contract';
import { ContractsAsideBlockTimeBillingAddDefaultServiceComponent } from '../../../contracts-aside/contracts-aside-block-time-billing/contracts-aside-block-time-billing-add-default-service/contracts-aside-block-time-billing-add-default-service.component';
import { ContractsAsideEditHourlyAddDefaultServiceComponent } from './contracts-aside-edit-hourly-add-default-service.component';
import { HttpClientModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';


describe('ContractsAsideEditHourlyAddDefaultServiceComponent unit test', () => {
  let component: ContractsAsideEditHourlyAddDefaultServiceComponent;
  let fixture: ComponentFixture<ContractsAsideEditHourlyAddDefaultServiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        DropDownModule,
        MatErrorModule,
        FormsModule,
        TaxesModule,
        NumberModule,
        DisabledBtnModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [ContractsAsideEditHourlyAddDefaultServiceComponent
      ],
    }).compileComponents();

  });

  it('check "service"', () => {
    const fixture = TestBed.createComponent(ContractsAsideEditHourlyAddDefaultServiceComponent);
    const com = fixture.debugElement.componentInstance;
    com.service = new DefaultServicesHourlyContract({
      "versionedId": {
        "id": "5226150d-1e89-4dc6-9b59-6653bba718f1",
        "version": 0
      },
      "createdAt": 1599647794546,
      "updatedAt": 1738162124066,
      "deletedAt": null,
      "name": "new test service3 something else1212",
      "rate": 125.0,
      "commissionRate": 1.0,
      "billable": true,
      "isDefault": true,
      "isBasedOnDefault": false,
      "parentDefaultServiceId": null,
      "company": {
        "id": "72381bff-127c-4a63-9d2e-6e952350dcbd",
        "quoteExpirationDate": 45
      },
      "serviceAgreement": null,
      "blockTimeServiceAgreement": null,
      "serviceContractServiceAgreement": null,
      "originService": null,
      "taxes": [
        {
          "id": "8d321592-ffbd-487a-95c5-4789fa9a58c6",
          "createdAt": 1490364405218,
          "updatedAt": 1594365664246,
          "deletedAt": null,
          "name": "GST",
          "rate": 5.00,
          "isDefault": true,
          "taxSum": null
        }
      ],
      "glNumber": null,
      "isStub": false,
      "canUseInTicket": true,
      "isServiceToTrack": false,
      "rollback": false,
      "oldVersion": false
    });
    com.ngOnInit();
    com.onChangeName();
    expect(com.validate.duplicateName).toEqual(true);
    com.onChangeRate({ target: { value: "1500" } });
    expect(com.service.rate).toEqual(1500);
  });
});