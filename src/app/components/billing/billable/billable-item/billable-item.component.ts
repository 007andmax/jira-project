import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BillableProfile } from '../class/billable-profile';
import { Company } from 'src/app/interfaces/company/company';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { User } from '../../../users/class/user';
import { TicketsListService } from '../../../tickets/tickets/services/tickets-list.service';
import { BillableStateService } from 'src/app/states/billable/billable-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { BillableService } from 'src/app/services/billable/billable.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgIf, NgStyle, CurrencyPipe, CommonModule } from '@angular/common';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { AppStateService } from 'src/app/states/app/app-state.service';
import { TicketsTableItemRequestedByComponent } from 'src/app/components/tickets/tickets/tickets-table/tickets-table-item/tickets-table-item-requested-by/tickets-table-item-requested-by.component';
import { UsersTableCompanyByComponent } from 'src/app/components/users/users-table/users-table-company-by/users-table-company-by.component';
import { CompanyLogoPopoverDirective } from 'src/app/directives/company-logo-popover/company-logo-popover.directive';
import { UserLogoPopoverDirective } from 'src/app/directives/user-logo-popover/user-logo-popover.directive';

@Component({
  selector: 'app-billable-item',
  templateUrl: './billable-item.component.html',
  styleUrls: ['./billable-item.component.scss'],
  providers: [TicketsListService],
  standalone: true,
  imports: [FormsModule, UserLogoPopoverDirective, CommonModule, CompanyLogoPopoverDirective, NgbModule, CurrencyPipe, UsersTableCompanyByComponent, TicketsTableItemRequestedByComponent]
})
export class BillableItemComponent implements OnInit {
  @Input() item: BillableProfile;
  @Output() onSelect = new EventEmitter<any>();
  company: Company;
  salesPerson: User;
  totalSum: number = 0;
  indexNoAvatar: number = 0;
  listColorNoAvatar = [];
  constructor(private companiesStateService: CompaniesStateService,
    public ticketsListService: TicketsListService,
    private billableStateService: BillableStateService,
    private leftPanelStateService: LeftPanelStateService,
    private billableService: BillableService,
    private permissionsService: PermissionsService,
    private appStateService: AppStateService,
    private usersStateService: UsersStateService) { }

  ngOnInit() {
    this.listColorNoAvatar = this.ticketsListService.getListColorNoAvatar();
    this.indexNoAvatar = this.ticketsListService.randomInteger(0, 6);
    this.company = this.companiesStateService.getCompanies().find(item => item.id === this.item.id);
    this.salesPerson = this.usersStateService.getAllUsers().find(item => item.id === this.company.techLeadId);
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
  parseTotal(value) {
    return parseFloat(value.toString()).toFixed(2)
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  getStyleAvatar(user) {
    if (!user) return '';
    if (!user.avatar) {
      return this.listColorNoAvatar[this.indexNoAvatar];
    }
    if (user.id) {
      return `url(${'/users/' + (user.id || 'default') + '/image' + (user.avatar ? '.jpg?t=' + user.avatar.updatedAt :
        '')}) 0% 0% / cover no-repeat`
    } else if (user.avatar && user.avatar.origin && user.avatar.origin.id) {
      return `url(/file/${(user.avatar.origin.id)}.jpg) 0% 0% / cover no-repeat`;
    } else {
      return this.listColorNoAvatar[this.indexNoAvatar];
    }
  };
  onChangeSelected(event) {
    this.onSelect.emit(event.target.checked);
  }
  onInvoiceAll() {
    this.billableService.createInvoiceByCompanyId([this.item.id]).subscribe(data => {
    });
  }
  moToBillableTickets() {
    this.billableStateService.setBillableProfile(this.item);
    this.leftPanelStateService.goToState('new-billable-tickets');
  }

  ngOnDestroy(): void {

  }
}
