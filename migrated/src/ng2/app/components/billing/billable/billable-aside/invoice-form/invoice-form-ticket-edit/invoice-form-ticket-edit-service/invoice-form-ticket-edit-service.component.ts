import { Component, OnInit, Input, ElementRef, ChangeDetectorRef } from '@angular/core';
import { BillableProfileTicketServiceExpense } from '../../../../class/billable-profile-ticket-service-expense';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';

@Component({
  selector: 'app-invoice-form-ticket-edit-service',
  templateUrl: './invoice-form-ticket-edit-service.component.html',
  styleUrls: ['./invoice-form-ticket-edit-service.component.scss']
})
export class InvoiceFormTicketEditServiceComponent implements OnInit {
  @Input() service:BillableProfileTicketServiceExpense;
   editService:BillableProfileTicketServiceExpense;
  minutes: number = 0;
  hours: number = 0;
  durationStart: number = 0;
  durationEnd: number = 0;
  billableQuantity: number = 0;
  currentCompany = null;
  constructor(  private companiesStateService: CompaniesStateService,
    public cd: ChangeDetectorRef,
    private elRef: ElementRef,) { }

  ngOnInit() {
    this.editService = new BillableProfileTicketServiceExpense(this.service);
    this.currentCompany = this.companiesStateService.getCurrentCompany();
    console.log("currentCompany.serviceExpenseDurationPresentation" ,this.currentCompany.serviceExpenseDurationPresentation);
    console.log("this.editService",this.editService);
    this.billableQuantity = JSON.parse(JSON.stringify(this.service.billableQuantity));
    this.durationStart = this.service.durationStart;
    this.durationEnd = this.service.durationEnd;
    var timeInMinutes = this.service.quantity * 60;
    this.hours = Math.floor(timeInMinutes / 60);
    this.minutes = Math.round(timeInMinutes - (this.hours * 60));
    this.elRef.nativeElement.querySelector('#service-description').value = this.editService.description;
    
  }
  public onChangeStartTimePicker(startDate) {
    this.durationStart = startDate;
    this.editService.setDurationStart(this.durationStart);
  }
  public onChangeEndTimePicker(endDate) {
    this.durationEnd = endDate;
    this.editService.setDurationEnd(this.durationEnd);
    
  }
  public onChangeDuration(quantity) {
    this.billableQuantity = quantity;
    this.cd.detectChanges();
   
    this.editService.setBillableQuantity(this.billableQuantity);
  }
  public onChangeDescription(event) {
    this.editService.description = event.target.value;

  }
  public onPastDescription(value) {
    this.editService.description = value;
  }
}
