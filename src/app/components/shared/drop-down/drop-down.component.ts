import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, OnDestroy } from '@angular/core';
import { NgbDropdown, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { MatErrorComponent } from '../mat-error/mat-error.component';
import { NgClass, NgStyle, NgIf, NgFor } from '@angular/common';

@Component({
    selector: 'app-drop-down',
    templateUrl: './drop-down.component.html',
    styleUrls: ['./drop-down.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgbDropdownModule,
        NgClass,
        NgStyle,
        NgIf,
        NgFor,
        MatErrorComponent,
    ],
})
export class DropDownComponent implements OnInit, OnDestroy {
  selectedItem = null;
  @ViewChild('dp', { static: true }) dp: NgbDropdown;
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
  @Input() reducerSelectedItem: Function = () => (this.field) ? (this.selectedItem) ? this.selectedItem[this.field] : "" : this.selectedItem;
  @Input() list = [];
  @Input() placeholder = '';

  @Output() onAddItem = new EventEmitter<any>();
  @Output() onSelectedItem = new EventEmitter<any>();
  reqList = [];
  sub: Subscription = new Subscription();
  public isAdd: boolean = false;
  constructor(public elRef: ElementRef,
    public companiesStateService: CompaniesStateService,
    public usersStateService: UsersStateService,
    public customerPortalStateService: CustomerPortalStateService,
    public companiesService: CompaniesService,
    public devicesService: DevicesService,
    public ref: ChangeDetectorRef) { }


  ngOnInit() {
    if (this.class.length > 0) this.class = this.class;
    if (this.uiType) this.class.push(this.uiType);
    this.ref.markForCheck();
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
    this.ref.markForCheck();
  }
  /**
  * @description Check if use "search", will filter list items by 'field'. If 'field' no exist filter will by Array String. If search element doesn't exist, will init logic to show icon for add
  * @param {Object} event - Object from input
 */
  onCheckAdd(event) {
    if (this.search) this.list = this.reqList.filter(item => (this.field) ? item[this.field].toLowerCase().includes(event.target.value.toLowerCase()) : item.toLowerCase().includes(event.target.value.toLowerCase()))
    let index = this.list.findIndex(item => (this.field) ? item[this.field] === event.target.value : item === event.target.value);
    if (index === -1 && this.add) {
      this.isAdd = true;
    } else {
      this.isAdd = false;
    }
    this.ref.markForCheck();
  }
  public onFocus(event) {
    if (!this.dp.isOpen()) this.dp.open();
  }
  public addNewItem(data) {
    this.reqList.push(data);
    if (this.sort) this.reqList.sort((a, b) => (this.field) ? a[this.field].localeCompare(b[this.field]) : a.localeCompare(b));
    this.ref.markForCheck();
  }
  addItem() {
    this.onAddItem.emit(this.getInputText());
    this.isAdd = false;
    this.list = JSON.parse(JSON.stringify(this.reqList));
    this.ref.detectChanges();
  }
  getSelectedItemText() {
    return this.reducerSelectedItem(this.selectedItem);
  }
  public selectItemWithOutChanges(data) {
    this.isAdd = false;
    this.selectedItem = data;
    this.ref.markForCheck();
  }
  onSelect(data) {
    this.isAdd = false;
    this.selectedItem = data;
    this.onSelectedItem.emit(data);
    this.ref.detectChanges();
  }
  clearClient() {
    this.isAdd = false;
    this.selectedItem = null;
    this.elRef.nativeElement.querySelector("#dropdown1").value = "";
    this.list = JSON.parse(JSON.stringify(this.reqList));
    this.onSelectedItem.emit(null);
    this.ref.detectChanges();
  }
  public getInputText() {
    return this.elRef.nativeElement.querySelector("#dropdown1").value;
  }
  public clearWithOutChanges() {
    this.elRef.nativeElement.querySelector("#dropdown1").value = "";
    this.isAdd = false;
    this.selectedItem = null;
    this.ref.markForCheck();
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
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
