import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FileManagerFile } from '../class/file-manager-file';
import { PreviewAttachmentStateService } from '../../tickets/tickets/ticket-edit-aside/preview-attachment/services/preview-attachment-state.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { FileManagementService } from 'src/app/services/file-management/file-management.service';
import * as moment from "moment";
import { PreviewFileStateService } from 'src/app/states/file-management/preview-file-state.service';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-file-manager-item-file',
  templateUrl: './file-manager-item-file.component.html',
  styleUrls: ['./file-manager-item-file.component.scss']
})
export class FileManagerItemFileComponent implements OnInit {
  @ViewChild('db') db: NgbDropdown;
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
    if (this.isImage()) {
      fetch(`/file/${this.item.mediaFileId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.blob();
        })
        .then(blob => {
          const downloadUrl = window.URL.createObjectURL(blob); // Create a URL for the Blob
          const link = document.createElement('a'); // Create an anchor element
          link.href = downloadUrl;
          link.download = `${this.item.name}.${this.item.contentType.substring(this.item.contentType.indexOf("/") + 1, this.item.contentType.length)}`; // Set the file name for download
          link.click(); // Trigger the download
          window.URL.revokeObjectURL(downloadUrl); // Clean up by revoking the object URL
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
        });
    } else {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', this.item.url, true);
      xhr.responseType = 'blob';

      xhr.onload = () => {
        if (xhr.status === 200) {
          const blob = xhr.response;
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${this.item.name}.${this.item.contentType.substring(this.item.contentType.indexOf("/") + 1, this.item.contentType.length)}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        } else {
          console.error('Download error:', xhr.status, xhr.statusText);
        }
      };

      xhr.onerror = () => {
        console.error('Download error:', xhr.status, xhr.statusText);
      };

      xhr.send();
    }

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
