import { Component, OnInit, Output, EventEmitter, Input, ElementRef } from '@angular/core';
import { TicketProfileUpdate } from '../../../../class/ticket-profile-update';
import { TicketsService } from 'src/ng2/app/services/tickets/tickets.service';

@Component({
  selector: 'app-ticket-profile-updates-note-edit',
  templateUrl: './ticket-profile-updates-note-edit.component.html',
  styleUrls: ['./ticket-profile-updates-note-edit.component.scss']
})
export class TicketProfileUpdatesNoteEditComponent implements OnInit {
  @Output() onEdit = new EventEmitter();
  @Input() update: TicketProfileUpdate;
  @Input() idTicket: string;
  editUpdate: TicketProfileUpdate;
  constructor( private elRef: ElementRef,
    private ticketsService: TicketsService,) { }

  ngOnInit() {
    this.editUpdate = new TicketProfileUpdate(this.update);
    this.elRef.nativeElement.querySelector('#note-description').value = this.update.note;
  }
  public onChangeDescription(event) {
    this.editUpdate.note = event.target.value;

  }
  public onPastDescription(value) {
    this.editUpdate.note = value;
  }
  saveService() {
    this.ticketsService.updateNote(this.idTicket,this.update.id,this.editUpdate.note).subscribe(data => {
      this.onEdit.emit(null);
    })
  }
  cancelService() {
    this.onEdit.emit(null);
  }
}
