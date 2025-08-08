import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'src/app/components/shared/date-picker/date-picker.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { PaymentsComponent } from './payments.component';

describe('PaymentsComponent unit test', () => {
  let component: PaymentsComponent;
  let fixture: ComponentFixture<PaymentsComponent>;

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
      declarations: [PaymentsComponent
      ]
    }).compileComponents();

  });


  it('check "onEditPayment"', () => {
    const fixture = TestBed.createComponent(PaymentsComponent);
    const com = fixture.debugElement.componentInstance;
    com.onEditPayment(null);
    expect(com.showEditPayment).toEqual(true);
  });
  it('check "onRefundPayment"', () => {
    const fixture = TestBed.createComponent(PaymentsComponent);
    const com = fixture.debugElement.componentInstance;
    com.onRefundPayment(null);
    expect(com.showRefundPayment).toEqual(true);
  });
  it('check "onDetailsPayment"', () => {
    const fixture = TestBed.createComponent(PaymentsComponent);
    const com = fixture.debugElement.componentInstance;
    com.onDetailsPayment(null);
    expect(com.showDetailsPayment).toEqual(true);
  });
  it('check "setDefaultScoll"', () => {
    const fixture = TestBed.createComponent(PaymentsComponent);
    const com = fixture.debugElement.componentInstance;
    com.setDefaultScoll();
    expect(com.page_number).toEqual(0);
    expect(com.payments).toEqual([]);
  });
});