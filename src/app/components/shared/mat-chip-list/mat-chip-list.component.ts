import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-mat-chip-list',
    templateUrl: './mat-chip-list.component.html',
    styleUrls: ['./mat-chip-list.component.scss'],
    standalone: true
})
export class MatChipListComponent implements OnInit {
  @Input() items: any = [];
  @Output() onChangeItems = new EventEmitter();
  constructor(private elRef: ElementRef) { }

  ngOnInit() {
    if (this.elRef.nativeElement.querySelector("input")) this.elRef.nativeElement.querySelector("input").classList.add('mat-chip-input', 'mat-input-element');
  }
  ngDoCheck() {
    this.onChangeItems.emit(this.items);
  }
}
