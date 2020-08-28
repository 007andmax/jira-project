import { Component, OnInit, Input, ElementRef, ChangeDetectorRef, ViewChild } from '@angular/core';
import { BillableProfileTicketServiceExpense } from '../../../../class/billable-profile-ticket-service-expense';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { InvoiceFormTicketEditTaxesComponent } from '../invoice-form-ticket-edit-taxes/invoice-form-ticket-edit-taxes.component';
import { Tax } from 'src/ng2/app/interfaces/service/tax';
import { Subscription } from 'rxjs';
import { TaxesStateService } from 'src/ng2/app/states/taxes/taxes-state.service';
import { TaxesService } from 'src/ng2/app/services/taxes/taxes.service';

@Component({
  selector: 'app-invoice-form-ticket-edit-service',
  templateUrl: './invoice-form-ticket-edit-service.component.html',
  styleUrls: ['./invoice-form-ticket-edit-service.component.scss']
})
export class InvoiceFormTicketEditServiceComponent implements OnInit {
  @ViewChild('taxes') taxesDropDown: InvoiceFormTicketEditTaxesComponent;
  @Input() service: BillableProfileTicketServiceExpense;

  minutes: number = 0;
  hours: number = 0;
  durationStart: number = 0;
  durationEnd: number = 0;
  quantity: number = 0;
  currentCompany = null;
  taxes: Array<Tax> = [];
  sub: Subscription = new Subscription();
  constructor(private companiesStateService: CompaniesStateService,
    public cd: ChangeDetectorRef,
    private taxesStateService: TaxesStateService,
    private taxesService: TaxesService,
    private elRef: ElementRef,) { }

  ngOnInit() {
    this.currentCompany = this.companiesStateService.getCurrentCompany();
    this.quantity = JSON.parse(JSON.stringify(this.service.quantity));
    this.durationStart = this.service.durationStart;
    this.durationEnd = this.service.durationEnd;
    var timeInMinutes = this.service.quantity * 60;
    this.hours = Math.floor(timeInMinutes / 60);
    this.minutes = Math.round(timeInMinutes - (this.hours * 60));
    this.elRef.nativeElement.querySelector('#service-description').value = this.service.description;
    if (this.taxesStateService.getTaxes().length > 0) this.taxes = this.taxesStateService.getTaxes();
    let getOnTaxess = this.taxesStateService.onGetTaxes.subscribe((data) => {
      this.taxes = [...this.taxes, ...data];
      this.onSetEditTaxes();
    })
    this.onSetEditTaxes();
    this.sub.add(getOnTaxess);
  }
  onSetEditTaxes() {
    let notFindTax = [];
    let taxes = this.taxes.filter(item => {
      let index = this.service.taxes.findIndex(tax => tax.name === item.name && tax.rate === item.rate);
      return (index > -1) ? true : false;
    })
    this.service.taxes.forEach(item => {
      let index = this.taxes.findIndex(tax => tax.name === item.name && tax.rate === item.rate);
      if (index === -1) {
        this.taxesDropDown.addTax(item);
        notFindTax.push(item);
      }
    });
    taxes = [...taxes, ...notFindTax];
    this.taxesDropDown.setEditItems(taxes);
  }
  onTaxesChange(data) {
    this.service.taxes = data;
  }
  public onChangeStartTimePicker(startDate) {
    this.durationStart = startDate;
    this.service.setDurationStart(this.durationStart);
    this.service.calculateQuantity();
  }
  public onChangeEndTimePicker(endDate) {
    this.durationEnd = endDate;
    this.service.setDurationEnd(this.durationEnd);
    this.service.calculateQuantity();

  }
  public onChangeDuration(quantity) {
    this.quantity = quantity;
    this.service.setQuantity(this.quantity);
    this.cd.detectChanges();
  }
  public onChangeDescription(event) {
    this.service.description = event.target.value;
  }
  public onPastDescription(value) {
    this.service.description = value;
  }
}
