import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { GlNumbersDropDownModule } from 'src/app/components/inventory/gl-numbers-drop-down/gl-numbers-drop-down.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';
import { TaxesModule } from 'src/app/components/shared/taxes/taxes.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceItemQuoteComponent } from './service-item-quote.component';



describe('ServiceItemQuoteComponent unit test', () => {
  let component: ServiceItemQuoteComponent;
  let fixture: ComponentFixture<ServiceItemQuoteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        MatErrorModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [ServiceItemQuoteComponent
      ],
    }).compileComponents();

  });

  it('check "getPriceService"', () => {
    const fixture = TestBed.createComponent(ServiceItemQuoteComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getPriceService({ quantity: 100, item: { rate: 50, taxes: [{ rate: 0, name: 'Tax1' }] } })).toEqual("5000.00");
  });
  it('check "getTaxPrice"', () => {
    const fixture = TestBed.createComponent(ServiceItemQuoteComponent);
    const com = fixture.debugElement.componentInstance;
    com.product = { discountType: "PERCENT", quantity: 2, discountAmount: 100, item: { sale: 100, quantity: 2, rate: 10, taxes: [{ rate: 10, name: 'Tax1' }] } } as any;
    expect(com.getTaxPrice(com.product)).toEqual(0);
  });
  it('check "getSelectedTaxes"', () => {
    const fixture = TestBed.createComponent(ServiceItemQuoteComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getSelectedTaxes([{ name: "test", rate: 10 }])).toEqual("test 10%");
  });
});