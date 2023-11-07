import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TicketProfileUpdate } from '../../../../class/ticket-profile-update';
import { TicketsService } from 'src/app/services/tickets/tickets.service';

@Component({
  selector: 'ticket-detail-profile-updates-note-edit',
  templateUrl: './ticket-detail-profile-updates-note-edit.component.html',
  styleUrls: ['./ticket-detail-profile-updates-note-edit.component.scss']
})
export class TicketDetailProfileUpdatesNoteEditComponent implements OnInit {
  @Output() onEdit = new EventEmitter();
  @Input() update: TicketProfileUpdate;
  @Input() idTicket: string;
  editUpdate: TicketProfileUpdate;
  constructor(private elRef: ElementRef,
    private ticketsService: TicketsService,) { }

  ngOnInit() {
    this.editUpdate = new TicketProfileUpdate(this.update);
    this.elRef.nativeElement.querySelector('#note-description').innerHTML = this.update.note;
  }
  public onChangeDescription(event) {
    this.editUpdate.note = event.target.value.replace(/\n/g, '<br/>');

  }
  public onPastDescription(value) {
    this.editUpdate.note = value.replace(/\n/g, '<br/>');
  }
  saveService() {
    this.ticketsService.updateNote(this.idTicket, this.update.id, this.elRef.nativeElement.querySelector("#note-description").innerHTML).subscribe(data => {
      this.onEdit.emit(null);
    })
  }
  cancelService() {
    this.onEdit.emit(null);
  }
}