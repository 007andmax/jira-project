import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-mat-chip-list',
  templateUrl: './mat-chip-list.component.html',
  styleUrls: ['./mat-chip-list.component.scss']
})
export class MatChipListComponent implements OnInit {
  @Input() items: any = [];
  @Output() onChangeItems = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  ngDoCheck() {
    this.onChangeItems.emit(this.items);
  }
}
