import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Company } from 'src/app/interfaces/company/company';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { DocumentLinked } from '../../../class/document-linked';
import { DocumentCompanyUser } from '../../class/document-company-user';

@Component({
  selector: 'documents-linked',
  templateUrl: './documents-linked.component.html',
  styleUrls: ['./documents-linked.component.scss']
})
export class DocumentsLinkedComponent implements OnInit {
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  linkedCtrl = new FormControl();
  public selectedUserAndCompanies: Array<DocumentCompanyUser> = [];

  @Input() editItems: DocumentLinked;
  @Input() isDisabled: boolean = false;
  public tabs = ['User', 'Company'];
  public currentTab = this.tabs[0];
  public usersList = [];
  companiesList: Array<Company> = [];
  public requsersList = [];
  reqcompaniesList: Array<Company> = [];
  @Output() onSelectedItem = new EventEmitter<any>();
  sub: Subscription = new Subscription();
  constructor(public cd: ChangeDetectorRef,
    private companiesState: CompaniesStateService,
    private usersStateService: UsersStateService,) { }

  ngOnInit() {
    if (this.companiesState.getCompanies().length > 0) this.getClientsList(this.companiesState.getCompanies());
    let getOnCompanies = this.companiesState.getOnCompanies().subscribe((data) => {
      this.getClientsList(data);
    })
    this.sub.add(getOnCompanies);
    if (this.usersStateService.getAllUsers().length > 0) this.onGetUsers(this.usersStateService.getAllUsers());
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.onGetUsers(data);
    })
    this.sub.add(getOnUsers);
  }

  onSearch(event) {
    this.usersList = this.requsersList.filter(item => `${item.firstName} ${item.lastName}`.toLowerCase().includes(event.target.value));
    this.companiesList = this.reqcompaniesList.filter(item => item.name.toLowerCase().includes(event.target.value));
  }

  public onGetUsers(data) {
    this.usersList = data.filter(item => {
      if (item.accountType !== 'TECH' && !item.deletedAt) return item;
    });
    this.usersList.sort((a, b) => (`${a.firstName} ${a.lastName}`.toLowerCase() > `${b.firstName} ${b.lastName}`.toLowerCase()) ?
      1 : ((`${b.firstName} ${b.lastName}`.toLowerCase() > `${a.firstName} ${a.lastName}`.toLowerCase()) ? -1 : 0));
    if (this.editItems) {
      this.editItems.users.forEach(item => {
        let user = this.usersList.find(userItem => userItem.id === item);
        this.selectedUserAndCompanies.push(new DocumentCompanyUser(user.id, `${user.firstName} ${user.lastName}`, "USER"))
      });
    }
    this.requsersList = JSON.parse(JSON.stringify(this.usersList));
  }
  private getClientsList(data) {
    this.companiesList = data.filter(item => item.accountType === 'CLIENT' && !item.deletedAt).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
    if (this.editItems) {
      this.editItems.companies.forEach(item => {
        let company = this.companiesList.find(companyItem => companyItem.id === item);
        this.selectedUserAndCompanies.push(new DocumentCompanyUser(company.id, company.name, "COMPANY"))
      });
    }
    this.reqcompaniesList = JSON.parse(JSON.stringify(this.companiesList));
  }

  public toggleItem(newItem, type) {
    let findIndex = this.selectedUserAndCompanies.findIndex(item => item.id === newItem.id && item.type === type);
    if (findIndex > -1) {
      this.selectedUserAndCompanies.splice(findIndex, 1);
    } else {
      if (type === "USER") this.selectedUserAndCompanies.push(new DocumentCompanyUser(newItem.id, `${newItem.firstName} ${newItem.lastName}`, "USER"));
      if (type === "COMPANY") this.selectedUserAndCompanies.push(new DocumentCompanyUser(newItem.id, newItem.name, "COMPANY"));
    }
    this.onSelectedItem.emit(this.selectedUserAndCompanies);
    this.linkedCtrl.setValue(null);
    this.usersList = JSON.parse(JSON.stringify(this.requsersList));
    this.companiesList = JSON.parse(JSON.stringify(this.reqcompaniesList));
  }

  public setCurrentTab($event, item) {
    this.stopEvent($event);
    this.currentTab = item;
    this.cd.detectChanges();
  }


  private stopEvent($event) {
    $event.preventDefault();
    $event.stopPropagation();
  }


  isSeleted(item) {
    return this.selectedUserAndCompanies.find(element => element.id === item.id);
  }
  removeItem(index) {
    this.selectedUserAndCompanies.splice(index, 1);
    this.onSelectedItem.emit(this.selectedUserAndCompanies);
  }
  public trackByIndex(index, item) {
    return index;
  }
}
