import { Component, OnInit } from '@angular/core';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { DraftEmailStateService } from 'src/ng2/app/states/draft-email/draft-email-state.service';
import { CompanyCalculateCount } from '../class/company-calculate-count';
 

@Component({
  selector: 'app-companies-header',
  templateUrl: './companies-header.component.html',
  styleUrls: ['./companies-header.component.scss']
})
export class CompaniesHeaderComponent implements OnInit {
  calculateCount: CompanyCalculateCount = new CompanyCalculateCount();
  constructor(   private companiesStateService: CompaniesStateService,private draftEmailStateService:DraftEmailStateService,
    private companiesState: CompaniesStateService) { }

  ngOnInit() {
    this.calculateCount = this.companiesState.getCalculateCount();
    this.companiesState.getOnCalculateCount().subscribe((data) => {
      this.calculateCount = data;
      console.log('data',data);
    
    })

  }
  public showAsideForDraftEmail() {
    this.draftEmailStateService.toggleAsideForAdd();
  }
  public showAsideForAdd() {
    this.companiesStateService.toggleAsideForAdd();
  }
}
