import { ChangeDetectionStrategy, Component } from '@angular/core';
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
          this.cd.detectChanges();
        }
        return;
      }

      const input = event.target.input;
      const value = event.target.value;
      if ((value || '').trim()) {
        let search = this.tags.find(item => item.word == value);
        if (search) {
          this.selectedTag.push(search);
          this.tagsChange.emit(this.selectedTag);
          if (input) {
            input.value = '';
          }
          this.userInput.nativeElement.value = '';
          this.searchName = "";
          this.dp.close();
          this.cd.detectChanges();
          return;
        }
        let tag: any = {
          colorCode: 0, usedCounter: 0, word: value.trim(), id: '',
          defaultTag: "FILE_TAG"
        }
        let setTags = this.tagsService.addCompanyTags(tag).subscribe((res) => {
          tag.id = res.id;
          this.reqTags.push(tag);
          this.tags = this.reqTags;
          this.selectedTag.push(tag);
          this.tagsChange.emit(this.selectedTag);
          if (input) {
            input.value = '';
          }
          this.userInput.nativeElement.value = '';
          this.searchName = "";
          this.cd.detectChanges();
          this.showPreloader = true;
          this.setDefaultScoll();
          this.onScroll();
        });
        this.sub.add(setTags);
      }
    }
  }
}
