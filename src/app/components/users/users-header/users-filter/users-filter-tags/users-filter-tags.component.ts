import { DynamicTooltipComponent } from './';
import { MatChipComponent } from './';
import { MatChipListComponent } from './';
import { MatFormFieldComponent } from './';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CompanyTagsComponent } from 'src/app/components/companies/company-tags/company-tags.component';
import { CompanyTagsListService } from 'src/app/components/companies/company-tags/services/company-tags-list.service';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';

@Component({
  standalone: true,
  imports: [DynamicTooltipComponent, MatChipComponent, MatChipListComponent, MatFormFieldComponent, CommonModule],
    selector: 'app-users-filter-tags',
    templateUrl: './users-filter-tags.component.html',
    styleUrls: ['./users-filter-tags.component.scss'],
    providers: [CompanyTagsListService, TicketsListService],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class UsersFilterTagsComponent extends CompanyTagsComponent {
  @Input() placement: string = 'bottom-left';


  public setSelectedTag(data) {
    this.selectedTag = data;
    this.cd.markForCheck();
  }
}
