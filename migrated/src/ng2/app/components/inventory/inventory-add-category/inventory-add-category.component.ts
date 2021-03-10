import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'inventory-add-category',
  templateUrl: './inventory-add-category.component.html',
  styleUrls: ['./inventory-add-category.component.css']
})
export class InventoryAddCategoryComponent implements OnInit {
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  public save() {
    this.close();
  }
  public close() {
    this.onClose.emit(null);
  }
}
