import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { CompanyAssociateItem } from './class/company-associate-item';

@Component({
  selector: 'company-associate',
  templateUrl: './company-associate.component.html',
  styleUrls: ['./company-associate.component.scss']
})
export class CompanyAssociateComponent implements OnInit, OnDestroy {
  @Input() company: any;
  searchName: string = "";
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl();
  @Input() selectedCompanies: Array<CompanyAssociateItem> = [];
  companies: Array<CompanyAssociateItem> = [];
  reqCompanies: Array<CompanyAssociateItem> = [];
  sub = new Subscription();
  @Input() editItems: Array<string>;
  @Input() placement: string;
  @Input() filter: boolean = false;
  @Input() blockCreateTag: boolean = false;
  @ViewChild('userInput') userInput: ElementRef<HTMLInputElement>;
  @ViewChild('dp') dp: any;
  @Output() companiesChange = new EventEmitter();
  /**
   * Creates an instance of the TagsComponent with the injected services
   * @param {TagsService} tagsService Service to work with tags
   * @param {TagsStateService} tagsState to work with tags state
   */
  public constructor(

    private companiesStateService: CompaniesStateService,

    private elRef: ElementRef,
    public cd: ChangeDetectorRef
  ) { }

  /**
   * Initializes modal quotes. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  public ngOnInit() {
    if (this.companiesStateService.getCompanies().length > 0) this.getClientsList(this.companiesStateService.getCompanies().map(item => new CompanyAssociateItem(item)));
    let getOnCompanies = this.companiesStateService.getOnCompanies().subscribe((data) => {
      this.getClientsList(data.map(item => new CompanyAssociateItem(item)));
    })
    this.sub.add(getOnCompanies);

  }
  public getClientsList(data) {
    this.companies = data.filter(item => ((this.company) ? item.id !== this.company.id : true) && item.accountType === 'CLIENT' && !item.deletedAt).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
    this.reqCompanies = data.filter(item => ((this.company) ? item.id !== this.company.id : true) && item.accountType === 'CLIENT' && !item.deletedAt).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
    this.onCheckEditItem();
  }
  getCompanyName(tag) {
    let company = this.companiesStateService.getCompanies().find(item => item.id === tag.companyId);
    return (company) ? company.name : '';
  }
  onSearch(event) {
    this.searchName = event.target.value;
    this.companies = this.reqCompanies.filter(item => item.name.toLowerCase().includes(this.searchName.toLowerCase()));
    this.cd.detectChanges();
  }

  /**
  * Subscribe for edit mode
  */
  onCheckEditItem() {
    if (this.editItems) this.editItems.forEach(item => {
      this.selectedCompanies.push(this.companies.find(tag => tag.id === item));
    })
  }
  public setEditItems(data) {
    this.editItems = data;
    this.editItems.forEach(item => {
      this.selectedCompanies.push(this.companies.find(tag => tag.id === item));
    })
  }
  public clearWithOutChanges() {

    this.selectedCompanies = [];
  }

  /**
  * Subscribe for clear data
  */

  public setDefaultScoll() {

    this.selectedCompanies = [];

  }


  openChange(open) {
    if (open) {


      this.companies = this.reqCompanies;
    }
  }
  isScrolledIntoView(el) {
    var rect = el.getBoundingClientRect();
    var elemTop = rect.top;
    var elemBottom = rect.bottom;
    var isVisible = (elemTop >= 0) && (elemBottom <= this.elRef.nativeElement.querySelector(".content").innerHeight);
    return isVisible;
  }

  /**
   * Remove tag from selected
   * @param index - user index
   */
  public remove(index): void {
    if (index >= 0) {
      this.selectedCompanies.splice(index, 1);
      this.companiesChange.emit(this.selectedCompanies.map(item => item.id));
      this.cd.detectChanges();
    }
  }
  isSeleted(item) {
    return this.selectedCompanies.find(element => element.id === item.id);
  }
  public toggleItem(newItem) {
    let findIndex = this.selectedCompanies.findIndex(item => item.id === newItem.id);
    if (findIndex > -1) {
      this.selectedCompanies.splice(findIndex, 1);
    } else {
      this.selectedCompanies.push(newItem);
      this.companies = this.reqCompanies;
    }
    this.companiesChange.emit(this.selectedCompanies.map(item => item.id));
    this.tagCtrl.setValue(null);

    if (this.searchName.length > 0) {
      this.searchName = "";
      this.setDefaultScoll();

    }

  }

  public setSelectedTag(data) {
    this.selectedCompanies = data;
  }

  /**
   * Close tags list
   */
  public close() {
    this.selectedCompanies = [];
    this.companies = this.reqCompanies;
    this.companiesChange.emit([]);
  }

  public trackById(index, item) {
    return item.id;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}

