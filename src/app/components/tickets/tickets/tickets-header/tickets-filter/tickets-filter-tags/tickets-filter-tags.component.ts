import { Component, OnInit } from '@angular/core';
import { CompanyTagsComponent } from 'src/app/components/companies/company-tags/company-tags.component';

@Component({
  selector: 'app-tickets-filter-tags',
  templateUrl: './tickets-filter-tags.component.html',
  styleUrls: ['./tickets-filter-tags.component.scss']
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
    this.onInitClearState();
    this.onCheckEditItem();
  }
}
