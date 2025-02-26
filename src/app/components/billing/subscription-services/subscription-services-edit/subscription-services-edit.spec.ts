import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlNumbersDropDownModule } from 'src/app/components/inventory/gl-numbers-drop-down/gl-numbers-drop-down.module';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';
import { TaxesModule } from 'src/app/components/shared/taxes/taxes.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { ToFixedModule } from 'src/app/directives/to-fixed/to-fixed.module';
import { ContractsEditModule } from '../../contracts/contracts-edit/contracts-edit.module';
import { SubscriptionServicesRoutingModule } from '../subscription-services-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { SubscriptionServices } from '../class/subscription-services';
import { SubscriptionServicesEditComponent } from './subscription-services-edit.component';



describe('SubscriptionServicesEditComponent unit test', () => {
  let component: SubscriptionServicesEditComponent;
  let fixture: ComponentFixture<SubscriptionServicesEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        NgbModule,
        DropDownModule,
        FormsModule,
        PreloaderTicketModule,
        DisabledBtnModule,
        ReactiveFormsModule,
        MatErrorModule,
        TaxesModule,
        ToFixedModule,
        NumberModule,
        GlNumbersDropDownModule,
        ContractsEditModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        })],
      declarations: [SubscriptionServicesEditComponent
      ],
      providers: [NgbActiveModal]
    }).compileComponents();

  });
  it('check "glDropDownItemName"', () => {
    const fixture = TestBed.createComponent(SubscriptionServicesEditComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.glDropDownItemName({ glNumber: "test", description: "123" })).toEqual("test - 123");
  });
  it('check "service"', () => {
    const fixture = TestBed.createComponent(SubscriptionServicesEditComponent);
    const com = fixture.debugElement.componentInstance;
    com.service = new SubscriptionServices({
      id: "test",
      "name": "name",
      "rate": 100,
      "taxIds": ["1", "2", "3"],
      glNumberId: "123",
      updateServicePricesInContracts: false,
      subscriptionService: { id: "test" },
      parentDefaultServiceId: "test",
      basedOnDefault: true
    })
    expect(com.service.getDataForUpdate()).toEqual({
      "name": "name",
      "rate": 100,
      "taxIds": ["1", "2", "3"],
      glNumberId: "123",
      updateServicePricesInContracts: false,
    });
    expect(com.service.getDataForBillableService()).toEqual({
      count: 1,
      id: "test",
      "name": "name",
      "rate": 100,
      "taxIds": ["1", "2", "3"],
      glNumberId: "123",
      updateServicePricesInContracts: false,
      subscriptionService: { id: "test", },
      parentDefaultServiceId: "test",
      basedOnDefault: true
    });
  });

});