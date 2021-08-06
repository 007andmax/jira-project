import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';

@Component({
  selector: 'company-associate',
  templateUrl: './company-associate.component.html',
  styleUrls: ['./company-associate.component.scss']
})
export class CompanyAssociateComponent implements OnInit, OnDestroy {
  page: number = 0;
  public infiniteScrollDisabled = true;

  searchName: string = "";
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl();
  @Input() selectedCompanies = [];
  companies = [];
  reqCompanies = [];
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
    if (this.companiesStateService.getCompanies().length > 0) this.getClientsList(this.companiesStateService.getCompanies());
    let getOnCompanies = this.companiesStateService.getOnCompanies().subscribe((data) => {
      this.getClientsList(data);
    })
    this.sub.add(getOnCompanies);
    this.onCheckEditItem();
  }
  getClientsList(data) {
    this.companies = data.filter(item => item.accountType === 'CLIENT' && !item.deletedAt).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
    this.reqCompanies = data.filter(item => item.accountType === 'CLIENT' && !item.deletedAt).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
  }
  getCompanyName(tag) {
    let company = this.companiesStateService.getCompanies().find(item => item.id === tag.companyId);
    return (company) ? company.name : '';
  }
  onSearch(event) {
    this.searchName = event.target.value;
    this.setDefaultScoll();
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

      this.setDefaultScoll();
      this.companies = this.reqCompanies;
    }
  }
  /* onKeyUp(event) {
     if (event.keyCode === 40) {
       let indexSelected = this.tags.findIndex(item => item.isHover);
       if (indexSelected > -1) this.tags[indexSelected].isHover = false;
       indexSelected++;
       if (indexSelected === this.tags.length) indexSelected = 0;
       this.tags[indexSelected].isHover = true;
       let isScrolledIntoView = this.isScrolledIntoView(this.elRef.nativeElement.querySelector(`#tag-${this.tags[indexSelected].id}`));
       if (!isScrolledIntoView) this.elRef.nativeElement.querySelector('.content').scrollTop = ((indexSelected < 8) ? 0 : indexSelected * 32);
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
       return;
     }
     if (event.keyCode === 13) {
       let indexSelected = this.tags.findIndex(item => item.isHover);
       if (indexSelected > -1) {
         let findTag = this.selectedTag.find(item => item.id === this.tags[indexSelected].id);
         if (!findTag) {
           this.searchName = "";
           this.selectedTag.push(this.tags[indexSelected]);
           this.companiesChange.emit(this.selectedTag);
         }
         return;
       }
 
       const input = event.target.input;
       const value = event.target.value;
       if ((value || '').trim()) {
         let search = this.tags.find(item => item.word == value);
         if (search) {
           this.selectedTag.push(search);
           this.companiesChange.emit(this.selectedTag);
           if (input) {
             input.value = '';
           }
           this.tagCtrl.setValue(null);
           this.searchName = "";
           this.dp.close();
           return;
         }
         let tag: any = {
           colorCode: 0, usedCounter: 0, word: value.trim(), id: ''
         }
         let setTags = this.tagsService.addCompanyTags(tag).subscribe((res) => {
           tag.id = res.id;
           this.reqTags.push(tag);
           this.tags = this.reqTags;
           this.selectedTag.push(tag);
           this.companiesChange.emit(this.selectedTag);
           if (input) {
             input.value = '';
           }
           this.tagCtrl.setValue(null);
           this.searchName = "";
         });
         this.sub.add(setTags);
       }
     }
   }
 */
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
      this.companiesChange.emit(this.selectedCompanies);
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
      this.selectedCompanies = this.reqCompanies;
    }
    this.companiesChange.emit(this.selectedCompanies);
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
    this.companiesChange.emit(this.selectedCompanies);
  }

  public trackById(index, item) {
    return item.id;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}

