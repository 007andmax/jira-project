import { Component, OnInit } from '@angular/core';
import { CompanyTagsListService } from 'src/app/components/companies/company-tags/services/company-tags-list.service';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';
import { TicketsFilterDropDownComponent } from 'src/app/components/tickets/tickets/tickets-header/tickets-filter/tickets-filter-drop-down/tickets-filter-drop-down.component';

@Component({
    selector: 'app-company-devices-filter-type',
    templateUrl: './company-devices-filter-type.component.html',
    styleUrls: ['./company-devices-filter-type.component.scss'],
    providers: [CompanyTagsListService, TicketsListService],
    standalone: true
})
export class CompanyDevicesFilterTypeComponent extends TicketsFilterDropDownComponent {



}
