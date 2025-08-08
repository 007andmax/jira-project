import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'src/app/components/shared/date-picker/date-picker.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { PaymentItemComponent } from './payment-item.component';



describe('PaymentItemComponent unit test', () => {
  let component: PaymentItemComponent;
  let fixture: ComponentFixture<PaymentItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        DatePickerModule,
        NumberModule,
        FormsModule,
        MatErrorModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [PaymentItemComponent
      ]
    }).compileComponents();

  });


  it('check "getInvoices"', () => {
    const fixture = TestBed.createComponent(PaymentItemComponent);
    const com = fixture.debugElement.componentInstance;
    com.payment = { paymentData: [] };
    expect(com.getInvoices()).toEqual("");
  });
});