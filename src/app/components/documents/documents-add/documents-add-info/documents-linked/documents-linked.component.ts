import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Company } from 'src/app/interfaces/company/company';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { DocumentCompanyUser } from '../../class/document-company-user';

@Component({
  selector: 'documents-linked',
  templateUrl: './documents-linked.component.html',
  styleUrls: ['./documents-linked.component.scss']
})
export class DocumentsLinkedComponent implements OnInit {

  public selectedUserAndCompanies: Array<DocumentCompanyUser> = [];
  public showSelect = false;

  public tabs = ['User', 'Company'];
  public currentTab = this.tabs[0];
  public usersList = [];

  companiesList: Array<Company> = [];
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
  public onGetUsers(data) {
    this.usersList = data.filter(item => {
      if (item.accountType !== 'TECH' && !item.deletedAt) return item;
    });

  }
  private getClientsList(data) {
    this.companiesList = data.filter(item => item.accountType === 'CLIENT' && !item.deletedAt).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
  }



  public toggleItem(newItem, type) {

    let findIndex = this.selectedUserAndCompanies.findIndex(item => item.id === newItem.id && item.type === type);
    if (findIndex > -1) {
      this.selectedUserAndCompanies.splice(findIndex, 1);
    } else {
      if (type === "USER") this.selectedUserAndCompanies.push(new DocumentCompanyUser(newItem.id, `${newItem.firstName} ${newItem.lastName}`, "USER"));
      if (type === "COMPANY") this.selectedUserAndCompanies.push(new DocumentCompanyUser(newItem.id, newItem.name, "COMPANY"));
      console.log("this.selectedUserAndCompanies", this.selectedUserAndCompanies);
    }
    this.onSelectedItem.emit(this.selectedUserAndCompanies);

  }

  public setCurrentTab($event, item) {
    this.stopEvent($event);
    this.currentTab = item;

    this.cd.detectChanges();
  }
  public hideSelectWrapper() {
    this.showSelect = false;

  }
  public showSelectWrapper($event) {
    this.showSelect = !this.showSelect;
    this.stopEvent($event);
    this.cd.detectChanges();
  }
  private stopEvent($event) {
    $event.preventDefault();
    $event.stopPropagation();
  }

  public onClosed() {
    this.companiesList = [];
    this.usersList = [];

    this.currentTab = this.tabs[0];
    this.showSelect = false;
  }
  isSeleted(item) {
    return this.selectedUserAndCompanies.find(element => element.id === item.id);
  }
  removeItem(index) {
    this.selectedUserAndCompanies.splice(index, 1);
  }
  public trackByIndex(index, item) {
    return index;
  }

}
