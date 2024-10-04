import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TicketProfileUpdate } from '../../../../class/ticket-profile-update';

@Component({
  selector: 'ticket-detail-profile-updates-note-info',
  templateUrl: './ticket-detail-profile-updates-note-info.component.html',
  styleUrls: ['./ticket-detail-profile-updates-note-info.component.scss']
})
export class TicketDetailProfileUpdatesNoteInfoComponent implements OnInit {

  @Output() onEdit = new EventEmitter();
  @Input() update: TicketProfileUpdate;
  @Input() isBlockChange: boolean;
  note: SafeHtml = '';
  constructor(private sanitized: DomSanitizer) { }

  ngOnInit() {
    this.note = this.getHtml(this.update.note);
  }
  ngOnChanges() {
    this.note = (this.update) ? this.getHtml(this.update.note) : '';
  }
  public edit() {
    this.onEdit.emit(null);
  }
  public getHtml(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}
