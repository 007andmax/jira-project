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
  hiddenAttachments:boolean = false;
  constructor(private ticketsService: TicketsService) { }

  ngOnInit() {
  }
  download(attachmentId, fileName) {

  this.ticketsService.downloadPdf(attachmentId).subscribe(data => {
      console.log("data",data);
    })
    return;
    const indexOfDot = fileName && fileName.lastIndexOf('.');
    const fileFormat = fileName && fileName.substring(indexOfDot);
    var link = document.createElement('a');
    link.target = "_blank";
    link.href = '/file/' + attachmentId + fileFormat;

    if (link.download !== undefined) {
      //Set HTML5 download attribute. This will prevent file from opening if supported.
     

      // alert(url);
      // alert(fileName);
      //if (!open) {
        link.download = fileName;

    //  }

      // alert(link.download)
    }

    //Dispatching click event.
    if (document.createEvent) {
      var e = document.createEvent('MouseEvents');
      e.initEvent('click', true, true);
      link.dispatchEvent(e);
      return true;
    }
  //  }

  }


}
