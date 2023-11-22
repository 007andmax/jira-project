import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InvoiceNote } from 'src/app/components/billing/billable/class/invoice-note';
import { BillableService } from 'src/app/services/billable/billable.service';
import { BillableStateService } from 'src/app/states/billable/billable-state.service';
import { ValidateNote } from '../class/validate-note';

@Component({
  selector: 'edit-custom-notes-settings',
  templateUrl: './edit-custom-notes-settings.component.html',
  styleUrls: ['./edit-custom-notes-settings.component.scss']
})
export class EditCustomNotesSettingsComponent implements OnInit {

  toggleEdit: boolean = false;
  customeNote: InvoiceNote = new InvoiceNote();
  validate: ValidateNote = new ValidateNote();
  @Output() onEditNote: EventEmitter<any> = new EventEmitter();
  constructor(private billableStateService: BillableStateService,
    private billableService: BillableService) { }

  ngOnInit() {
    this.billableStateService.onEditNote.subscribe(data => {
      this.customeNote = new InvoiceNote(data);
      this.toggleEdit = true;
    })
  }
  add() {
    if (!this.validate.isValidate(this.customeNote)) return;
    this.billableService.editNote(this.customeNote.id, this.customeNote.getDataForAdd()).subscribe(data => {
      this.onEditNote.emit(data);
      this.close();
    })
  }
  close() {
    this.toggleEdit = false;
    this.customeNote = new InvoiceNote();
    this.validate = new ValidateNote();
  }

}
