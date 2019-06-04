import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-modal-quote',
  templateUrl: './modal-quote.component.html',
  styleUrls: ['./modal-quote.component.scss']
})
export class ModalQuoteComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

}
