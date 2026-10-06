
import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CompanyTagsListService } from 'src/app/components/companies/company-tags/services/company-tags-list.service';
import { MatChipListComponent } from 'src/app/components/shared/mat-chip-list/mat-chip-list.component';
import { MatChipComponent } from 'src/app/components/shared/mat-chip/mat-chip.component';
import { MatFormFieldComponent } from 'src/app/components/shared/mat-form-field/mat-form-field.component';
import { TicketDetailEditTagsComponent } from 'src/app/components/tickets/tickets/ticket-detail/ticket-detail-edit-tags/ticket-detail-edit-tags.component';
import { TicketsPermissionsService } from 'src/app/components/tickets/tickets/ticket-edit-aside/services/tickets-permissions.service';

@Component({
  standalone: true,
  imports: [MatChipComponent, ReactiveFormsModule, NgbModule, MatChipListComponent, InfiniteScrollModule, MatFormFieldComponent, CommonModule],
  selector: 'app-file-manager-file-info-tags',
  templateUrl: './file-manager-file-info-tags.component.html',
  styleUrls: ['./file-manager-file-info-tags.component.scss'],
  providers: [TicketsPermissionsService, CompanyTagsListService],

})
export class FileManagerFileInfoTagsComponent extends TicketDetailEditTagsComponent {
  public infiniteScrollDisabled = true;
  page: number = 0;
  searchName: string = "";
  showPreloader: boolean = true;
  public ngOnInit() {
    let changeTagsArray = this.tagsRealTimeService.changeTagsArray.subscribe((data: any) => {
      if (data.action === "TAG_SAVED" && Array.isArray(data.data)) data.data.forEach(element => this.updateTagByRealTimes(element));
      if (data.action === "TAG_SAVED" && !Array.isArray(data.data)) this.updateTagByRealTimes(data.data);
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
  onChangeDropDown(open) {
    if (open) {
      //  this.elRef.nativeElement.querySelector("#search-dropdown").value = "";
      this.showPreloader = true;
      this.setDefaultScoll();
      this.onScroll();
    }
  }
  onSearch(event) {
    this.searchName = event.target.value;
    this.setDefaultScoll();
    this.onScroll(JSON.parse(JSON.stringify(this.searchName)));
  }
  public setDefaultScoll() {
    this.page = 0;
    this.companyTagsListService.setBlockList(false);
    this.tags = [];
    this.reqTags = [];
    this.cd.markForCheck();
  }
  public onScroll(searchName = null) {

    this.infiniteScrollDisabled = true;
    this.getTags(searchName);
  }
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
      this.tags = [...this.tags, ...data.commonTagViews];
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
  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (event.target.closest('.selected-tag-ticket')) return;
    if (!event.target.closest('app-ticket-edit-tags') && !event.target.closest('.dropdown-menu') && (this.init || this.isChangeInput)) {
      if (this.isChangeInput) {
        if (this.userInput.nativeElement.value.trim() == "") {
          this.tagCtrl.setValue(null);
          return;
        }
        if (this.tags.find(item => item.word == this.userInput.nativeElement.value.trim())) {
          this.selected(this.tags.find(item => item.word == this.userInput.nativeElement.value.trim()));
          this.tagCtrl.setValue(null);
          this.tagsDp.close();
          return;
        }
        let tag: any = {
          colorCode: 0, usedCounter: 0, word: this.userInput.nativeElement.value.trim(), defaultTag: "FILE_TAG"
        }
        this.tagsDp.close();
        let setTags = this.tagsService.addCompanyTags(tag).subscribe((res) => {
          tag.id = res.id;
          this.tags.push(tag);
          this.selectedTag.push(tag);
          this.userInput.nativeElement.value = '';
          this.tagCtrl.setValue(null);
          this.isChangeInput = false;
          this.init = false;
          this.tagsChange.emit(this.selectedTag);
          this.searchName = '';
        }, err => {
          this.isChangeInput = false;

        });
        this.sub.add(setTags);
      } else {
        this.isChangeInput = false;
        this.init = false;
        this.tagsChange.emit(this.selectedTag);
      }

    }
  }
  onKeyUp(event) {

    if (event.keyCode === 13) {
      const input = event.target.input;
      const value = event.target.value;

      if ((value || '').trim()) {
        if (this.tags.find(item => item.word == value)) {
          this.selected(this.tags.find(item => item.word == value));
          if (input) {
            input.value = '';
          }
          this.tagCtrl.setValue(null);
          this.tagsDp.close();
          return;
        }
        let tag: any = {
          colorCode: 0, usedCounter: 0, word: value.trim(), defaultTag: "FILE_TAG"
        }
        this.tagsDp.close();
        let setTags = this.tagsService.addCompanyTags(tag).subscribe((res) => {
          this.isChangeInput = false;
          //  this.init = true;
          tag.id = res.id;
          this.tags.push(tag);
          this.selectedTag.push(tag);
          if (input) {
            input.value = '';
          }
          this.tagCtrl.setValue(null);
          this.tagsChange.emit(this.selectedTag);
          this.searchName = '';
        }, err => {
          this.isChangeInput = false;
        });
        this.sub.add(setTags);
      }

    }

  }
}
