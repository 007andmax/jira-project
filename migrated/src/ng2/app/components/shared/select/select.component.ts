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
  @Output() onChange = new EventEmitter<any>();
  selected:boolean = false;
  constructor() { }

  ngOnInit() {
  }
  onSelect(data) {
    this.selectedItem = data;
    this.selected = true;
    this.onChange.emit(data);
  }
  clearClient() {
    this.selected = false;
    this.selectedItem = '';
    this.onChange.emit(null);
  }



}
