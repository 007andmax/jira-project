import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InvoiceDiscountComponent } from './invoice-discount.component';


describe('InvoiceDiscountComponent unit test', () => {
  let component: InvoiceDiscountComponent;
  let fixture: ComponentFixture<InvoiceDiscountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [InvoiceDiscountComponent
      ]
    }).compileComponents();

  });

  it('check "onChangeAmount"', () => {
    const fixture = TestBed.createComponent(InvoiceDiscountComponent);
    const com = fixture.debugElement.componentInstance;
    com.onChangeAmount('100');
    expect(com.discount.amount).toEqual(100);
  });

});