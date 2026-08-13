import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TicketStateService } from '../../ticket-edit-aside/services/ticket-state.service';
import { TicketProfileAttachmentFile } from '../../class/ticket-profile-attachment-file';
import { TicketsService } from 'src/app/services/tickets/tickets.service';

@Component({
  selector: 'app-preview-attachment-ticket',
  templateUrl: './preview-attachment-ticket.component.html',
  styleUrls: ['./preview-attachment-ticket.component.scss']
})
export class PreviewAttachmentTicketComponent implements OnInit, OnDestroy {
  src = "";
  file: TicketProfileAttachmentFile;
  show: boolean = false;
  sub: Subscription = new Subscription();
  constructor(public ticketStateService: TicketStateService, public ticketsService: TicketsService, public cd: ChangeDetectorRef) { }

  ngOnInit() {
    let getOnPreview = this.ticketStateService.onPreviewAttachment.subscribe(data => {
      this.file = data;
      this.src = `/file/${data.id}`;
      this.show = true;
      this.cd.detectChanges();
    })
    this.sub.unsubscribe();
  }
  download() {
    this.ticketsService.downloadFile(this.file.id, this.file.contentType).subscribe(res => {
      var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
      const data = window.URL.createObjectURL(res);
      var link = document.createElement('a');
      link.href = data;
      if (isFirefox) {
        link.href = `${window.location.origin}/file/${this.file.id}/attachment`;
        link.target = "_blank";
      } else {
        link.download = this.file.name;
      }
      var e = document.createEvent('MouseEvents');
      e.initEvent('click', true, true);
      link.dispatchEvent(e);
    })
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}