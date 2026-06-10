
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { CompanyTagsListService } from 'src/app/components/companies/company-tags/services/company-tags-list.service';
import { DynamicTooltipComponent } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.component';
import { MatChipListComponent } from 'src/app/components/shared/mat-chip-list/mat-chip-list.component';
import { MatChipComponent } from 'src/app/components/shared/mat-chip/mat-chip.component';
import { MatFormFieldComponent } from 'src/app/components/shared/mat-form-field/mat-form-field.component';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';
import { TicketsFilterDropDownComponent } from 'src/app/components/tickets/tickets/tickets-header/tickets-filter/tickets-filter-drop-down/tickets-filter-drop-down.component';

@Component({
  standalone: true,
  imports: [DynamicTooltipComponent, NgbDropdownModule, MatChipComponent, MatChipListComponent, MatFormFieldComponent, CommonModule],
  selector: 'app-company-devices-filter-type',
  templateUrl: './company-devices-filter-type.component.html',
  styleUrls: ['./company-devices-filter-type.component.scss'],
  providers: [CompanyTagsListService, TicketsListService],

})
export class CompanyDevicesFilterTypeComponent extends TicketsFilterDropDownComponent {



}
