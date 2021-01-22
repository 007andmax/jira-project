import { Component, OnInit } from '@angular/core';
import { Company } from '../../interfaces/company/company';
import { CompaniesStateService } from '../../states/company/companies-state.service';
import { DefaultServicesStateService } from '../../states/default-services/default-services-state.service';
import { InventoryStateService } from '../../states/inventory/inventory-state.service';
import { QuoteStateService } from '../../states/quote/quote-state.service';
import { TicketsStateService } from '../../states/tickets/tickets-state.service';
import { UsersStateService } from '../../states/users/users-state.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentCompany: Company;
  constructor(private usersStateService: UsersStateService,
    private ticketsStateService: TicketsStateService,
    // private quoteStateService: QuoteStateService,
    private inventoryStateService: InventoryStateService,
    private defaultServicesStateService: DefaultServicesStateService,
    private companiesStateService: CompaniesStateService) { }

  ngOnInit() {
    this.currentCompany = this.companiesStateService.getCurrentCompany();
    this.companiesStateService.getOnCurrentCompany().subscribe(data => {
      this.currentCompany = this.companiesStateService.getCurrentCompany();
    })
  }
  goToLink(url) {

    let body = document.querySelector('.left-panel__category-wrap');
    var link = document.createElement('a');
    body.appendChild(link);
    link.href = url;
    var e = document.createEvent('MouseEvents');
    e.initEvent('click', true, true);
    link.dispatchEvent(e);
  }
  onAddTicket() {
    this.ticketsStateService.onToggleAddTicket();
  }
  onAddUser() {
    this.usersStateService.onOpenAsige();
  }
  onAddCompany() {
    this.companiesStateService.toggleAsideForAdd();
  }
  onAddService() {
    this.defaultServicesStateService.toggleAsideForAdd();
  }
  onAddProduct() {
    this.inventoryStateService.toggleAsideForAdd();
  }
  public goToState(state) {

    //this.quoteStateService.goToState(state);
  }
  public logOut() {
    window.location.href = '/logout';
    window.location.hash = '';
  }
  public getCurrentUserName() {
    let user = this.usersStateService.getCurrentUser();
    return (user) ? `${user.firstName} ${user.lastName}` : '';
  }
}
