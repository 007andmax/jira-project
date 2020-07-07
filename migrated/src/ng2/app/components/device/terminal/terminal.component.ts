import { Component, OnInit ,ViewEncapsulation  } from '@angular/core';
import { TerminalService } from '../_services/terminal.service';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';



@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TerminalComponent implements OnInit {
  create = false;
  modalRef: BsModalRef;
  constructor(private terminalService: TerminalService,
    private toastr: ToastrService,
    private modalService: BsModalService  
    ) { }

  ngOnInit() {
    this.getAllTerminalList();
  }

  getAllTerminalList () {
    this.terminalService.getAllTerminalList()
    .pipe(first())
    .subscribe(data => {
    },
    error => {
    });
  }


 
  
 
  openModal(template) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'confirm-control modal-dialog-centered' })
    );
  }


}
