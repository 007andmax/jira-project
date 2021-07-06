import { Component, OnInit } from '@angular/core';
import { CompanyTagsComponent } from 'src/app/components/companies/company-tags/company-tags.component';
import { CompanyTagsListService } from 'src/app/components/companies/company-tags/services/company-tags-list.service';

@Component({
  selector: 'app-tickets-filter-tags',
  templateUrl: './tickets-filter-tags.component.html',
  styleUrls: ['./tickets-filter-tags.component.scss'],
  providers: [CompanyTagsListService]
})
export class TicketsFilterTagsComponent extends CompanyTagsComponent {

  public ngOnInit() {
    let getTags = this.tagsService.getTags().subscribe((data) => {
      this.tags = data.sort((a, b) => (a.word.toLowerCase() > b.word.toLowerCase()) ?
        1 : ((b.word.toLowerCase() > a.word.toLowerCase()) ? -1 : 0));
      this.reqTags = data.sort((a, b) => (a.word.toLowerCase() > b.word.toLowerCase()) ?
        1 : ((b.word.toLowerCase() > a.word.toLowerCase()) ? -1 : 0));
    })
    this.sub.add(getTags);
    let changeTagsArray = this.tagsRealTimeService.changeTagsArray.subscribe((data: any) => {
      if (data.action === "TAG_SAVED" && data.data instanceof Array) {
        this.tags = [...this.tags, ...data.data];
        this.reqTags = [...this.reqTags, ...data.data];
      }
      if (data.action === "TAG_SAVED" && data.data instanceof Object) {
        let index = this.tags.findIndex(item => item.id === data.data.id);
        let indexreqTags = this.reqTags.findIndex(item => item.id === data.data.id);
        if (index > -1) this.tags[index] = data.data;
        if (indexreqTags > -1) this.reqTags[index] = data.data;
      }
      if (data.action === "TAG_REMOVED") {
        let index = this.tags.findIndex(item => item.id === data.data);
        let indexreqTags = this.reqTags.findIndex(item => item.id === data.data);
        if (index > -1) this.tags.splice(index, 1);
        if (indexreqTags > -1) this.reqTags.splice(index, 1);
      }
    })
    this.sub.add(changeTagsArray);
    this.onInitClearState();
    this.onCheckEditItem();
  }
}
