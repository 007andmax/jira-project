import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { TicketsListService } from '../../tickets/tickets/services/tickets-list.service';
import { Router } from '@angular/router';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { NgClass, NgStyle } from '@angular/common';
import { DynamicTooltipComponent } from '../../shared/dynamic-tooltip/dynamic-tooltip.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'left-panel-super-admin',
    templateUrl: './left-panel-super-admin.component.html',
    styleUrls: ['./left-panel-super-admin.component.scss'],
    providers: [TicketsListService],
    standalone: true,
    imports: [NgbDropdownModule, DynamicTooltipComponent, NgClass, NgStyle]
})
export class LeftPanelSuperAdminComponent implements OnInit {
  state: string = '';
  constructor(public usersStateService: UsersStateService,
    public cd: ChangeDetectorRef,
    public companiesStateService: CompaniesStateService,
    private leftPanelStateService: LeftPanelStateService,
    public ticketsListService: TicketsListService,) { }

  ngOnInit() {
  }
  getFullUserName() {
    if (!this.usersStateService.getCurrentUser()) return '';
    return `${this.usersStateService.getCurrentUser().firstName} ${this.usersStateService.getCurrentUser().lastName
      }`;
  }
  onChangeState(data) {
    this.state = data;
    this.leftPanelStateService.goToState(data);
  }
  public logOut() {
    window.location.href = '/logout';
    window.location.hash = '';
  }
}
