import { Component, Input, OnInit } from '@angular/core';
import { FileManagementFile } from '../class/file-management-file';
import { PreviewAttachmentStateService } from '../../tickets/tickets/ticket-edit-aside/preview-attachment/services/preview-attachment-state.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { FileManagementService } from 'src/app/services/file-management/file-management.service';

@Component({
  selector: 'app-file-management-item-file',
  templateUrl: './file-management-item-file.component.html',
  styleUrls: ['./file-management-item-file.component.scss']
})
export class FileManagementItemFileComponent implements OnInit {
  @Input() item: FileManagementFile;
  constructor(private previewAttachmentStateService: PreviewAttachmentStateService,
    public ticketsService: TicketsService,
    private fileManagementService: FileManagementService
  ) { }

  ngOnInit() {
  }
  preview() {
    if (this.item.contentType === "image/jpg" || this.item.contentType === "image/png" || this.item.contentType === "image/jpeg") this.previewAttachmentStateService.onInitPreview(this.item.url);
  }
  remove() {

  }
  download() {
    console.log(`${this.item.name}.${this.item.contentType.substring(this.item.contentType.indexOf("/") + 1, this.item.contentType.length)}`);
    var req = new XMLHttpRequest();
    req.responseType = "arraybuffer";
    req.open('GET', `/file/${this.item.mediaFileId}`, true); /* Третий аргумент true означает асинхронность */
    req.onload = (oEvent) => {
      var blob = new Blob([req.response], { type: this.item.contentType });
      console.log("blob", blob);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${this.item.name}.${this.item.contentType.substring(this.item.contentType.indexOf("/") + 1, this.item.contentType.length)}`;
      link.click();
    };
    req.send(null);
  }
  getCreateBy() {
    return this.item.createdAt;
  }

}
