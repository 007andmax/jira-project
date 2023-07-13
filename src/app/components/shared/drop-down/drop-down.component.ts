import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';

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
  @Input() preloader: boolean = false;
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
  constructor(public elRef: ElementRef,
    public companiesStateService: CompaniesStateService,
    public usersStateService: UsersStateService,
    public customerPortalStateService: CustomerPortalStateService,) { }

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
    this.onAddItem.emit(this.getInputText());
    this.isAdd = false;
    this.list = JSON.parse(JSON.stringify(this.reqList));
  }
  getSelectedItemText() {
    return (this.field) ? (this.selectedItem) ? this.selectedItem[this.field] : "" : this.selectedItem;
  }
  public selectItemWithOutChanges(data) {
    this.isAdd = false;
    this.selectedItem = data;
  }
  onSelect(data) {
    this.isAdd = false;
    this.selectedItem = data;
    this.onSelectedItem.emit(data);
  }
  clearClient() {
    this.isAdd = false;
    this.selectedItem = null;
    this.elRef.nativeElement.querySelector("#dropdown1").value = "";
    this.list = JSON.parse(JSON.stringify(this.reqList));
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

  public isSelected(item) {
    if (this.field) return this.selectedItem && this.selectedItem[this.field] == item[this.field];
    return this.selectedItem && this.selectedItem == item;
  }

  reduceItemName(item) {
    return this.reducerItem(item);
  }

}
