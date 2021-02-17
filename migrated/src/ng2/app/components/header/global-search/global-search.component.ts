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
import { InvoiceStateService } from 'src/ng2/app/states/invoice/invoice-state.service';
import { TicketsListService } from '../../tickets/tickets/services/tickets-list.service';

@Component({
  selector: 'app-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss'],
  providers: [TicketsListService]
})
export class GlobalSearchComponent implements OnInit {
  @ViewChild('globalSearch') globalSearch: NgbDropdown;
  selectedType: string = 'TICKETS';
  list: Array<GlobalSearchResult> = [];
  indexNoAvatar: number = 0;
  listColorNoAvatar = ['#0cdeaa', '#16a4fa', '#7c77cb', '#ffb937'];
  word: string = "";
  constructor(private globalSearchService: GlobalSearchService,
    private ticketsService: TicketsService,
    private invoiceStateService: InvoiceStateService,
    private defaultServicesStateService: DefaultServicesStateService,
    private defaultServicesService: DefaultServicesService,
    private usersStateService: UsersStateService,
    private productService: ProductService,
    private inventoryStateService: InventoryStateService,
    public ticketsListService: TicketsListService,
    private ticketsStateService: TicketsStateService) { }

  ngOnInit() {
    this.indexNoAvatar = this.ticketsListService.randomInteger(0, 3);
  }
  onSearch() {
    if (this.word.length == 0) {
      this.list = [];
      return;
    }
    this.globalSearchService.search(this.word).subscribe(data => {
      this.list = data;
      this.selectedType = (this.list.length > 0) ? this.list[0].type : 'TICKETS';
      this.onShowDropDown();
    })
  }
  onShowDropDown() {
    if (this.word.length > 0) this.globalSearch.open();
  }
  togglePanel(data, event) {
    // event.target.closest('.card').classList.toggle('opened-card');
    if (!data) {
    }
  }
  showInfo(item: GlobalSearchResultItem) {
    if (item.type === 'COMPANIES') {
      localStorage.setItem("company_id", item.id);
      let body = document.querySelector('.main-container');
      var link = document.createElement('a');
      body.appendChild(link);
      link.href = `#/ng2/company/dashboard/${item.id}`
      var e = document.createEvent('MouseEvents');
      e.initEvent('click', true, true);
      link.dispatchEvent(e);
    }
    if (item.type === 'TICKETS') {
      this.ticketsStateService.onOpenTicket();
      this.ticketsService.getTicket(item.id).subscribe(data => {
        this.ticketsStateService.onEditTicket(data);
      })
    }
    if (item.type === 'USERS') {
      let user = this.getUserById(item.id);
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
    if (item.type === 'INVOICES') {
      this.invoiceStateService.togglePreview(item.id);
    }
  }
  getUserById(id) {
    return this.usersStateService.getAllUsers().find(userItem => userItem.id === id);
  }
  getNameForAvatar(item) {
    let user = this.getUserById(item.id);
    if (!user.avatar) return `${(user.firstName) ? user.firstName[0].toUpperCase() : ''}${(user.lastName) ? user.lastName[0].toUpperCase() : ''}`;
    return '';
  }
  clearWord() {
    this.word = "";
    this.list = [];
  }
  isShowType(type) {
    if (type === 'TICKETS' || type === 'COMPANIES' || type === 'USERS' || type === 'SERVICES' || type === 'PRODUCTS' || type === 'INVOICES') return true;
    return false;
  }
  getFistLine(item) {
    if (item.type !== 'INVOICES') return `${item.name}`;
    if (item.type === 'INVOICES') return `${item.info}`;
  }
  getSecondLine(item) {
    if (item.type !== 'INVOICES' && item.type !== 'COMPANIES') return `${item.info}`;
    if (item.type === 'INVOICES') return `<span class="invoice-number">${item.name}</span><span class="invoice-circle"></span> <span>${item.extraInfo}</span>`;
    return '';
  }
  getTypeList(type) {
    let find = this.list.find(item => item.type === type);
    return (find) ? find.list : [];
  }
  getText(type) {
    if (type === 'TICKETS') return 'Tickets';
    if (type === 'COMPANIES') return 'Companies';
    if (type === 'USERS') return 'Users';
    if (type === 'SERVICES') return 'Services';
    if (type === 'PRODUCTS') return 'Products';
    if (type === 'INVOICES') return 'Invoices';
  }
}
