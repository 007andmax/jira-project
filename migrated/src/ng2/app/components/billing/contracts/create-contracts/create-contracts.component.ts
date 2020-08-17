import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-create-contracts',
  templateUrl: './create-contracts.component.html',
  styleUrls: ['./create-contracts.component.scss']
})
export class CreateContractsComponent implements OnInit {
  @Output() onClose = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  close() {
    this.onClose.emit(null);
  }
}
