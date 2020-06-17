import { Component, OnInit, Input } from '@angular/core';
import { CompaniesService } from 'src/ng2/app/services/company/companies.service';
 
import { BillableProfile } from '../class/billable-profile';
import { Company } from 'src/ng2/app/interfaces/company/company';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { CurrentUser } from 'src/ng2/class/current-user/current-user';
import { User } from '../../../users/class/user';
import { TicketsListService } from '../../../tickets/tickets/services/tickets-list.service';

@Component({
  selector: 'app-billable-item',
  templateUrl: './billable-item.component.html',
  styleUrls: ['./billable-item.component.scss'],
  providers: [TicketsListService]
})
export class BillableItemComponent implements OnInit {
  @Input() item:BillableProfile;
  company:Company;
  salesPerson:User; 
  totalSum:number = 0;
  constructor(private companiesStateService:CompaniesStateService,
    public ticketsListService: TicketsListService,
    private usersStateService:UsersStateService) { }

  ngOnInit() {
   
    let company = this.companiesStateService.getCompanies().find(item => item.id === this.item.id);
    this.salesPerson = this.usersStateService.getAllUsers().find(item => item.id === company.techLeadId);
  }
  ngDocheck() {
   
  }
  parseTotal(value) {
    return parseFloat(value.toString()).toFixed(2)
  }
  getStyleAvatar(user) {
    if (!user) return '';
    if (!user.avatar) {
      return 'blue';
    }
    if (user.id) {
      return `url(${'/users/' + (user.id || 'default') + '/image' + (user.avatar ? '.jpg?t=' + user.avatar.updatedAt :
        '')}) 0% 0% / cover no-repeat`
    } else if (user.avatar && user.avatar.origin && user.avatar.origin.id) {
      return `url(/file/${(user.avatar.origin.id)}.jpg) 0% 0% / cover no-repeat`;
    } else {
      return 'blue';
    }
  };
}
