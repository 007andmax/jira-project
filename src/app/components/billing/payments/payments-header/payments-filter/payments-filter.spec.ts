import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'src/app/components/shared/date-picker/date-picker.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { PaymentsFilterComponent } from './payments-filter.component';



describe('PaymentsFilterComponent unit test', () => {
  let component: PaymentsFilterComponent;
  let fixture: ComponentFixture<PaymentsFilterComponent>;

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
        NoopAnimationsModule, PaymentsFilterComponent]
}).compileComponents();

  });


  it('check "onSelectStatus"', () => {
    const fixture = TestBed.createComponent(PaymentsFilterComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSelectStatus({ value: "test" });
    expect(com.paymentsFilter.status).toEqual(undefined);
  });
  it('check "onSelectCompany"', () => {
    const fixture = TestBed.createComponent(PaymentsFilterComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSelectCompany({ id: "test" });
    expect(com.paymentsFilter.companyId).toEqual("test");
  });
  it('check "onSetNumberInvoice"', () => {
    const fixture = TestBed.createComponent(PaymentsFilterComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSetNumberInvoice({ target: { value: "test" } });
    expect(com.paymentsFilter.invoiceNumber).toEqual("test");
  });
});