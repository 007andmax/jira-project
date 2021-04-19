import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { InventoryStateService } from 'src/app/states/inventory/inventory-state.service';
import { Subscription } from 'rxjs';
import { InventoryItem } from '../class/inventory-item';
import { GlNumberStateService } from 'src/app/states/gl-number/gl-number-state.service';
import { GlNumber } from 'src/class/gl-number/gl-number';
import { Tax } from 'src/class/taxes/tax';
import { TaxesStateService } from 'src/app/states/taxes/taxes-state.service';
import { GlNumberService } from 'src/app/services/gl-number/gl-number.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { Company } from 'src/app/interfaces/company/company';
import { CategoryProduct } from 'src/app/interfaces/product/category-product';
import { ProductService } from 'src/app/services/product/product.service';
import { InventoryValidate } from '../class/inventory-validate';
import { SelectSearchComponent } from '../../shared/select-search/select-search.component';
import { InventoryAddBodyComponent } from './inventory-add-body/inventory-add-body.component';

@Component({
  selector: 'app-inventory-add-aside',
  templateUrl: './inventory-add-aside.component.html',
  styleUrls: ['./inventory-add-aside.component.scss']
})
export class InventoryAddAsideComponent implements OnInit, OnDestroy {
  @ViewChild('body') body: InventoryAddBodyComponent;
  opened: boolean = false;
  sub: Subscription = new Subscription();

  constructor(private inventoryStateService: InventoryStateService,
    private taxesStateService: TaxesStateService,
    private glNumberStateService: GlNumberStateService,
    private companiesStateService: CompaniesStateService,
    private productService: ProductService,
    private elRef: ElementRef,
    public cd: ChangeDetectorRef,
    private glNumberService: GlNumberService) { }

  ngOnInit() {
    this.onShowAside();
  }
  public onShowAside() {
    let getShowAsideForAdd = this.inventoryStateService.getShowAsideForAdd().subscribe(() => {
      this.opened = true;
    })
    this.sub.add(getShowAsideForAdd);
  }
  onClosed() {
    this.opened = false;
    this.cd.detectChanges();
  }
  close() {
    this.opened = false;
    this.body.close();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
