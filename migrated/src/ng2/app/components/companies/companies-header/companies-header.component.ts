import { Component, OnInit } from '@angular/core';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { DraftEmailStateService } from 'src/ng2/app/states/draft-email/draft-email-state.service';
 

@Component({
  selector: 'app-companies-header',
  templateUrl: './companies-header.component.html',
  styleUrls: ['./companies-header.component.scss']
})
export class CompaniesHeaderComponent implements OnInit {

  constructor(   private companiesStateService: CompaniesStateService,private draftEmailStateService:DraftEmailStateService) { }

  ngOnInit() {
  }
  public showAsideForDraftEmail() {
    this.draftEmailStateService.toggleAsideForAdd();
  }
  public showAsideForAdd() {
    this.companiesStateService.toggleAsideForAdd();
  }
}
