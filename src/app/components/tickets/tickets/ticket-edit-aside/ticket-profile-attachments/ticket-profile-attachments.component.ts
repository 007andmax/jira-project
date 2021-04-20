import { Component, OnInit, Input } from '@angular/core';
import { TicketProfileAttachment } from '../../class/ticket-profile-attachment';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { PreviewAttachmentComponent } from '../preview-attachment/preview-attachment.component';
import { PreviewAttachmentStateService } from '../preview-attachment/services/preview-attachment-state.service';

@Component({
  selector: 'app-ticket-profile-attachments',
  templateUrl: './ticket-profile-attachments.component.html',
  styleUrls: ['./ticket-profile-attachments.component.scss']
})
export class TicketProfileAttachmentsComponent implements OnInit {
  @Input() attachments: Array<TicketProfileAttachment> = [];
  hiddenAttachments: boolean = true;
  constructor(private ticketsService: TicketsService,
    private previewAttachmentStateService: PreviewAttachmentStateService) { }

  ngOnInit() { }

  preview(attachmentId, contentType) {
    if (contentType === "image/jpg" || contentType === "image/png") this.previewAttachmentStateService.onInitPreview(`/file/${attachmentId}`);
  }
  public getTypeFile(name: string) {
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

}
