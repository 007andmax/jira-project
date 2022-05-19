import { Component, OnInit } from '@angular/core';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { SuperAdminPublicStateService } from 'src/app/states/super-admin-public/super-admin-public-state.service';

@Component({
  selector: 'help-center-info-aside',
  templateUrl: './help-center-info-aside.component.html',
  styleUrls: ['./help-center-info-aside.component.scss']
})
export class HelpCenterInfoAsideComponent implements OnInit {
  opened: boolean = false;
  constructor(private superAdminPublicStateService: SuperAdminPublicStateService,
    private companiesStateService: CompaniesStateService,) { }

  ngOnInit() {
    this.superAdminPublicStateService.onOpen.subscribe(data => {
      this.opened = true;
    })
  }
  closed() {
    this.opened = false;
  }
  gotiHelpCenter() {
    var url = `/#/${this.companiesStateService.getCurrentCompany().name.replaceAll(' ', '')}/help-center`;
    window.open(url, '_blank');
  };
}
