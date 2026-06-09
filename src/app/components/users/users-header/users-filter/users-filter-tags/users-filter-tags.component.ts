
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CompanyTagsComponent } from 'src/app/components/companies/company-tags/company-tags.component';
import { CompanyTagsListService } from 'src/app/components/companies/company-tags/services/company-tags-list.service';
import { DynamicTooltipComponent } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.component';
import { MatChipListComponent } from 'src/app/components/shared/mat-chip-list/mat-chip-list.component';
import { MatChipComponent } from 'src/app/components/shared/mat-chip/mat-chip.component';
import { MatFormFieldComponent } from 'src/app/components/shared/mat-form-field/mat-form-field.component';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';

@Component({
  standalone: true,
  imports: [DynamicTooltipComponent, NgbDropdownModule, InfiniteScrollModule, MatChipComponent, MatChipListComponent, MatFormFieldComponent, CommonModule],
  selector: 'app-users-filter-tags',
  templateUrl: './users-filter-tags.component.html',
  styleUrls: ['./users-filter-tags.component.scss'],
  providers: [CompanyTagsListService, TicketsListService],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class UsersFilterTagsComponent extends CompanyTagsComponent {
  @Input() placement: string = 'bottom-left';


  public setSelectedTag(data) {
    this.selectedTag = data;
    this.cd.markForCheck();
  }
}
