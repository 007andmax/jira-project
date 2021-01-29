import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { DefaultServicesService } from 'src/ng2/app/services/default-services/default-services.service';
import { GlobalSearchService } from 'src/ng2/app/services/global-search/global-search.service';
import { ProductService } from 'src/ng2/app/services/product/product.service';
import { TicketsService } from 'src/ng2/app/services/tickets/tickets.service';
import { DefaultServicesStateService } from 'src/ng2/app/states/default-services/default-services-state.service';
import { InventoryStateService } from 'src/ng2/app/states/inventory/inventory-state.service';
import { TicketsStateService } from 'src/ng2/app/states/tickets/tickets-state.service';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { GlobalSearchResult } from './class/global-search-result';
import { GlobalSearchResultItem } from './class/global-search-result-item';

@Component({
  selector: 'app-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss']
})
export class GlobalSearchComponent implements OnInit {
  @ViewChild('globalSearch') globalSearch: NgbDropdown;
  list: Array<GlobalSearchResult> = [];
  word: string = "";
  constructor(private globalSearchService: GlobalSearchService,
    private ticketsService: TicketsService,
    private defaultServicesStateService: DefaultServicesStateService,
    private defaultServicesService: DefaultServicesService,
    private usersStateService: UsersStateService,
    private productService: ProductService,
    private inventoryStateService: InventoryStateService,
    private ticketsStateService: TicketsStateService) { }

  ngOnInit() {
  }
  onSearch() {
    this.globalSearchService.search(this.word).subscribe(data => {
      this.list = data;
      this.onShowDropDown();
      console.log(this.list);
    })
  }
  onShowDropDown() {
    if (this.word.length > 0) this.globalSearch.open();
  }
  onCloseProducts(open) {

  }
  togglePanel(data, event) {
    event.target.closest('.card').classList.toggle('opened-card');
    if (!data) {
    }
  }
  showInfo(item: GlobalSearchResultItem) {
    if (item.type === 'COMPANIES') {
      localStorage.setItem("company_id", item.id);
      let body = document.querySelector('.left-panel__category-wrap');
      var link = document.createElement('a');
      body.appendChild(link);
      link.href = `#/ng2/company/dashboard/${item.id}`
      var e = document.createEvent('MouseEvents');
      e.initEvent('click', true, true);
      link.dispatchEvent(e);
    }
    if (item.type === 'TICKETS') {
      console.log(item);
      this.ticketsStateService.onOpenTicket();
      this.ticketsService.getTicket(item.id).subscribe(data => {
        //  data.setUserCompanies(ticket.userCompanies);
        this.ticketsStateService.onEditTicket(data);
      })
    }
    if (item.type === 'USERS') {
      let user = this.usersStateService.getAllUsers().find(userItem => userItem.id === item.id);
      this.usersStateService.setUserForEdit(user);
      this.usersStateService.onOpenEditAsige();
    }
    if (item.type === 'SERVICES') {
      this.defaultServicesService.getDefaultService(item.id).subscribe(res => {
        this.defaultServicesStateService.toggleAsideForEdit(res);
      })
    }
    if (item.type === 'PRODUCTS') {
      this.productService.getProduct(item.id).subscribe(res => {
        this.inventoryStateService.setEditInventory(res);
      })
    }
  }
  clearWord() {
    this.word = "";
    this.list = [];
  }
  isShowType(type) {
    if (type === 'TICKETS' || type === 'COMPANIES' || type === 'USERS' || type === 'SERVICES' || type === 'PRODUCTS') return true;
    return false;
  }
  getText(type) {
    if (type === 'TICKETS') return 'Tickets';
    if (type === 'COMPANIES') return 'Companies';
    if (type === 'USERS') return 'Users';
    if (type === 'SERVICES') return 'Services';
    if (type === 'PRODUCTS') return 'Products';
  }

}
