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
  @Input() taxes;
  constructor() { }

  ngOnInit() {
  }

  public getCompanyById(id) {
    let conpany = this.companies.find(item => item.id === id);
    return (conpany) ? conpany.name : "";
  }

  getSelectedTaxNames() {
    let taxes = this.inventory.taxes.map(item => {
      return item.name;
    })
    return (taxes.length > 0) ? taxes.join(', ') : 'No taxes';
  };

  parseTotal(value) {
    return parseFloat(value.toString()).toFixed(2)
  }
}
