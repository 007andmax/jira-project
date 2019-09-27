import { Component, ViewChild ,OnInit } from '@angular/core';
import {  BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
declare var $;

@Component({
  selector: 'app-tech-users',
  templateUrl: './tech-users.component.html',
  styleUrls: ['./tech-users.component.scss']
})
export class TechUsersComponent implements OnInit {

  dtOption: any = {};
  modalRef: BsModalRef;
  constructor(private modalService: BsModalService) {}
  openModal(template) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'manage-tags modal-dialog-centered' })
    );
  }
  editTag(template2) {
    this.modalRef = this.modalService.show(
      template2,
      Object.assign({}, { class: 'manage-tags modal-dialog-centered' })
    );
  }

  ngOnInit() {
  }

}
