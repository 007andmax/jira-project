import { Component, Input, OnInit } from '@angular/core';
import { FORMAT_DATE_2 } from 'src/ng2/app/const/date-picker';
import { ContractsFilterType } from '../../class/contracts-filter-type';
import { ServiceAgreement } from '../../class/service-agreement';
import * as moment from "moment";
import { InventoryStateService } from 'src/ng2/app/states/inventory/inventory-state.service';
import { CategoryProductitem } from 'src/ng2/class/category-product-item';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { ProductService } from 'src/ng2/app/services/product/product.service';
import { InventoryItem } from 'src/ng2/app/components/inventory/class/inventory-item';

@Component({
  selector: 'app-contracts-aside-product-service-preview',
  templateUrl: './contracts-aside-product-service-preview.component.html',
  styleUrls: ['./contracts-aside-product-service-preview.component.scss']
})
export class ContractsAsideProductServicePreviewComponent implements OnInit {
  selectedCompany: any;
  intervals: Array<string> = ['YEARLY', 'MONTHLY', '30 days', '15 days', '7 days'];
  selectedInterval: string = 'MONTHLY';
  selectedType = new ContractsFilterType('Service Contract/by other', 'SERVICE_CONTRACT', 'OTHER');
  @Input() contractsOther: ServiceAgreement = new ServiceAgreement();
  productList:Array<InventoryItem> = [];
  formatDate: string = FORMAT_DATE_2;
  type:string = "PRODUCTS";
  constructor(private inventoryStateService: InventoryStateService,
    private productService:ProductService,
    private companiesStateService: CompaniesStateService,) { }

  ngOnInit() {
    this.productService.getProducts().subscribe(data => {
      this.productList = data;
    })
    this.selectedCompany = this.companiesStateService.getCompanies().find(item => item.id === this.contractsOther.companyId);
    this.getSelectedInterval();
  }
  getSelectedInterval() {
    if (this.contractsOther.interval) {
      this.selectedInterval = this.contractsOther.interval;
    } else {
      this.selectedInterval = (this.contractsOther.customInterval === 30) ? '30 days' : (this.contractsOther.customInterval === 15) ? '15 days' : '7 days';
    }
  }
  parsedateForTotal(date) {
    return moment(date).format('DD MMM YYYY');
  }
  public getDuration(quantity) {
    var timeInMinutes = quantity * 60,
      hours = Math.floor(timeInMinutes / 60),
      minutes = Math.round(timeInMinutes - (hours * 60));
    return `${(hours < 10) ? '0' + hours : hours} : ${(minutes < 10) ? '0' + minutes : minutes}`

  }
  
  public getProduct(id) {
    return (this.productList.length > 0) ? this.productList.find(item => item.versionedId.id === id).description : "";
  }
}
