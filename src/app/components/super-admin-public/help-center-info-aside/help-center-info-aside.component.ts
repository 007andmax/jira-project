import { SuperAdminPublicListComponent } from './src/app/services/modal/modal-session-screen/modal-session-screen.component.ts';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { SuperAdminPublicStateService } from 'src/app/states/super-admin-public/super-admin-public-state.service';

@Component({
  standalone: true,
  imports: [SuperAdminPublicListComponent, CommonModule],
  selector: 'help-center-info-aside',
  templateUrl: './help-center-info-aside.component.html',
  styleUrls: ['./help-center-info-aside.component.scss']
})
export class HelpCenterInfoAsideComponent implements OnInit, OnDestroy {
  opened: boolean = false;
  showNews: boolean = false;
  sub: Subscription = new Subscription();
  constructor(private superAdminPublicStateService: SuperAdminPublicStateService,
    private companiesStateService: CompaniesStateService,) { }

  ngOnInit() {
    let onOpen = this.superAdminPublicStateService.onOpen.subscribe(data => {
      this.opened = true;
    })
    this.sub.add(onOpen);
  }
  closed() {
    this.opened = false;
    this.showNews = false;
  }
  gotiHelpCenter() {
    var url = `/#/${this.companiesStateService.getCurrentCompany().techDomain}/help-center`;
    window.open(url, '_blank');
  };
  showListNews() {
    this.showNews = true;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
