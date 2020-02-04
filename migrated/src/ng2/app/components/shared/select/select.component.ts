import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {
  selectedItem = '';
  @Input() list = [];
  @Input() placeholder = '';
  @Output() omChange = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }
  onSelect(data) {
    this.selectedItem = data;
  }


}
