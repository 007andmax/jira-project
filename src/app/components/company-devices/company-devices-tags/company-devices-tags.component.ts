
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DeviceTag } from '../../setting/manage-tags/manage-tags-devices/class/device-tag';
import { DeviceTagsStateService } from 'src/app/states/device-tags/device-tags-state.service';
import { Subscription, of } from 'rxjs';
import { CompanyTagsListService } from '../../companies/company-tags/services/company-tags-list.service';
import { TicketsListService } from '../../tickets/tickets/services/tickets-list.service';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { TagsRealTimeService } from 'src/app/states/tags/tags-real-time.service';
import { TagsStateService } from 'src/app/states/tags/tags-state.service';
import { DeviceTagsService } from 'src/app/services/device-tags/device-tags.service';
import { catchError, map } from 'rxjs/operators';
import { MatChipListComponent } from '../../shared/mat-chip-list/mat-chip-list.component';
import { MatChipComponent } from '../../shared/mat-chip/mat-chip.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  standalone: true,
  imports: [MatChipComponent, MatChipListComponent, CommonModule, NgbModule],
  selector: 'app-company-devices-tags',
  templateUrl: './company-devices-tags.component.html',
  styleUrls: ['./company-devices-tags.component.scss'],
  providers: [CompanyTagsListService, TicketsListService],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class CompanyDevicesTagsComponent implements OnInit {
  searchName: string = "";
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedTag: Array<DeviceTag> = [];
  tags: Array<DeviceTag> = [];
  reqTags: Array<DeviceTag> = [];
  sub = new Subscription();

  @Input() editItems: Array<string>;
  @Input() placement: string;
  @Input() showLabel: boolean = true;
  @Input() filter: boolean = false;
  @Input() blockCreateTag: boolean = false;
  @Input() blockUserTag: boolean = false;
  @Input() isDisabled: boolean = false;
  @ViewChild('userInput', { static: true }) userInput: ElementRef<HTMLInputElement>;
  @ViewChild('dp', { static: true }) dp: any;
  @Output() tagsChange = new EventEmitter();
  /**
   * Creates an instance of the TagsComponent with the injected services
   * @param {TagsService} tagsService Service to work with tags
   * @param {TagsStateService} tagsState to work with tags state
   */
  public constructor(
    private deviceTagsStateService: DeviceTagsStateService,
    public tagsStateService: TagsStateService,
    public tagsRealTimeService: TagsRealTimeService,
    public cd: ChangeDetectorRef,
    private deviceTagsService: DeviceTagsService,
    public ticketsListService: TicketsListService,
  ) { }

  /**
   * Initializes modal quotes. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  public ngOnInit() {
    if (this.deviceTagsStateService.getTags().length > 0) this.getTags(this.deviceTagsStateService.getTags());
    let onGetTags = this.deviceTagsStateService.onGetTags.subscribe(data => {
      this.getTags(data);
    })
    this.sub.add(onGetTags);
  }
  public setSelectedTag(data) {
    this.selectedTag = data;
    this.cd.markForCheck();
  }
  private getTags(data) {
    this.tags = JSON.parse(JSON.stringify(data)).map(item => new DeviceTag(item));
    this.reqTags = JSON.parse(JSON.stringify(data)).map(item => new DeviceTag(item));
    this.cd.markForCheck();
  }
  onSearch(event) {
    this.searchName = event.target.value;
    this.tags = this.reqTags.filter(item => item.name.toLowerCase().includes(this.searchName.toLocaleLowerCase()));
    this.cd.markForCheck();
  }

  public clearWithOutChanges() {
    this.selectedTag = [];
    this.cd.markForCheck();
  }
  onKeyUp(event) {
    if (event.keyCode === 13) {
      let indexSelected = this.tags.findIndex(item => item.selected);
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
          this.dp.close();
          this.cd.detectChanges();
          return;
        }
        let tag: any = {
          "tags": [
            value.trim()
          ]
        }
        let setTags = this.deviceTagsService.addTags(tag).pipe(map((res) => res),
          catchError(error => of(undefined)))
          .subscribe((res) => {
            res.tags.forEach(item => {
              this.selectedTag.push(new DeviceTag(item));
            });
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

  /**
   * Remove tag from selected
   * @param index - user index
   */
  public remove(index): void {
    if (index >= 0) {
      this.selectedTag.splice(index, 1);
      this.tagsChange.emit(this.selectedTag);
      this.cd.detectChanges();
    }
  }
  isSeleted(item) {
    return this.selectedTag.find(element => element.id === item.id);
  }
  public toggleItem(newItem) {
    let findIndex = this.selectedTag.findIndex(item => item.id === newItem.id);
    if (findIndex > -1) {
      this.selectedTag.splice(findIndex, 1);
    } else {
      this.selectedTag.push(newItem);
      this.tags = this.reqTags;
    }
    this.tagsChange.emit(this.selectedTag);
    this.userInput.nativeElement.value = '';

    if (this.searchName.length > 0) {
      this.searchName = "";
      this.tags = this.reqTags;
    }
  }

  /**
   * Close tags list
   */
  public close() {
    this.selectedTag = [];
    this.tags = this.reqTags;
    this.tagsChange.emit(this.selectedTag);
    this.cd.detectChanges();
  }

  public trackById(index, item) {
    return item.id;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
