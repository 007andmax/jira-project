import { Component, Input, OnInit } from '@angular/core';
import { CompanyTagsComponent } from 'src/app/components/companies/company-tags/company-tags.component';
import { CompanyTagsListService } from 'src/app/components/companies/company-tags/services/company-tags-list.service';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';

@Component({
  selector: 'app-company-devices-custom-drop-down',
  templateUrl: './company-devices-custom-drop-down.component.html',
  styleUrls: ['./company-devices-custom-drop-down.component.scss'],
  providers: [CompanyTagsListService, TicketsListService]
})
export class CompanyDevicesCustomDropDownComponent extends CompanyTagsComponent {
  @Input() placement: string = 'bottom-left';
  tags: Array<any> = [];
  reqTags: Array<any> = [];
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
    this.sub.add(onGetTags);
  }
  public clearWithOutChanges() {
    this.userInput.nativeElement.value = '';
    this.searchName = "";
    this.selectedTag = [];
    this.tags = this.reqTags;
    this.userInput.nativeElement.blur();
    if (this.formField) this.formField.checkSelectedItems(this.selectedTag);
    this.dp.close();
    this.cd.detectChanges();
  }
  /**
* @description Sort tags and reqTags list by "name" field
*/
  sortTags() {
    this.tags = this.tags.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
    this.reqTags = this.reqTags.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
  }
  /**
* @description Filter list by field value
* @param {Object} event - Object from input
*/
  onSearch(event) {
    this.tags = this.reqTags.filter(item => item.name.toLowerCase().includes(event.target.value.toLowerCase()));
  }
  /**
* @description Check if element dropdown added in selectedTag
* @param {String} id - selected id element
*/
  isSelected(id) {
    return this.selectedTag.find(item => item.id == id);
  }

  onKeyUp(event) {
    if (event.keyCode === 40) {
      let indexSelected = this.tags.findIndex(item => item.isHover);
      if (indexSelected > -1) this.tags[indexSelected].isHover = false;
      indexSelected++;
      if (indexSelected === this.tags.length) indexSelected = 0;
      this.tags[indexSelected].isHover = true;
      let isScrolledIntoView = this.isScrolledIntoView(this.elRef.nativeElement.querySelector(`#tag-${this.tags[indexSelected].id}`));
      if (!isScrolledIntoView) this.elRef.nativeElement.querySelector('.content').scrollTop = ((indexSelected < 8) ? 0 : indexSelected * 32);
      this.cd.markForCheck();
      return;
    }
    if (event.keyCode === 38) {
      let indexSelected = this.tags.findIndex(item => item.isHover);
      if (indexSelected > -1) this.tags[indexSelected].isHover = false;
      if (indexSelected === 0 || indexSelected === -1) {
        indexSelected = this.tags.length - 1;
      } else {
        indexSelected--;
      }
      this.tags[indexSelected].isHover = true;
      let isScrolledIntoView = this.isScrolledIntoView(this.elRef.nativeElement.querySelector(`#tag-${this.tags[indexSelected].id}`));
      if (!isScrolledIntoView) this.elRef.nativeElement.querySelector('.content').scrollTop = ((indexSelected < 8) ? 0 : indexSelected * 32);
      this.cd.markForCheck();
      return;
    }
    if (event.keyCode === 13) {
      let indexSelected = this.tags.findIndex(item => item.isHover);
      if (indexSelected > -1) {
        let findTag = this.selectedTag.find(item => item.id === this.tags[indexSelected].id);
        if (!findTag) {
          this.searchName = "";
          this.selectedTag.push(this.tags[indexSelected]);
          this.tagsChange.emit(this.selectedTag);
          this.tags = this.reqTags;
          this.cd.detectChanges();
        }
        return;
      }

      const input = event.target.input;
      const value = event.target.value;
      if ((value || '').trim()) {
        let search = this.tags.find(item => item.name == value);
        if (search) {
          this.selectedTag.push(search);
          this.tagsChange.emit(this.selectedTag);
          if (input) {
            input.value = '';
          }
          this.userInput.nativeElement.value = '';
          this.searchName = "";
          this.tags = this.reqTags;
          this.cd.detectChanges();
          return;
        }
        let tag: any = {
          "tags": [
            value.trim()
          ]
        }
        let setTags = this.deviceTagsService.addTags(tag).subscribe((res: any) => {
          this.reqTags.push(res.tags[0]);
          this.tags = this.reqTags;
          this.selectedTag.push(res.tags[0]);
          this.tagsChange.emit(this.selectedTag);
          if (input) {
            input.value = '';
          }
          this.userInput.nativeElement.value = '';
          this.searchName = "";
          this.tags = this.reqTags;
          this.cd.detectChanges();
        });
        this.sub.add(setTags);
      }
    }
  }
}
