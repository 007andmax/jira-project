import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { SupportPageCategory } from '../../super-admin/left-panel-super-admin-categories/class/support-page-category';
import { SupportPageCategoriesService } from '../../super-admin/services/support-page-categories/support-page-categories.service';
import { SuperAdminPublicSearchListService } from './services/super-admin-public-search-list.service';

@Component({
  selector: 'super-admin-public-search',
  templateUrl: './super-admin-public-search.component.html',
  styleUrls: ['./super-admin-public-search.component.scss'],
  providers: [SuperAdminPublicSearchListService]
})
export class SuperAdminPublicSearchComponent implements OnInit {
  page: number = 0;
  offset: number = 10;
  public infiniteScrollDisabled = true;
  showPreloader: boolean = true;
  searchName: string = "";
  categories: Array<SupportPageCategory> = [];
  reqCategories: Array<SupportPageCategory> = [];
  @Output() onSelectCategory = new EventEmitter();
  @ViewChild('dp') dp: NgbDropdown;
  constructor(private elRef: ElementRef,
    private superAdminPublicSearchListService: SuperAdminPublicSearchListService,
    private supportPageCategoriesService: SupportPageCategoriesService,
    public cd: ChangeDetectorRef) { }

  ngOnInit() {
  }
  select(item) {
    this.onSelectCategory.emit({ ...item, document: { id: "" } });
  }
  clearWord() {
    this.searchName = "";
    this.categories = [];
    this.reqCategories = [];
    this.elRef.nativeElement.querySelector("#dropdownServices").value = "";
    this.onHideDropDown();
  }
  getParseSearchName() {
    return JSON.parse(JSON.stringify(this.searchName));
  }
  onSearch(event) {
    this.searchName = event.target.value;
    this.setDefaultScoll();
    this.onScroll(JSON.parse(JSON.stringify(this.searchName)));
  }
  onShowDropDown() {
    if (this.searchName.length > 0) this.dp.open();
  }
  onHideDropDown() {
    this.dp.close();
  }
  openChange(open) {
    if (open) {
      this.showPreloader = true;
      this.setDefaultScoll();
      this.onScroll(JSON.parse(JSON.stringify(this.searchName)));
    }
  }
  public onScroll(searchName) {
    this.infiniteScrollDisabled = true;
    if (searchName.length > 0) this.getTags(searchName);
    if (searchName.length === 0) this.onHideDropDown();
  }
  getTags(searchName) {
    if (this.superAdminPublicSearchListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    this.supportPageCategoriesService.searchCategory(this.searchName, this.page * this.offset).subscribe((data: any) => {
      if (searchName && this.categories.length > 0) {
        this.categories = [];
        this.reqCategories = [];
        this.page = 0;
      }
      this.categories = [...this.categories, ...data.map(item => new SupportPageCategory(item))];
      this.reqCategories = [...this.reqCategories, ...JSON.parse(JSON.stringify(data))];
      this.page++;
      this.infiniteScrollDisabled = false;
      if (this.categories.length > 0) this.onShowDropDown();
      if (this.categories.length == 0) this.onHideDropDown();
      if (data.length < 10) {
        this.superAdminPublicSearchListService.setBlockList(true);
      } else {
        this.superAdminPublicSearchListService.setBlockList(false);
      }
      this.showPreloader = false;
      this.cd.detectChanges();
    })
  }
  public setDefaultScoll() {
    this.page = 0;
    this.superAdminPublicSearchListService.setBlockList(false);
    this.categories = [];
    this.reqCategories = [];
  }
  public trackById(index, item) {
    return item.id;
  }
}
