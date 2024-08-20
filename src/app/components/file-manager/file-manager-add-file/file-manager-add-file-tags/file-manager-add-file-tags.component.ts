import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CompanyTag } from 'src/app/components/companies/company-tags/class/company-tag';
import { CompanyTagsComponent } from 'src/app/components/companies/company-tags/company-tags.component';
import { CompanyTagsListService } from 'src/app/components/companies/company-tags/services/company-tags-list.service';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';

@Component({
  selector: 'app-file-manager-add-file-tags',
  templateUrl: './file-manager-add-file-tags.component.html',
  styleUrls: ['./file-manager-add-file-tags.component.scss'],
  providers: [CompanyTagsListService, TicketsListService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileManagerAddFileTagsComponent extends CompanyTagsComponent {

  getTags(searchName = null) {
    if (this.companyTagsListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    this.tagsService.searchFilesTags(this.page, this.searchName).subscribe((data: any) => {
      if (searchName && this.tags.length > 0) {
        this.tags = [];
        this.reqTags = [];
        this.page = 0;
      }
      this.tags = [...this.tags, ...data.commonTagViews.map(item => new CompanyTag(item))];
      this.reqTags = [...this.reqTags, ...JSON.parse(JSON.stringify(data.commonTagViews))];
      this.page++;
      this.infiniteScrollDisabled = false;
      if (this.reqTags.length === data.totalElements) {
        this.companyTagsListService.setBlockList(true);
      } else {
        this.companyTagsListService.setBlockList(false);
      }
      this.showPreloader = false;
      this.cd.markForCheck();
    })
  }

}
