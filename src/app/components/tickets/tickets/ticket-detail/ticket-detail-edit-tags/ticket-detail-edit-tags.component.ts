import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Tag } from 'src/app/interfaces/tag/tag';
import { TagsService } from 'src/app/services/tags/tags.service';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { TagsRealTimeService } from 'src/app/states/tags/tags-real-time.service';
import { TagsStateService } from 'src/app/states/tags/tags-state.service';
import { TicketsPermissionsService } from '../../ticket-edit-aside/services/tickets-permissions.service';
import { TicketProfile } from '../../class/ticket-profile';

@Component({
  selector: 'ticket-detail-edit-tags',
  templateUrl: './ticket-detail-edit-tags.component.html',
  styleUrls: ['./ticket-detail-edit-tags.component.scss'],
  providers: [TicketsPermissionsService]
})
export class TicketDetailEditTagsComponent implements OnInit, OnDestroy {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  focus = false;
  isResend = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl();
  @Input() selectedTag = [];
  tags: Array<Tag> = [];
  reqTags: Array<Tag> = [];
  sub = new Subscription();
  editItem: any;
  init: boolean = false;
  isChangeInput: boolean = false;
  @ViewChild('userInput') userInput: ElementRef<HTMLInputElement>;
  @Output() tagsChange = new EventEmitter();
  @ViewChild('tagsDp') tagsDp: any;
  @Output() tagsRemove = new EventEmitter();
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  /**
   * Creates an instance of the TagsComponent with the injected services
   * @param {TagsService} tagsService Service to work with tags
   * @param {TagsStateService} tagsState to work with tags state
   */
  public constructor(
    public tagsService: TagsService,
    private tagsState: TagsStateService,
    public tagsRealTimeService: TagsRealTimeService,
    public cd: ChangeDetectorRef,
    public customerPortalStateService: CustomerPortalStateService,
    public ticketsPermissionsService: TicketsPermissionsService,
    public elRef: ElementRef
  ) { }

  /**
  * Initializes modal quotes. See [ngOnInit]{@see OnInit#ngOnInit}
  */
  public ngOnInit() {
    if (this.tagsState.getTags().length == 0) {
      let getTags = this.tagsService.getTags().subscribe((data) => {
        this.tagsState.setTags(data);
        this.tags = data;
        this.reqTags = JSON.parse(JSON.stringify(data));
        this.sortTags();
      })
      this.sub.add(getTags);
    } else {
      this.tags = this.tagsState.getTags();
      this.reqTags = JSON.parse(JSON.stringify(this.tagsState.getTags()));
      this.sortTags();
    }

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
  updateTagByRealTimes(data) {
    let index = this.tags.findIndex(item => item.id === data.id);
    let indexreqTags = this.reqTags.findIndex(item => item.id === data.id);
    if (index > -1) {
      this.tags[index] = data;
    } else {
      this.tags.push(data);
    }
    if (indexreqTags > -1) {
      this.reqTags[index] = data;
    } else {
      this.reqTags.push(data);
    }
  }
  sortTags() {
    this.tags = this.tags.sort((a, b) => (a.word.toLowerCase() > b.word.toLowerCase()) ?
      1 : ((b.word.toLowerCase() > a.word.toLowerCase()) ? -1 : 0));
    this.reqTags = this.reqTags.sort((a, b) => (a.word.toLowerCase() > b.word.toLowerCase()) ?
      1 : ((b.word.toLowerCase() > a.word.toLowerCase()) ? -1 : 0));
  }
  /**
  * Subscribe for edit mode
  */
  private onCheckEditItem() {
    let getTagsFromEdit = this.tagsState.getTagsFromEdit().subscribe((data) => {
      this.selectedTag = data;
    });
    this.sub.add(getTagsFromEdit);
  }

  /**
  * Subscribe for clear data
  */
  private onInitClearState() {
    let getClearState = this.tagsState.getClearState().subscribe(() => this.close());
    this.sub.add(getClearState);
  }

  public isSelected(id) {
    return this.selectedTag.find(item => item.id === id);
  }

  onSearch(event) {
    this.isChangeInput = (event.target.value.length > 0) ? true : false;
    this.tags = this.reqTags.filter(item => item.word.includes(event.target.value));
  }

  /**
   * Close tags list
   */
  public close() {
    this.selectedTag = [];
  }

  public trackById(index, item) {
    return item.id;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  public selected(tag): void {
    // this.init = true;
    let find = this.selectedTag.find(item => item.id === tag.id);
    if (!find) {
      this.selectedTag.push(tag);
      this.isChangeInput = false;
      this.tagsChange.emit(this.selectedTag);
    } else {
      this.isChangeInput = false;
    }
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
          colorCode: 0, usedCounter: 0, word: this.userInput.nativeElement.value.trim(), id: ''
        }
        this.tagsDp.close();
        let setTags = this.tagsService.addTicketsTags(tag).subscribe((res) => {
          tag.id = res.id;
          this.tags.push(tag);
          this.selectedTag.push(tag);
          this.userInput.nativeElement.value = '';
          this.tagCtrl.setValue(null);
          this.isChangeInput = false;
          this.init = false;
          this.tagsChange.emit(this.selectedTag);

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
          colorCode: 0, usedCounter: 0, word: value.trim(), id: ''
        }
        this.tagsDp.close();
        let setTags = this.tagsService.addTicketsTags(tag).subscribe((res) => {
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
        }, err => {
          this.isChangeInput = false;
        });
        this.sub.add(setTags);
      }

    }

  }
  onChangeDropDown(data) {
    if (!data) {
      this.tags = JSON.parse(JSON.stringify(this.reqTags));
      this.elRef.nativeElement.querySelector("#search-dropdown").value = "";
    }
  }
  public remove(index): void {
    if (index >= 0) {
      this.selectedTag.splice(index, 1);
      this.tagsRemove.emit(this.selectedTag);
    }
    //   this.init = true;
  }
}
