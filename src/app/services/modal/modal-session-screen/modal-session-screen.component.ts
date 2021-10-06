import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-session-screen',
  templateUrl: './modal-session-screen.component.html',
  styleUrls: ['./modal-session-screen.component.scss']
})
export class ModalSessionScreenComponent implements OnInit {
  @Input() public message = '';
  action: string = null;
  show: boolean = false;
  constructor(
   /* public activeModal: NgbActiveModal, */private eRef: ElementRef,) {

  }

  ngOnInit() {

  }
  public showModal() {
    this.show = true;
  }
  public logOut() {
    window.location.href = '/signIn';
    window.location.hash = '';
  }


  approveConfirm() {
    this.logOut();
    // this.activeModal.close();

  };


}
