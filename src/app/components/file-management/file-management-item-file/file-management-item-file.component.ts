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
    this.fileManagementService.downloadFile(`file/${this.item.mediaFileId}`)
      .subscribe((response: any) => {
        let blob = response.blob();
        console.log("blob", blob);
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${this.item}.${this.item.contentType.substring(this.item.contentType.indexOf("/"), this.item.contentType.length)}`;
        link.click();
      })
  }
  getCreateBy() {
    return this.item.createdAt;
  }

}
