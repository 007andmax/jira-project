import { Component, OnInit } from '@angular/core';
import { InvoiceNote } from 'src/app/components/billing/billable/class/invoice-note';
import { BillableService } from 'src/app/services/billable/billable.service';
import { BillableStateService } from 'src/app/states/billable/billable-state.service';

@Component({
  selector: 'custom-notes-settings',
  templateUrl: './custom-notes-settings.component.html',
  styleUrls: ['./custom-notes-settings.component.scss']
})
export class CustomNotesSettingsComponent implements OnInit {
  invoiceNotes: Array<InvoiceNote> = [];
  showPreloader: boolean = true;
  constructor(private billableService: BillableService,
    private billableStateService: BillableStateService) { }

  ngOnInit() {
    this.billableService.getInvoiceNote().subscribe(data => {
      this.invoiceNotes = data.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ?
        1 : ((b.title.toLowerCase() > a.title.toLowerCase()) ? -1 : 0));
      this.showPreloader = false;
    })
  }
  addNote(data) {
    this.invoiceNotes.push(new InvoiceNote(data));
    this.invoiceNotes.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ?
      1 : ((b.title.toLowerCase() > a.title.toLowerCase()) ? -1 : 0));
  }
  updateNote(data) {
    let index = this.invoiceNotes.findIndex(item => item.id == data.id);
    this.invoiceNotes[index] = new InvoiceNote(data);
  }
  editNote(data) {
    this.billableStateService.editNote(data);
  }

}
