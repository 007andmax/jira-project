import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { REMOVE_ATTACHMENT } from 'src/app/const/confirm';
import { TicketProfileAttachmentsComponent } from '../../ticket-edit-aside/ticket-profile-attachments/ticket-profile-attachments.component';
import { TicketProfile } from '../../class/ticket-profile';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  standalone: true,
  imports: [CommonModule, NgbDropdownModule],
  selector: 'ticket-detail-attachments',
  templateUrl: './ticket-detail-attachments.component.html',
  styleUrls: ['./ticket-detail-attachments.component.scss']
})
export class TicketDetailAttachmentsComponent extends TicketProfileAttachmentsComponent {
  indexAllDownload: number = 0;
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  ngOnInit() {
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVE_ATTACHMENT) {
          this.onDelete();
        }
      }
    })
    this.sub.add(getConfirm);
  }
  onDelete() {
    this.ticketsService.deleteFile(this.ticketStateService.getAttachmentForRemove().file.id).subscribe(data => {
      this.confirmStateService.initRequest(false);
    }, err => {
      this.confirmStateService.initRequest(false);
    })
  }
  downloadAll() {
    this.ticketsService.downloadFile(this.attachments[this.indexAllDownload].file.id, this.attachments[this.indexAllDownload].file.contentType).subscribe(res => {
      var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
      const data = window.URL.createObjectURL(res);
      var link = document.createElement('a');
      link.href = data;
      if (isFirefox) {
        link.href = `${window.location.origin}/file/${this.attachments[this.indexAllDownload].file.id}/attachment`;
        link.target = "_blank";
      } else {
        link.download = this.attachments[this.indexAllDownload].file.name;
      }
      var e = document.createEvent('MouseEvents');
      e.initEvent('click', true, true);
      link.dispatchEvent(e);
      this.indexAllDownload += 1;
      if (this.indexAllDownload !== this.attachments.length) this.downloadAll();
      if (this.indexAllDownload === this.attachments.length) this.indexAllDownload = 0;
    })
  }
  deleteFile(id) {
    this.ticketStateService.setAttachmentForRemove(this.attachments.find(item => item.file.id == id));
    this.confirmStateService.setConfirmAction(REMOVE_ATTACHMENT);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = `Delete Attachment`;
    modalRef.componentInstance.message = `Are you sure you want to delete this attachment?`;
  }
}
