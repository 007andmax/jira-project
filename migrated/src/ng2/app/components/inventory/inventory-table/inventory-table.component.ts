import { Component, OnInit, Input } from '@angular/core';
import { Product } from 'src/ng2/app/interfaces/product/product';
import { InventoryItem } from '../class/inventory-item';
import { ItemFilterPerson } from '../../left-panel/left-panel-companies/class/item-filter-person';

@Component({
  selector: 'app-inventory-table',
  templateUrl: './inventory-table.component.html',
  styleUrls: ['./inventory-table.component.scss']
})
export class InventoryTableComponent implements OnInit {
  @Input() inventory: InventoryItem;
  @Input() companies;
  @Input() glNumbers;
  @Input() taxes;
  
  constructor() { }

  ngOnInit() {
  }

  public getGlNumberName() {
    let glNumber = this.inventory.glNumber;
    if (!glNumber) return '';
  //  let index = this.glNumbers.findIndex(item => item.id === glNumber.id);
   // return (index > -1) ? this.glNumbers[index].glNumber : '';
   return (glNumber.glNumber) ? glNumber.glNumber : '';
}
  public getCompanyName() {
    let conpany = this.companies.find(item => item.id === this.inventory.companyId);
    return (conpany) ? conpany.name : "";
  }

  getSelectedTaxNames() {
    let taxes = [];
     this.taxes.forEach(item => {
      let index = this.inventory.taxIds.findIndex(taxId => taxId === item.id);
      if (index > -1) taxes.push(item.name);
     })
    return (taxes.length > 0) ? taxes.join(', ') : 'No taxes';
  };

  parseTotal(value) {
    return parseFloat(value.toString()).toFixed(2)
  }
}
