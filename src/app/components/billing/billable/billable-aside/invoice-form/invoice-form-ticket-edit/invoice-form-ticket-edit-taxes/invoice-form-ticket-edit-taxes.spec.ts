import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NumberModule } from 'src/app/directives/number/number.module';
import { InvoiceFormTicketEditTaxesComponent } from './invoice-form-ticket-edit-taxes.component';

describe('InvoiceFormTicketEditTaxesComponent unit test', () => {
  let component: InvoiceFormTicketEditTaxesComponent;
  let fixture: ComponentFixture<InvoiceFormTicketEditTaxesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        HttpClientModule,
        NumberModule,
        NgbModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [InvoiceFormTicketEditTaxesComponent
      ],
      providers: [FormBuilder]
    }).compileComponents();

  });

  it('check "addTax"', () => {
    const fixture = TestBed.createComponent(InvoiceFormTicketEditTaxesComponent);
    const com = fixture.debugElement.componentInstance;
    com.taxes = [];
    com.addTax({ name: 'Tax1', rate: 10 });
    expect(com.taxes).toEqual([
      { name: 'Tax1', rate: 10 }]);
  });
  it('check "setEditItems"', () => {
    const fixture = TestBed.createComponent(InvoiceFormTicketEditTaxesComponent);
    const com = fixture.debugElement.componentInstance;

    com.setEditItems([
      { name: 'Tax1', rate: 10 }
    ]);
    expect(com.selectedTax).toEqual(
      [{ name: 'Tax1', rate: 10 }]);
  });
  it('check "remove"', () => {
    const fixture = TestBed.createComponent(InvoiceFormTicketEditTaxesComponent);
    const com = fixture.debugElement.componentInstance;
    com.setEditItems([
      { name: 'Tax1', rate: 10 },
      { name: 'Tax2', rate: 20 }
    ]);
    com.remove(0);
    expect(com.selectedTax).toEqual([
      { name: 'Tax2', rate: 20 }]);
  });
  it('check "getSelectedTaxes"', () => {
    const fixture = TestBed.createComponent(InvoiceFormTicketEditTaxesComponent);
    const com = fixture.debugElement.componentInstance;
    com.setEditItems([
      { name: 'Tax1', rate: 10 },
      { name: 'Tax2', rate: 20 }
    ]);
    expect(com.getSelectedTaxes()).toEqual(`Tax1 10%,Tax2 20%`);
  });
  it('check "selected"', () => {
    const fixture = TestBed.createComponent(InvoiceFormTicketEditTaxesComponent);
    const com = fixture.debugElement.componentInstance;
    com.selected(
      { id: 0, name: 'Tax1', rate: 10 }
    );
    expect(com.selectedTax).toEqual([{ id: 0, name: 'Tax1', rate: 10 }]);
  });
  it('check "checkTaxIsSelected"', () => {
    const fixture = TestBed.createComponent(InvoiceFormTicketEditTaxesComponent);
    const com = fixture.debugElement.componentInstance;
    com.selected(
      { id: 0, name: 'Tax1', rate: 10 });
    expect(com.checkTaxIsSelected({ id: 0, name: 'Tax1', rate: 10 })).toEqual(true);
  });
  it('check "close"', () => {
    const fixture = TestBed.createComponent(InvoiceFormTicketEditTaxesComponent);
    const com = fixture.debugElement.componentInstance;
    com.selected(
      { id: 0, name: 'Tax1', rate: 10 });
    com.close();
    expect(com.selectedTax.length).toEqual(0);
  });
});