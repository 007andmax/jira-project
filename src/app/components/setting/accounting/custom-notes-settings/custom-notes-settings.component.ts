import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { InvoiceNote } from 'src/app/components/billing/billable/class/invoice-note';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { DELETE_NOTE } from 'src/app/const/confirm';
import { BillableService } from 'src/app/services/billable/billable.service';
import { BillableStateService } from 'src/app/states/billable/billable-state.service';
import { CustomNoteFilter } from './class/custom-note-filter';
import { TicketSortBy } from 'src/app/components/tickets/tickets/class/ticket-sort-by';

@Component({
  selector: 'custom-notes-settings',
  templateUrl: './custom-notes-settings.component.html',
  styleUrls: ['./custom-notes-settings.component.scss']
})
export class CustomNotesSettingsComponent implements OnInit, OnDestroy {
  invoiceNotes: Array<InvoiceNote> = [];
  showPreloader: boolean = true;
  filter: CustomNoteFilter = new CustomNoteFilter();
  sub: Subscription = new Subscription();
  sortBy: TicketSortBy = new TicketSortBy('title', 'ASC');
  constructor(private billableService: BillableService,
    private billableStateService: BillableStateService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal) { }


  ngOnInit() {
    this.billableService.getInvoiceNote().subscribe(data => {
      this.invoiceNotes = data.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ?
        1 : ((b.title.toLowerCase() > a.title.toLowerCase()) ? -1 : 0));
      this.showPreloader = false;
    })
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_NOTE) {
          this.onRemoveNote();
        }
      }
    })
    this.sub.add(getConfirm);
  }
  onFilter(field) {
    this.sortBy.sortBy = field;
    this.filter.onFilter(field, this.invoiceNotes);
    this.sortBy.sortDirection = this.filter.direction;
  }
  onRemoveNote() {
    this.billableService.deleteNote(this.billableStateService.getNoteForRemove().id).subscribe(data => {
      this.confirmStateService.initRequest(false);
      let index = this.invoiceNotes.findIndex(item => item.id == this.billableStateService.getNoteForRemove().id);
      this.invoiceNotes.splice(index, 1);
    }, err => {
      this.confirmStateService.initRequest(false);
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
  deleteNote(item) {
    this.confirmStateService.setConfirmAction(DELETE_NOTE);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = `Delete Custom Note`;
    modalRef.componentInstance.message = `Are you sure you want to delete this custom note?`;
    this.billableStateService.setNoteForRemove(item);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
