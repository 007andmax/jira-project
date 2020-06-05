import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { TicketProfileUpdate } from '../../../../class/ticket-profile-update';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-ticket-profile-updates-note-info',
  templateUrl: './ticket-profile-updates-note-info.component.html',
  styleUrls: ['./ticket-profile-updates-note-info.component.scss']
})
export class TicketProfileUpdatesNoteInfoComponent implements OnInit {
  @Output() onEdit = new EventEmitter();
  @Input() update: TicketProfileUpdate;
  note: SafeHtml = '';
  constructor(private sanitized: DomSanitizer) { }

  ngOnInit() {
    this.note = this.getHtml(this.update.note);
  }
  ngDoCheck() {
   // this.note = this.getHtml(this.update.note);
  }
  ngOnChanges() {
    this.note = (this.update) ?  this.getHtml(this.update.note) : '';
  }
  edit() {
    this.onEdit.emit(null);
  }
  public getHtml(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}
