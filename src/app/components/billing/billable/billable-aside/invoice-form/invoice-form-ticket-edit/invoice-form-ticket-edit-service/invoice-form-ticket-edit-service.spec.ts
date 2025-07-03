import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InvoiceFormTicketEditProductComponent } from './invoice-form-ticket-edit-product.component';
import { NumberModule } from 'src/app/directives/number/number.module';
import { ToFixedModule } from 'src/app/directives/to-fixed/to-fixed.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { TaxesModule } from 'src/app/components/shared/taxes/taxes.module';
import { InvoiceFormTicketEditServiceComponent } from './invoice-form-ticket-edit-service.component';
import { BillableProfileTicketServiceExpense } from '../../../../class/billable-profile-ticket-service-expense';

describe('InvoiceFormTicketEditServiceComponent unit test', () => {
  let component: InvoiceFormTicketEditServiceComponent;
  let fixture: ComponentFixture<InvoiceFormTicketEditServiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        HttpClientModule,
        NumberModule,
        ToFixedModule,
        MatErrorModule,
        TaxesModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [InvoiceFormTicketEditServiceComponent
      ]
    }).compileComponents();

  });

  it('check "onTaxesChange"', () => {
    const fixture = TestBed.createComponent(InvoiceFormTicketEditServiceComponent);
    const com = fixture.debugElement.componentInstance;
    com.service.taxes = { taxes: [] }
    com.onTaxesChange([
      { name: 'Tax1', rate: 10 },
      { name: 'Tax2', rate: 5 }
    ]);
    expect(com.product.taxes).toEqual([
      { name: 'Tax1', rate: 10 },
      { name: 'Tax2', rate: 5 }]);
  });
  it('check "onChangeStartTimePicker"', () => {
    const fixture = TestBed.createComponent(InvoiceFormTicketEditServiceComponent);
    const com = fixture.debugElement.componentInstance;
    let currentDate = new Date();
    let durationStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes()).getTime();
    com.service = new BillableProfileTicketServiceExpense();
    com.currentService.durationEnd = durationStart;
    com.onChangeStartTimePicker(durationStart);
    expect(com.service.durationStart).toEqual(durationStart)
  });
  it('check "onChangeEndTimePicker"', () => {
    const fixture = TestBed.createComponent(InvoiceFormTicketEditServiceComponent);
    const com = fixture.debugElement.componentInstance;
    let currentDate = new Date();
    let durationEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes()).getTime();
    com.service = new BillableProfileTicketServiceExpense();
    com.onChangeEndTimePicker(durationEnd);
    expect(com.service.durationEnd).toEqual(durationEnd)
  });
  it('check "onChangeDuration"', () => {
    const fixture = TestBed.createComponent(InvoiceFormTicketEditServiceComponent);
    const com = fixture.debugElement.componentInstance;
    com.service = new BillableProfileTicketServiceExpense();
    com.onChangeDuration(2);
    expect(com.service.durationEnd).toEqual((3600000 * 2) + com.service.durationStart);
  });
  it('check "onChangeDescription"', () => {
    const fixture = TestBed.createComponent(InvoiceFormTicketEditServiceComponent);
    const com = fixture.debugElement.componentInstance;
    com.service = new BillableProfileTicketServiceExpense();
    com.onChangeDescription({ target: { value: "test" } })
    expect(com.service.description).toEqual("test")
  });
  it('check "onPastDescription"', () => {
    const fixture = TestBed.createComponent(InvoiceFormTicketEditServiceComponent);
    const com = fixture.debugElement.componentInstance;
    com.onPastDescription("test")
    expect(com.service.description).toEqual("test")
  });
  it('check "getDuration"', () => {
    const fixture = TestBed.createComponent(InvoiceFormTicketEditServiceComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getDuration(2)).toEqual("02 : 00");
  });
  it('check "getSelectedTaxes"', () => {
    const fixture = TestBed.createComponent(InvoiceFormTicketEditServiceComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getSelectedTaxes([{ name: "name", rate: 10 }])).toEqual("name 10%");
  });
});