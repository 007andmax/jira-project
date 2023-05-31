import { Component, OnInit, Input } from '@angular/core';
import { TicketProfileAttachment } from '../../class/ticket-profile-attachment';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { PreviewAttachmentComponent } from '../preview-attachment/preview-attachment.component';
import { PreviewAttachmentStateService } from '../preview-attachment/services/preview-attachment-state.service';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TicketStateService } from '../services/ticket-state.service';
import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';

@Component({
  selector: 'app-ticket-profile-attachments',
  templateUrl: './ticket-profile-attachments.component.html',
  styleUrls: ['./ticket-profile-attachments.component.scss']
})
export class TicketProfileAttachmentsComponent implements OnInit, OnDestroy {
  @Input() attachments: Array<TicketProfileAttachment> = [];
  hiddenAttachments: boolean = true;
  sub: Subscription = new Subscription();
  constructor(public ticketsService: TicketsService,
    private previewAttachmentStateService: PreviewAttachmentStateService,
    public modalService: NgbModal,
    public customerPortalStateService: CustomerPortalStateService,
    public ticketStateService: TicketStateService,
    public confirmStateService: ConfirmStateService,) { }


  ngOnInit() { }

  preview(attachmentId, contentType) {
    if (contentType === "image/jpg" || contentType === "image/png") this.previewAttachmentStateService.onInitPreview(`/file/${attachmentId}`);
  }
  public getTypeFile(name: string) {
    if (!name) return "attachment";
    let type = name.substring(name.lastIndexOf(".") + 1, name.length);
    return type.toUpperCase();
  }
  download(attachmentId, contentType, fileName) {

    this.ticketsService.downloadFile(attachmentId, contentType).subscribe(res => {
      var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
      const data = window.URL.createObjectURL(res);
      var link = document.createElement('a');
      link.href = data;
      if (isFirefox) {
        link.href = `${window.location.origin}/file/${attachmentId}/attachment`;
        link.target = "_blank";
      } else {
        link.download = fileName;
      }
      var e = document.createEvent('MouseEvents');
      e.initEvent('click', true, true);
      link.dispatchEvent(e);
    })
  }
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
