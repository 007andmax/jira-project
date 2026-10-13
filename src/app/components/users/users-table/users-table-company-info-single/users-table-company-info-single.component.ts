import { Component, Input } from '@angular/core';
import { UsersTableCompanyInfoItemComponent } from '../users-table-company-info-item/users-table-company-info-item.component';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';
import { UsersTableCompanyByComponent } from '../users-table-company-by/users-table-company-by.component';
import { CompanyLogoPopoverDirective } from 'src/app/directives/company-logo-popover/company-logo-popover.directive';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-users-table-company-info-single',
  templateUrl: './users-table-company-info-single.component.html',
  styleUrls: ['./users-table-company-info-single.component.scss'],
  providers: [TicketsListService],
  imports: [UsersTableCompanyByComponent, CommonModule, NgbModule, CompanyLogoPopoverDirective]
})
export class UsersTableCompanyInfoSingleComponent extends UsersTableCompanyInfoItemComponent {
  @Input() i: number = 0;
  @Input() getStyleNetAvatar: Function;
  @Input() companyContent: any;
  @Input() disableTooltip: boolean;
}
