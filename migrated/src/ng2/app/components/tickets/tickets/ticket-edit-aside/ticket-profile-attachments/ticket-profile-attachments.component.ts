import { Component, OnInit, Input } from '@angular/core';
import { TicketProfileAttachment } from '../../class/ticket-profile-attachment';
import { TicketsService } from 'src/ng2/app/services/tickets/tickets.service';

@Component({
  selector: 'app-ticket-profile-attachments',
  templateUrl: './ticket-profile-attachments.component.html',
  styleUrls: ['./ticket-profile-attachments.component.scss']
})
export class TicketProfileAttachmentsComponent implements OnInit {
@Input() attachments:Array<TicketProfileAttachment> = [];
  constructor(private ticketsService:TicketsService) { }

  ngOnInit() {
  }
download(attachmentId, fileName) {
  
this.ticketsService.downloadPdf(attachmentId).subscribe(data => {
  console.log("data",data);
})
   
 /* const indexOfDot = fileName && fileName.lastIndexOf('.');
  const fileFormat = fileName && fileName.substring(indexOfDot);
  if (fileFormat === '.pdf') {
    window.open('/file/' + attachmentId, '_blank');
  } else {
    var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  
  var link = document.createElement('a');
  link.download = fileName;
  //   link.download=`${this.apiUrl}saleQuotes/${id}/pdf.pdf`;
  if (isFirefox) {
    link.href = '/file/' + attachmentId;
    link.target = "_blank";
  } else {
    link.download = fileName;
  }
  console.log("link",link);
  var e = document.createEvent('MouseEvents');
  e.initEvent('click', true, true);
  link.dispatchEvent(e);
  }*/
 
}


}
