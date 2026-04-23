
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { InvoiceNote } from 'src/app/components/billing/billable/class/invoice-note';
import { BillableService } from 'src/app/services/billable/billable.service';
import { BillableStateService } from 'src/app/states/billable/billable-state.service';
import { ValidateNote } from '../class/validate-note';
import { MatErrorComponent } from 'src/app/components/shared/mat-error/mat-error.component';

@Component({
  standalone: true,
  imports: [MatErrorComponent, FormsModule, CommonModule],
  selector: 'add-custom-notes-settings',
  templateUrl: './add-custom-notes-settings.component.html',
  styleUrls: ['./add-custom-notes-settings.component.scss']
})
export class AddCustomNotesSettingsComponent implements OnInit {
  toggleAdd: boolean = false;
  customeNote: InvoiceNote = new InvoiceNote();
  validate: ValidateNote = new ValidateNote();
  @Output() onAddNote: EventEmitter<any> = new EventEmitter();
  constructor(private billableStateService: BillableStateService,
    private billableService: BillableService) { }

  ngOnInit() {
    this.billableStateService.onAddNote.subscribe(data => {
      this.toggleAdd = true;
    })
  }
  add() {
    if (!this.validate.isValidate(this.customeNote)) return;
    this.billableService.addNote(this.customeNote.getDataForAdd()).subscribe(data => {
      this.onAddNote.emit(data);
      this.close();
    })
  }
  close() {
    this.toggleAdd = false;
    this.customeNote = new InvoiceNote();
    this.validate = new ValidateNote();
  }
}
