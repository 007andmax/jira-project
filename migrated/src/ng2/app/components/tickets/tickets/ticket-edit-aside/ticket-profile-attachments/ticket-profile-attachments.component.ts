import { Component, OnInit, Input } from '@angular/core';
import { TicketProfileAttachment } from '../../class/ticket-profile-attachment';
import { TicketsService } from 'src/ng2/app/services/tickets/tickets.service';

@Component({
  selector: 'app-ticket-profile-attachments',
  templateUrl: './ticket-profile-attachments.component.html',
  styleUrls: ['./ticket-profile-attachments.component.scss']
})
export class TicketProfileAttachmentsComponent implements OnInit {
  @Input() attachments: Array<TicketProfileAttachment> = [];
  hiddenAttachments: boolean = false;
  constructor(private ticketsService: TicketsService) { }

  ngOnInit() {
  }
  download(attachmentId, contentType, fileName) {

    this.ticketsService.downloadFile(attachmentId, contentType).subscribe(res => {
      var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

      const data = window.URL.createObjectURL(res);
      var link = document.createElement('a');
      link.href = data;
      //   link.download=`${this.apiUrl}saleQuotes/${id}/pdf.pdf`;
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


}
