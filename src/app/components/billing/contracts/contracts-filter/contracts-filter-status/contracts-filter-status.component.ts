import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ContractsFilterStatus } from '../../class/contracts-filter-status';
import { CompanyTagsComponent } from 'src/app/components/companies/company-tags/company-tags.component';
import { CompanyTagsListService } from 'src/app/components/companies/company-tags/services/company-tags-list.service';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Subscription } from 'rxjs';
import { CompanyTag } from 'src/app/components/companies/company-tags/class/company-tag';
import { CompanyTagsStateService } from 'src/app/components/companies/company-tags/states/company-tags-state.service';
import { DeviceTagsService } from 'src/app/services/device-tags/device-tags.service';
import { TagsService } from 'src/app/services/tags/tags.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { DeviceTagsStateService } from 'src/app/states/device-tags/device-tags-state.service';
import { TagsRealTimeService } from 'src/app/states/tags/tags-real-time.service';
import { TagsStateService } from 'src/app/states/tags/tags-state.service';

@Component({
  selector: 'app-contracts-filter-status',
  templateUrl: './contracts-filter-status.component.html',
  styleUrls: ['./contracts-filter-status.component.scss'],
  providers: [CompanyTagsListService, TicketsListService]
})
export class ContractsFilterStatusComponent implements OnInit, OnDestroy {

  selected: Array<ContractsFilterStatus> = [];
  list: Array<ContractsFilterStatus> = [];
  reqList: Array<ContractsFilterStatus> = [new ContractsFilterStatus('Current', 'CURRENT'),
  new ContractsFilterStatus('Pending', 'PENDING'),
  new ContractsFilterStatus('Terminated', 'TERMINATED'),
  new ContractsFilterStatus('Expired', 'EXPIRED')]
  sub = new Subscription();
  placeholder: string = 'Select by Status';
  @ViewChild('userInput', { static: true }) userInput: ElementRef<HTMLInputElement>;
  @ViewChild('dp', { static: true }) dp: any;
  @Output() onChange = new EventEmitter();
  /**
   * Creates an instance of the TagsComponent with the injected services
   * @param {TagsService} tagsService Service to work with tags
   * @param {TagsStateService} tagsState to work with tags state
   */
  public constructor(
    public tagsService: TagsService,
    private tagsState: CompanyTagsStateService,
    public tagsStateService: TagsStateService,
    private companiesStateService: CompaniesStateService,
    public companyTagsListService: CompanyTagsListService,
    public tagsRealTimeService: TagsRealTimeService,
    public elRef: ElementRef,
    public cd: ChangeDetectorRef,
    public deviceTagsService: DeviceTagsService,
    public ticketsListService: TicketsListService,
    public deviceTagsStateService: DeviceTagsStateService,
  ) { }

  /**
   * Initializes modal quotes. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  public ngOnInit() {
    this.list = JSON.parse(JSON.stringify(this.reqList));
  }
  onSearch(event) {
    this.list = this.reqList.filter(item => item.title.toLowerCase().includes(event.target.value.toLowerCase()));
  }

  /**
  * Subscribe for edit mode
  */


  public clearWithOutChanges() {
    this.userInput.nativeElement.value = '';
    this.selected = [];
    this.list = this.reqList;
    this.userInput.nativeElement.blur();
    if (this.dp) this.dp.close();
    this.cd.detectChanges();
  }



  /**
   * Remove tag from selected
   * @param index - user index
   */
  public remove(index): void {
    if (index >= 0) {
      this.selected.splice(index, 1);
      this.onChange.emit(this.selected);
      this.cd.detectChanges();
    }
  }
  isSelected(status) {
    return this.selected.find(element => element.status === status);
  }
  public toggleItem(newItem) {
    let findIndex = this.selected.findIndex(item => item.status === newItem.status);
    if (findIndex > -1) {
      this.selected.splice(findIndex, 1);
    } else {
      this.selected.push(newItem);
      this.list = this.reqList;
    }
    this.onChange.emit(this.selected);
    this.userInput.nativeElement.value = '';
  }

  public trackById(index, item) {
    return item.status;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}