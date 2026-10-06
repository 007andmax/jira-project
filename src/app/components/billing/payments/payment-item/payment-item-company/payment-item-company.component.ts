import { Component, Input } from '@angular/core';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';
import { UsersTableCompanyByComponent } from 'src/app/components/users/users-table/users-table-company-by/users-table-company-by.component';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';

@Component({
  selector: 'app-payment-item-company',
  standalone: true,
  imports: [],
  templateUrl: './payment-item-company.component.html',
  styleUrls: ['./payment-item-company.component.scss'],
  providers: [TicketsListService, UsersTableCompanyByComponent]
})
export class PaymentItemCompanyComponent {
  @Input() company: any;
  @Input() i: number;
  indexNoAvatar: number = 0;
  listColorNoAvatar = [];
  constructor(public ticketsListService: TicketsListService,
    public companiesStateService: CompaniesStateService,
  ) { }

  ngOnInit() {
    this.listColorNoAvatar = this.ticketsListService.getListColorNoAvatar();
    this.indexNoAvatar = this.ticketsListService.randomInteger(0, 6);
  }
  checkLogo() {
    return (this.company && this.company.logo && this.company.logo.cropped && this.company.logo.cropped.id || this.company && this.company.logo && this.company.logo.origin && this.company.logo.origin.id)
  }
  parseLogo() {
    if (this.checkLogo()) {
      return `url(${this.companiesStateService.getCompanyLogoUrl(this.company)}) center / cover no-repeat`;
    } else {
      return this.ticketsListService.getStyleAvatar(null, this.listColorNoAvatar[this.indexNoAvatar]);
    }
  }
  getStyleNetAvatar(i) {
    return `${12 * i}px`;
  }
  public getCompany() {
    return this.companiesStateService.getCompanies().find(company => company.id === this.company.id);
  }
}
