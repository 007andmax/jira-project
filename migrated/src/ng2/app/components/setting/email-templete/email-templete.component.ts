import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'app-email-templete',
  templateUrl: './email-templete.component.html',
  styleUrls: ['./email-templete.component.scss'],
})
export class EmailTempleteComponent implements OnInit {
  public show = false;
  public buttonName: any = 'Show Keyword Description + ';

  modalRef: BsModalRef;
  constructor(private modalService: BsModalService) {}

  openModal(template) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'manage-tags modal-dialog-centered' }),
    );
  }

  ngOnInit() {}

  toggle() {
    this.show = !this.show;

    if (this.show) {
      this.buttonName = 'Hide Keyword Description - ';
    } else {
      this.buttonName = 'Show Keyword Description + ';
    }
  }
}
