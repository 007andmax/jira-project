import { async, ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TaxesModule } from 'src/app/components/shared/taxes/taxes.module';
import { DecimalNumberModule } from 'src/app/directives/decimal-number/decimal-number.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { ContractsAsideDiscountModule } from '../../contracts-aside-discount/contracts-aside-discount.module';
import { ContractsAsideBlockTimeBillingDefaultServiceComponent } from './contracts-aside-block-time-billing-default-service.component';
import { ContractsBlockTimeDefaultService } from '../../class/contracts-block-time-default-service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { By } from '@angular/platform-browser';
import { DecimalNumberDirective } from 'src/app/directives/decimal-number/decimal-number.directive';
import { numberDirective } from 'src/app/directives/number/number.directive';



describe('ContractsAsideBlockTimeBillingDefaultServiceComponent unit test', () => {
  let component: ContractsAsideBlockTimeBillingDefaultServiceComponent;
  let fixture: ComponentFixture<ContractsAsideBlockTimeBillingDefaultServiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        NgbModule,
        TaxesModule,
        NumberModule,
        MatErrorModule,
        DecimalNumberModule,
        ContractsAsideDiscountModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        })],
      declarations: [ContractsAsideBlockTimeBillingDefaultServiceComponent
      ]
    }).compileComponents();

  });

  it('check "service"', () => {
    const fixture = TestBed.createComponent(ContractsAsideBlockTimeBillingDefaultServiceComponent);

    const com = fixture.debugElement.componentInstance;
    com.service = new ContractsBlockTimeDefaultService(true, true, 0, "test", "test name", 0, [], "123", false, "100", "PERCENT");
    com.onChangeDiscountAmount("200")
    com.onChangeDiscount({ type: "FIXED" })
    com.onTaxesChange([{ id: "1" }, { id: "2" }, { id: "3" }])
    com.onChangeRate("200")
    expect(com.service.discountAmount).toEqual("200");
    expect(com.service.discountType).toEqual("FIXED");
    expect(com.service.taxIds).toEqual(["1", "2", "3"]);
    expect(com.service.rate).toEqual(200);
  });
});

/*describe('ContractsAsideBlockTimeBillingDefaultServiceComponent integration test', () => {
 let component: ContractsAsideBlockTimeBillingDefaultServiceComponent;
 let fixture: ComponentFixture<ContractsAsideBlockTimeBillingDefaultServiceComponent>;
 beforeEach(() => {
   TestBed.configureTestingModule({
     imports: [CommonModule,
       FormsModule,
       NgbModule,
       TaxesModule,
       NumberModule,
       MatErrorModule,
       DecimalNumberModule,
       ContractsAsideDiscountModule,
       HttpClientModule,
       ToastrModule.forRoot({
         closeButton: true,
         timeOut: 5000,
         onActivateTick: true
       })],
     declarations: [ContractsAsideBlockTimeBillingDefaultServiceComponent
     ],
   })
   fixture = TestBed.createComponent(ContractsAsideBlockTimeBillingDefaultServiceComponent);
   component = fixture.componentInstance;
 });
 it('change discount input', async () => {
    //const com = fixture.debugElement.componentInstance;
    component.service = new ContractsBlockTimeDefaultService(true, true, 0, "test", "test name", 0, [], "123", false, "100", "PERCENT");
    // get the name's input and display elements from the DOM
    const hostElement: HTMLElement = fixture.nativeElement!;
    const discountInput: HTMLInputElement = hostElement.querySelector('.track-and-bill-table__discount input');
 
    // simulate user entering a new name into the input box
    discountInput.value = "500";
    // Dispatch a DOM event so that Angular learns of input value change.
    //discountInput.dispatchEvent(new Event('input'));
    discountInput.blur();
    fixture.detectChanges();
    // Wait for Angular to update the display binding through the title pipe
    await fixture.whenStable();
    expect(component.service.discountAmount).toBe('500.00');
  });

});*/