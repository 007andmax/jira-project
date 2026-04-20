import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-contracts-aside-select-type',
    templateUrl: './contracts-aside-select-type.component.html',
    styleUrls: ['./contracts-aside-select-type.component.scss'],
    standalone: true,
    imports: [NgClass]
})
export class ContractsAsideSelectTypeComponent implements OnInit {
  selected_type: string = null;
  @Output() onSelect = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }
  public select(data) {
    this.selected_type = data;
    this.onSelect.emit(data);
  }

}
