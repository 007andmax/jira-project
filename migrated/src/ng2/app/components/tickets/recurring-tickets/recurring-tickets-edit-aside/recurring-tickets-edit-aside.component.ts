import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subscription } from "rxjs";
import { TicketStateService } from "../../ticket-state.service";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-recurring-tickets-edit-aside',
  templateUrl: './recurring-tickets-edit-aside.component.html',
  styleUrls: ['./recurring-tickets-edit-aside.component.scss']
})
export class RecurringTicketsEditAsideComponent implements OnInit {

  public showTicketRecurringSub: Subscription;
  public opened = false;
  public navigation = 'arrows';
  public ticketForm: FormGroup;
  constructor(
    private ticketStateService: TicketStateService,
    private fb: FormBuilder,
    public cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.showTicketRecurring();
   
  }

  public selectClient(selectClient) {
    this.ticketForm.controls['client'].setValue(selectClient);
   // this.selectedClient = value.item;
    console.log('this.quoteForm',this.ticketForm);
    this.ticketStateService.setClient(selectClient);
    this.cd.detectChanges();
  }
  

  public initForm() {
    
      this.ticketForm = this.fb.group({
        client: ['', Validators.required],
       /* startDate: this.dateService.getStartDate(new Date()),
        endDate: this.dateService.getStartDate(new Date().getTime() + this.fifteenDays),
        partialDeposit: '',
        purchaseOrder: '',
        quoteNumber: this.quoteNumber,
        po: '',
        regularNote: '',
        globalNote: ''*/
      })
     // this.onInitChengeForm();
    
  }

  public showTicketRecurring() {
    this.showTicketRecurringSub = this.ticketStateService.showTicketRecurringAside.subscribe((res) => {
      this.opened = true;
      this.initForm();
    });
  }

  public close() {
    this.opened = false;
  }
}
