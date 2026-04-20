import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FileManagerFile } from '../class/file-manager-file';
import { PreviewAttachmentStateService } from '../../tickets/tickets/ticket-edit-aside/preview-attachment/services/preview-attachment-state.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { FileManagementService } from 'src/app/services/file-management/file-management.service';
import * as moment from "moment";
import { PreviewFileStateService } from 'src/app/states/file-management/preview-file-state.service';
import { NgbDropdown, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgClass, NgIf } from '@angular/common';
import { DblclickDirective } from '../../../directives/dblclick/dblclick.directive';

@Component({
    selector: 'app-file-manager-item-file',
    templateUrl: './file-manager-item-file.component.html',
    styleUrls: ['./file-manager-item-file.component.scss'],
    standalone: true,
    imports: [NgbDropdownModule, DblclickDirective, NgClass, NgIf]
})
export class FileManagerItemFileComponent implements OnInit {
  @ViewChild('db', { static: true }) db: NgbDropdown;
  @Input() item: FileManagerFile;
  @Output() onRemove = new EventEmitter<any>();
  @Output() onFileInfo = new EventEmitter<any>();
  constructor(private previewAttachmentStateService: PreviewAttachmentStateService,
    public ticketsService: TicketsService,
    private fileManagementService: FileManagementService,
    public previewFileStateService: PreviewFileStateService,
  ) { }

  ngOnInit() {
  }
  isImage() {
    return this.item.contentType === "image/jpg" || this.item.contentType === "image/png" || this.item.contentType === "image/jpeg" || this.item.contentType === "image/gif";
  }
  preview() {
    if (this.item.contentType === "image/jpg" || this.item.contentType === "image/png" || this.item.contentType === "image/jpeg" || this.item.contentType === "image/gif") this.previewFileStateService.initPreview(this.item);
  }
  remove() {
    this.onRemove.emit(this.item);
  }
  fileInfo() {
    this.onFileInfo.emit(this.item);
  }

  download() {
    this.ticketsService.downloadFile(this.item.mediaFileId, this.item.contentType).subscribe(res => {
      var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
      const data = window.URL.createObjectURL(res);
      var link = document.createElement('a');
      link.href = data;
      if (isFirefox) {
        link.href = `${window.location.origin}/file/${this.item.mediaFileId}/attachment`;
        link.target = "_blank";
      } else {
        link.download = `${this.item.name}.${this.item.contentType.substring(this.item.contentType.indexOf("/") + 1, this.item.contentType.length)}`;
      }
      var e = document.createEvent('MouseEvents');
      e.initEvent('click', true, true);
      link.dispatchEvent(e);
    })
  }
  getCreateBy() {
    return moment(new Date(this.item.createdAt)).format('DD MMM YYYY hh:mm A');
  }
  getTypeFile() {
    if (this.item.contentType == 'application/pdf') return "PDF";
    if (this.item.contentType == 'text/plain' || this.item.contentType == 'application/msword' || this.item.contentType == 'application/vnd.oasis.opendocument.text') return "Document";
    if (this.item.contentType == 'text/csv') return "CSV";
    if (this.item.contentType == 'text/html') return "HTML";
    return "";
  }

}
