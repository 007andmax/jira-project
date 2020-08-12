import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-default-services-add',
  templateUrl: './default-services-add.component.html',
  styleUrls: ['./default-services-add.component.scss']
})
export class DefaultServicesAddComponent implements OnInit {
  @Output() onClose = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

  close() {
    this.onClose.emit(null);
  }
}
