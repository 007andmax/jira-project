import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FileManagementFile } from '../class/file-management-file';
import { PreviewAttachmentStateService } from '../../tickets/tickets/ticket-edit-aside/preview-attachment/services/preview-attachment-state.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { FileManagementService } from 'src/app/services/file-management/file-management.service';
import * as moment from "moment";
import { PreviewFileStateService } from 'src/app/states/file-management/preview-file-state.service';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-file-management-item-file',
  templateUrl: './file-management-item-file.component.html',
  styleUrls: ['./file-management-item-file.component.scss']
})
export class FileManagementItemFileComponent implements OnInit {
  @ViewChild('db') db: NgbDropdown;
  @Input() item: FileManagementFile;
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
    return this.item.contentType === "image/jpg" || this.item.contentType === "image/png" || this.item.contentType === "image/jpeg";
  }
  preview() {
    if (this.item.contentType === "image/jpg" || this.item.contentType === "image/png" || this.item.contentType === "image/jpeg") this.previewFileStateService.initPreview(this.item);
  }
  remove() {
    this.onRemove.emit(this.item);
  }
  fileInfo() {
    this.onFileInfo.emit(this.item);
  }
  download() {
    var req = new XMLHttpRequest();
    req.responseType = (this.item.contentType == "text/plain") ? "document" : "blob";
    req.open('GET', this.item.url, true);
    req.onload = (oEvent) => {
      console.log("oEvent", oEvent);
      var blob = new Blob([req.response], { type: this.item.contentType });
      console.log("blob", blob);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${this.item.name}.${this.item.contentType.substring(this.item.contentType.indexOf("/") + 1, this.item.contentType.length)}`;
      link.click();
    };
    req.onerror = (error) => {
      console.log("error", req);
    }
    req.send();
  }
  getCreateBy() {
    return moment(new Date(this.item.createdAt)).format('DD MMM YYYY');
  }
  getTypeFile() {
    if (this.item.contentType == 'application/pdf') return "PDF";
    if (this.item.contentType == 'text/plain' || this.item.contentType == 'application/msword' || this.item.contentType == 'application/vnd.oasis.opendocument.text') return "Document";
    if (this.item.contentType == 'text/csv') return "CSV";
    if (this.item.contentType == 'text/html') return "HTML";
    return "";
  }

}
