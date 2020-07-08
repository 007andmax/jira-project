import { Component, OnInit ,ViewEncapsulation  } from '@angular/core';
import { TerminalService } from '../_services/terminal.service';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TerminalComponent implements OnInit {
  create = false;
  closeResult = '';
  constructor(private terminalService: TerminalService,
    private toastr: ToastrService,
    private modalService: NgbModal  
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
    this.modalService.open(template, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismiss(reason)}`;
    });
  }

  private getDismiss(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


}
