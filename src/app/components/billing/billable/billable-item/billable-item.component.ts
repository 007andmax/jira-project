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
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { AppStateService } from 'src/app/states/app/app-state.service';

@Component({
  selector: 'app-billable-item',
  templateUrl: './billable-item.component.html',
  styleUrls: ['./billable-item.component.scss'],
  providers: [TicketsListService]
})
export class BillableItemComponent implements OnInit {
  @Input() item: BillableProfile;
  @Output() onSelect = new EventEmitter<any>();
  company: Company;
  salesPerson: User;
  totalSum: number = 0;
  indexNoAvatar: number = 0;
  listColorNoAvatar = [];
  private closeTimer: any;
  private openTimer: any;
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
    let company = this.companiesStateService.getCompanies().find(item => item.id === this.item.id);
    this.salesPerson = this.usersStateService.getAllUsers().find(item => item.id === company.techLeadId);
  }
  ngDocheck() {

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
  openPopover(popover: NgbPopover): void {
    if (!this.salesPerson) return;
    clearTimeout(this.closeTimer);

    if (!popover.isOpen()) {
      this.openTimer = setTimeout(() => {
        popover.open();
        this.appStateService.changeDetectorRef();
        // Wait until popover is added to <body>
        setTimeout(() => {
          const popoverEl: any = document.querySelector('.requested-by-popover');

          if (!popoverEl) {
            return;
          }
          popoverEl.style.opacity = "1";
          popoverEl.addEventListener('mouseenter', this.onPopoverMouseEnter);
          popoverEl.addEventListener('mouseleave', () => {
            if (!this.usersStateService.isOpenDropDownRequestedBy) popover.close();
          });
        });
      }, 500);
    }
  }

  startCloseTimer(popover: NgbPopover): void {
    if (!this.salesPerson || this.usersStateService.isOpenDropDownRequestedBy) return;
    clearTimeout(this.closeTimer);
    clearTimeout(this.openTimer);
    this.closeTimer = setTimeout(() => {
      const popoverEl = document.querySelector('.requested-by-popover:hover');

      // close only if mouse is not over popover body
      if (!popoverEl) {
        popover.close();
      }
    }, 150);
  }
  onPopoverMouseEnter = (): void => {
    clearTimeout(this.closeTimer);
  };
  ngOnDestroy(): void {
    clearTimeout(this.closeTimer);
  }
}
