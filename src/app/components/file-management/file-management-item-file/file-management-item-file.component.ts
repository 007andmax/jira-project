import { Component, Input, OnInit } from '@angular/core';
import { FileManagementFile } from '../class/file-management-file';
import { PreviewAttachmentStateService } from '../../tickets/tickets/ticket-edit-aside/preview-attachment/services/preview-attachment-state.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';

@Component({
  selector: 'app-file-management-item-file',
  templateUrl: './file-management-item-file.component.html',
  styleUrls: ['./file-management-item-file.component.scss']
})
export class FileManagementItemFileComponent implements OnInit {
  @Input() item: FileManagementFile;
  constructor(private previewAttachmentStateService: PreviewAttachmentStateService,
    public ticketsService: TicketsService,
  ) { }

  ngOnInit() {
  }
  preview() {
    if (this.item.contentType === "image/jpg" || this.item.contentType === "image/png" || this.item.contentType === "image/jpeg") this.previewAttachmentStateService.onInitPreview(`/file/${this.item.id}`);
  }
  remove() {

  }
  download() {
    var link = document.createElement('a');
    link.href = this.item.url;
    link.target = "_blank";
    link.download = `${this.item}.${this.item.contentType.substring(this.item.contentType.indexOf("/"), this.item.contentType.length)}`;
    var e = document.createEvent('MouseEvents');
    e.initEvent('click', true, true);
    link.dispatchEvent(e);

  }
  getCreateBy() {
    return this.item.createdAt;
  }

}
