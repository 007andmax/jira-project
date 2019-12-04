import { Component, OnInit, Input } from '@angular/core';
import { User } from '../class/user';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { Company } from 'src/ng2/app/interfaces/company/company';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent implements OnInit {
  @Input() user: User;
  companies:Array<Company> = []; 
  constructor( private companiesStateService:CompaniesStateService) { }
  getNameForAvatar () {
    if (!this.user.avatar)  return `${(this.user.firstName) ? this.user.firstName[0].toUpperCase() : ''}${(this.user.lastName) ? this.user.lastName[0].toUpperCase() : ''}`;
    return '';
  }
  getUserName () {
    return `${this.user.firstName} ${this.user.lastName}`;
  }
  getContact() {
    let str = '';
    if (this.user.phoneNumbers && this.user.phoneNumbers.length && this.user.phoneNumbers[0] && this.user.phoneNumbers[0].number) str += this.user.phoneNumbers[0].number;
    if (this.user.phoneNumbers && this.user.phoneNumbers.length && this.user.phoneNumbers[1] && this.user.phoneNumbers[1].number) str += '<br/>' + this.user.phoneNumbers[1].number;
   return str;
  }
  getUserCompanyName () {
    if (this.user.company.isDefault) return '';
    let index = this.companies.findIndex( item => item.id === this.user.company.id);
    return (index > -1) ? this.companies[index].name : '';
  }
  getUserAvatarUrl () {
    if (this.user.avatar && this.user.avatar.origin && this.user.avatar.origin.id) {
      return '/file/' + (this.user.avatar.origin.id) + '.jpg';
    } 
    return '';
  };

  ngOnInit() {
   if (!this.user.firstName) console.log('user',this.user);
    if (this.companiesStateService.getCompanies().length > 0) this.companies= this.companiesStateService.getCompanies();
    let getOnCompanies =  this.companiesStateService.getOnCompanies().subscribe((data) => {
this.companies = data;
        
      })
      //this.sub.add(getOnCompanies);
  }

}
