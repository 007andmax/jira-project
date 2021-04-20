import { Component, OnInit, Input } from '@angular/core';
import { CurrentUser } from 'src/class/current-user/current-user';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';

@Component({
  selector: 'app-report-footer',
  templateUrl: './report-footer.component.html',
  styleUrls: ['./report-footer.component.scss']
})
export class ReportFooterComponent implements OnInit {
  currentUser: CurrentUser;
  currentCompany: any = null;
  @Input() orientation: string = "PORTRAIT";
  constructor(private companiesStateService: CompaniesStateService,
    private usersStateService: UsersStateService,) { }

  ngOnInit() {
    this.currentUser = this.usersStateService.getCurrentUser();
    this.currentCompany = this.companiesStateService.getCurrentCompany();
  }

}
