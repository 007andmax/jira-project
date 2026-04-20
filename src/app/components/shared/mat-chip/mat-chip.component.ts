import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-mat-chip',
    templateUrl: './mat-chip.component.html',
    styleUrls: ['./mat-chip.component.scss'],
    standalone: true,
    imports: [NgIf]
})
export class MatChipComponent implements OnInit {
  @Input() value: string;
  @Input() isRemove: boolean;
  @Output() onClose = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  remove() {
    this.onClose.emit(null);
  }
}
