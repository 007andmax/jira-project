import { Component, Input, OnInit } from '@angular/core';
import { CompanyTagsComponent } from 'src/app/components/companies/company-tags/company-tags.component';
import { CompanyTagsListService } from 'src/app/components/companies/company-tags/services/company-tags-list.service';

@Component({
  selector: 'app-tickets-filter-tags',
  templateUrl: './tickets-filter-tags.component.html',
  styleUrls: ['./tickets-filter-tags.component.scss'],
  providers: [CompanyTagsListService]
})
export class TicketsFilterTagsComponent extends CompanyTagsComponent {
  @Input() placement: string = 'bottom-left';
  public ngOnInit() {
    if (this.tagsStateService.getTags().length == 0) {
      let getTags = this.tagsService.getTags().subscribe((data) => {
        this.tagsStateService.setTags(data);
        this.tags = data;
        this.reqTags = JSON.parse(JSON.stringify(data));
        this.sortTags();
      })
      this.sub.add(getTags);
    } else {
      this.tags = JSON.parse(JSON.stringify(this.tagsStateService.getTags()));
      this.reqTags = JSON.parse(JSON.stringify(this.tagsStateService.getTags()));
      this.sortTags();
    }
    let changeTagsArray = this.tagsRealTimeService.changeTagsArray.subscribe((data: any) => {
      if (data.action === "TAG_SAVED") {
        let index = this.tags.findIndex(item => item.id === data.data.id);
        let indexreqTags = this.reqTags.findIndex(item => item.id === data.data.id);
        if (index > -1) {
          this.tags[index] = data.data;
        } else {
          this.tags.push(data.data);
        }
        if (indexreqTags > -1) {
          this.reqTags[index] = data.data;
        } else {
          this.reqTags.push(data.data);
        }
      }
      if (data.action === "TAG_REMOVED") {
        let index = this.tags.findIndex(item => item.id === data.data);
        let indexreqTags = this.reqTags.findIndex(item => item.id === data.data);
        if (index > -1) this.tags.splice(index, 1);
        if (indexreqTags > -1) this.reqTags.splice(index, 1);
      }
      this.sortTags();
      this.cd.detectChanges();
    })
    this.sub.add(changeTagsArray);
    this.onInitClearState();
    this.onCheckEditItem();
  }
  /**
* @description Sort tags and reqTags list by "word" field
*/
  sortTags() {
    this.tags = this.tags.sort((a, b) => (a.word.toLowerCase() > b.word.toLowerCase()) ?
      1 : ((b.word.toLowerCase() > a.word.toLowerCase()) ? -1 : 0));
    this.reqTags = this.reqTags.sort((a, b) => (a.word.toLowerCase() > b.word.toLowerCase()) ?
      1 : ((b.word.toLowerCase() > a.word.toLowerCase()) ? -1 : 0));
  }
  /**
* @description Filter list by field value
* @param {Object} event - Object from input
*/
  onSearch(event) {
    this.tags = this.reqTags.filter(item => item.word.toLowerCase().includes(event.target.value));
  }
  /**
* @description Check if element dropdown added in selectedTag
* @param {String} id - selected id element
*/
  isSelected(id) {
    return this.selectedTag.find(item => item.id == id);
  }
}
