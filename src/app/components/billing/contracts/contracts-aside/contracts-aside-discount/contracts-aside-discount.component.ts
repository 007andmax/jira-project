import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TitleListType } from 'src/app/components/tickets/tickets/tickets-header/class/title-list-type';
import { ContractsUserDeviceService } from '../class/contracts-user-device-service';
import { NgFor, NgClass } from '@angular/common';
import { DecimalNumberDirective } from '../../../../../directives/decimal-number/decimal-number.directive';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-contracts-aside-discount',
    templateUrl: './contracts-aside-discount.component.html',
    styleUrls: ['./contracts-aside-discount.component.scss'],
    standalone: true,
    imports: [NgbDropdownModule, DecimalNumberDirective, NgFor, NgClass]
})
export class ContractsAsideDiscountComponent implements OnInit {
  @Input() service: ContractsUserDeviceService;
  selectedItem: TitleListType;
  list: Array<TitleListType> = [new TitleListType("Fixed ($)", "FIXED"), new TitleListType("Percentage (%)", "PERCENT")];
  @Output() onChange = new EventEmitter();
  constructor() { }

  ngOnInit() {
    this.selectedItem = this.list.find(item => item.type == this.service.discountType);
  }
  selected(item) {
    this.selectedItem = item;
    this.onChange.emit(item);
  }
  onChangeDiscountAmount(event) {
    this.service.discountAmount = event;
  }
  getSelected() {
    return this.selectedItem ? this.selectedItem.type == "FIXED" ? "$" : '%' : '';
  }
  checkSelected(item) {
    return this.selectedItem && this.selectedItem.type == item.type;
  }
  public trackByIndex(index, item) {
    return index;
  }
}
