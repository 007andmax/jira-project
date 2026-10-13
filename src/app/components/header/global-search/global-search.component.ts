import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbDropdown, NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NonContractServicesService } from 'src/app/services/non-contract-services/non-contract-services.service';
import { GlobalSearchService } from 'src/app/services/global-search/global-search.service';
import { ProductService } from 'src/app/services/product/product.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { NonContractServicesStateService } from 'src/app/states/non-contract-services/non-contract-services-state.service';
import { InventoryStateService } from 'src/app/states/inventory/inventory-state.service';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { GlobalSearchResult } from './class/global-search-result';
import { GlobalSearchResultItem } from './class/global-search-result-item';
import { InvoiceStateService } from 'src/app/states/invoice/invoice-state.service';
import { TicketsListService } from '../../tickets/tickets/services/tickets-list.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { Router } from '@angular/router';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { AppService } from 'src/app/states/app/app.service';
import { TicketStateService } from '../../tickets/tickets/ticket-edit-aside/services/ticket-state.service';
import { NgIf, NgFor, NgClass, NgStyle, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss'],
  providers: [TicketsListService],
  standalone: true,
  imports: [NgbModule, FormsModule, CommonModule]
})
export class GlobalSearchComponent implements OnInit {
  @ViewChild('globalSearch', { static: true }) globalSearch: NgbDropdown;
  selectedType: string = 'TICKETS';
  list: Array<GlobalSearchResult> = [];
  indexNoAvatar: number = 0;
  listColorNoAvatar = [];
  word: string = "";
  constructor(private globalSearchService: GlobalSearchService,
    private ticketsService: TicketsService,
    private invoiceStateService: InvoiceStateService,
    private nonContractServicesStateService: NonContractServicesStateService,
    private nonContractServicesService: NonContractServicesService,
    public usersStateService: UsersStateService,
    private productService: ProductService,
    private router: Router,
    public companiesStateService: CompaniesStateService,
    public leftPanelStateService: LeftPanelStateService,
    private inventoryStateService: InventoryStateService,
    public ticketsListService: TicketsListService,
    private permissionsService: PermissionsService,
    private ticketStateService: TicketStateService,
  ) { }

  ngOnInit() {
    this.listColorNoAvatar = this.ticketsListService.getListColorNoAvatar();
    this.indexNoAvatar = this.ticketsListService.randomInteger(0, 6);
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

      this.companiesStateService.setCompanyRoutingId(item.id);
      // this.leftPanelStateService.goToState('company-dashboard');
      this.router.navigate(
        [`${this.companiesStateService.getCurrentCompany().techDomain}/company/`, item.id, 'dashboard']);

      this.leftPanelStateService.openCompanPage();

    }
    if (item.type === 'TICKETS') {
      this.ticketStateService.setTicketRoutingId(item.id);
      const url = `/#/${this.companiesStateService.getCurrentCompany().techDomain}/ticket/${item.id}`;
      window.open(url, '_blank');
    }
    if (item.type === 'USERS') {
      let user = this.getUserById(item.id);
      this.usersStateService.setUserForEdit(user);
      this.usersStateService.onOpenEditAsige();
    }
    if (item.type === 'SERVICES') {
      this.nonContractServicesService.getNonContractService(item.id).subscribe(res => {
        this.nonContractServicesStateService.toggleAsideForEdit(res);
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
  clearWord() {
    this.word = "";
    this.list = [];
  }
  isShowType(type) {
    if (type === 'TICKETS' || type === 'COMPANIES' && this.getPermissions('VIEW_COMPANIES') || type === 'USERS' && this.getPermissions('VIEW_USERS') && this.getPermissions('EDIT_USERS') || type === 'SERVICES' || type === 'PRODUCTS' || type === 'INVOICES') return true;
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
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  public trackByIndex(index, item) {
    return index;
  }
}
