import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { TicketProfileUpdate } from '../../../../class/ticket-profile-update';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AppService } from 'src/app/states/app/app.service';
import { TicketStateService } from '../../../services/ticket-state.service';

@Component({
  selector: 'app-ticket-profile-updates-note-info',
  templateUrl: './ticket-profile-updates-note-info.component.html',
  styleUrls: ['./ticket-profile-updates-note-info.component.scss']
})
export class TicketProfileUpdatesNoteInfoComponent implements OnInit {
  @Output() onEdit = new EventEmitter();
  @Input() update: TicketProfileUpdate;
  @Input() isBlockChange: boolean;
  note: SafeHtml = '';
  constructor(private sanitized: DomSanitizer,
    private ticketStateService: TicketStateService,
    private appService: AppService,) { }

  ngOnInit() {
    this.note = this.getHtml(this.update.note);
  }
  ngOnChanges() {
    this.note = (this.update) ? this.getHtml(this.update.note) : '';
  }
  edit() {
    if (this.appService.checkMobile()) {
      this.ticketStateService.setEditUpdate({ updateId: this.update.id, update: this.update, type: this.update.type });
      return;
    }
    this.onEdit.emit(null);
  }
  public getHtml(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}
