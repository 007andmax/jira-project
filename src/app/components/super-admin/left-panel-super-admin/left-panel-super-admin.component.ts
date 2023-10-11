import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { TicketsListService } from '../../tickets/tickets/services/tickets-list.service';
import { NavigationEnd, Router } from '@angular/router';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';

@Component({
  selector: 'left-panel-super-admin',
  templateUrl: './left-panel-super-admin.component.html',
  styleUrls: ['./left-panel-super-admin.component.scss'],
  providers: [TicketsListService]
})
export class LeftPanelSuperAdminComponent implements OnInit {
  state: string = '';
  isInitPopStateNaviate: boolean = false;
  constructor(public usersStateService: UsersStateService,
    public cd: ChangeDetectorRef,
    private router: Router,
    public companiesStateService: CompaniesStateService,
    private leftPanelStateService: LeftPanelStateService,
    public ticketsListService: TicketsListService,) { }

  ngOnInit() {
    this.router.events
      .subscribe((event: any) => {
        if (event.navigationTrigger === "popstate") this.isInitPopStateNaviate = true;
        if (this.state === '' || (event instanceof NavigationEnd && this.isInitPopStateNaviate)) {
          if (window.location.href.includes(`/tech-companies`)) this.state = 'tech-companies';
          if (window.location.href.includes(`/support-page`)) this.state = 'support-page';

          this.leftPanelStateService.firstOpen(this.state);
          this.leftPanelStateService.changeState(this.state);
          if (!this.cd['destroyed']) {
            this.cd.detectChanges();
          }
          //this.updatePage(this.state);
          if (this.isInitPopStateNaviate) this.leftPanelStateService.toggleLeftPanel(false);
          this.isInitPopStateNaviate = false;
        }
      });
  }
  getNameForAvatar() {
    if (!this.usersStateService.getCurrentUser()) return '';
    if (!this.usersStateService.getCurrentUser().avatar) return `${(this.usersStateService.getCurrentUser().firstName) ? this.usersStateService.getCurrentUser().firstName[0].toUpperCase() : ''}`;
    return '';
  }
  getFullUserName() {
    if (!this.usersStateService.getCurrentUser()) return '';
    return `${this.usersStateService.getCurrentUser().firstName} ${this.usersStateService.getCurrentUser().lastName
      }`;
  }
  onChangeState(data) {
    if (this.state !== data) {
      this.state = data;
      if (this.state === 'tech-companies') this.goToLink(`tech-companies`);
      if (this.state === 'support-page') this.goToLink(`support-page`);
      //   this.updatePage(this.state);
      //this.leftPanelStateService.changeState(this.state);
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    }
  }
  public goToLink(url) {
    this.router.navigate([`${this.companiesStateService.getCurrentCompany().techDomain}/${url}`]);
  }
  public logOut() {
    window.location.href = '/logout';
    window.location.hash = '';
  }
}
