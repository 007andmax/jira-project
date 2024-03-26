import { Component, Input, OnInit } from '@angular/core';
import { CompanyTagsComponent } from 'src/app/components/companies/company-tags/company-tags.component';
import { CompanyTagsListService } from 'src/app/components/companies/company-tags/services/company-tags-list.service';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';
import { TicketsFilterDropDownComponent } from 'src/app/components/tickets/tickets/tickets-header/tickets-filter/tickets-filter-drop-down/tickets-filter-drop-down.component';

@Component({
  selector: 'app-company-devices-custom-drop-down',
  templateUrl: './company-devices-custom-drop-down.component.html',
  styleUrls: ['./company-devices-custom-drop-down.component.scss'],
  providers: [CompanyTagsListService, TicketsListService]
})
export class CompanyDevicesCustomDropDownComponent extends CompanyTagsComponent {
  @Input() placement: string = 'bottom-left';
  public ngOnInit() {
    if (this.deviceTagsStateService.getTags().length > 0) {
      this.tags = JSON.parse(JSON.stringify(this.deviceTagsStateService.getTags()));
      this.reqTags = JSON.parse(JSON.stringify(this.deviceTagsStateService.getTags()));
    }
    let onGetTags = this.deviceTagsStateService.onGetTags.subscribe(data => {
      this.tags = data;
      this.tags = JSON.parse(JSON.stringify(data));
      this.reqTags = JSON.parse(JSON.stringify(data));
      this.sortTags();
    })
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
    this.tags = this.reqTags.filter(item => item.word.toLowerCase().includes(event.target.value.toLowerCase()));
  }
  /**
* @description Check if element dropdown added in selectedTag
* @param {String} id - selected id element
*/
  isSelected(id) {
    return this.selectedTag.find(item => item.id == id);
  }
}
