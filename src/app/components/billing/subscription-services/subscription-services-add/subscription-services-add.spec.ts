import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
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
import { SubscriptionServicesAddComponent } from './subscription-services-add.component';
import { HttpClientModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';



describe('SubscriptionServicesAddComponent unit test', () => {
  let component: SubscriptionServicesAddComponent;
  let fixture: ComponentFixture<SubscriptionServicesAddComponent>;

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
        }),
        NoopAnimationsModule],
      declarations: [SubscriptionServicesAddComponent
      ],
    }).compileComponents();

  });

  it('check "glDropDownItemName"', () => {
    const fixture = TestBed.createComponent(SubscriptionServicesAddComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.glDropDownItemName({ glNumber: "test", description: "123" })).toEqual("test - 123");
  });
  it('check "setDefaultTaxes"', () => {
    const fixture = TestBed.createComponent(SubscriptionServicesAddComponent);
    const com = fixture.debugElement.componentInstance;
    let lsitTaxes = [{ isDefault: true, id: 1 }, { isDefault: false, id: 2 }, { isDefault: true, id: 3 }]
    com.ngOnInit();
    com.setDefaultTaxes(lsitTaxes);
    expect(com.defaultSelectedTax).toEqual([{ isDefault: true, id: 1 }, { isDefault: true, id: 3 }]);
  });
});