import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';

@Component({
  selector: 'app-drop-down',
  templateUrl: './drop-down.component.html',
  styleUrls: ['./drop-down.component.scss']
})
export class DropDownComponent implements OnInit {
  selectedItem = null;

  @Input() dropdownWidth: string = null;
  @Input() dropdownHeight: string = null;

  @Input() widthInput: string = null;
  @Input() heightInput: string = null;
  @Input() title: string = null;
  @Input() sort: boolean = true;
  @Input() errorMessage: string = null;
  @Input() container: string = null;
  @Input() uiType: string = null;
  @Input() field: string = null;
  @Input() validate: boolean = true;
  @Input() search: boolean = false;
  @Input() change: boolean = false;
  @Input() add: boolean = false;
  @Input() class = [];
  @Input() editItem: any = null;
  @Input() isBlockClear: boolean = false;
  @Input() maxlength: number = null;
  @Input() isDisabled: boolean = false;
  @Input() reducerItem: Function = (item) => (this.field) ? item[this.field] : item;

  @Input() list = [];
  @Input() placeholder = '';

  @Output() onAddItem = new EventEmitter<any>();
  @Output() onSelectedItem = new EventEmitter<any>();
  reqList = [];

  public isAdd: boolean = false;
  constructor(private elRef: ElementRef,) { }

  ngOnInit() {
    if (this.class.length > 0) this.class = this.class;
    if (this.uiType) this.class.push(this.uiType);

  }
  ngDoCheck() {
    if (this.sort) this.list.sort((a, b) => (this.field) ? a[this.field].localeCompare(b[this.field]) : a.localeCompare(b));
    if (this.reqList.length === 0) this.reqList = JSON.parse(JSON.stringify(this.list));
    if (this.editItem) this.selectedItem = (this.field) ? this.editItem : this.editItem;
  }
  public reset(data) {
    this.list = data;
    if (this.sort) this.list.sort((a, b) => (this.field) ? a[this.field].localeCompare(b[this.field]) : a.localeCompare(b));
    this.reqList = JSON.parse(JSON.stringify(this.list));
  }

  onCheckAdd(event) {
    if (this.search) this.list = this.reqList.filter(item => (this.field) ? item[this.field].toLowerCase().includes(event.target.value.toLowerCase()) : item.toLowerCase().includes(event.target.value.toLowerCase()))
    let index = this.list.findIndex(item => (this.field) ? item[this.field] === event.target.value : item === event.target.value);
    if (index === -1 && this.add) {
      this.isAdd = true;
    } else {
      this.isAdd = false;
    }
  }
  public addNewItem(data) {
    this.reqList.push(data);
    if (this.sort) this.reqList.sort((a, b) => (this.field) ? a[this.field].localeCompare(b[this.field]) : a.localeCompare(b));
  }
  addItem() {
    this.onAddItem.emit((this.selectedItem) ? this.selectedItem : this.getInputText());
    this.isAdd = false;
    this.list = JSON.parse(JSON.stringify(this.reqList));
  }
  getSelectedItemText() {
    return (this.field) ? (this.selectedItem) ? this.selectedItem[this.field] : "" : this.selectedItem;
  }
  onSelect(data) {
    this.isAdd = false;
    this.selectedItem = data;
    this.onSelectedItem.emit(data);
  }
  clearClient() {
    this.isAdd = false;
    this.selectedItem = null;
    this.onSelectedItem.emit(null);
  }
  public getInputText() {
    return this.elRef.nativeElement.querySelector("#dropdown1").value;
  }
  public clearWithOutChanges() {
    this.isAdd = false;
    this.selectedItem = null;
  }

  dividePosition(position) {
    return `${(parseInt(position) / 2)}px`;
  }

  reduceItemName(item) {
    return this.reducerItem(item);
  }

}
