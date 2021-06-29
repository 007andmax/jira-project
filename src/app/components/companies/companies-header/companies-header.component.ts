import { Component, OnInit, OnDestroy } from '@angular/core';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { DraftEmailStateService } from 'src/app/states/draft-email/draft-email-state.service';
import { CompanyCalculateCount } from '../class/company-calculate-count';
import { Subscription } from 'rxjs';
import { COMPANIES } from 'src/app/const/emails';

@Component({
  selector: 'app-companies-header',
  templateUrl: './companies-header.component.html',
  styleUrls: ['./companies-header.component.scss']
})
export class CompaniesHeaderComponent implements OnInit, OnDestroy {
  toggleFilter: boolean = true;
  countFilter: number = 0;
  calculateCount: CompanyCalculateCount = new CompanyCalculateCount();
  sub: Subscription = new Subscription();
  constructor(private companiesStateService: CompaniesStateService,
    private draftEmailStateService: DraftEmailStateService,
    private companiesState: CompaniesStateService) { }

  ngOnInit() {
    this.calculateCount = this.companiesState.getCalculateCount();
    let getOnCalculateCount = this.companiesState.getOnCalculateCount().subscribe((data) => {
      this.calculateCount = data;
    })
    this.sub.add(getOnCalculateCount);
  }
  public showAsideForDraftEmail() {
    this.draftEmailStateService.setAction(COMPANIES);
    this.draftEmailStateService.toggleAsideForAdd();
  }
  onChangeCountFilter(data) {
    this.countFilter = data;
  }
  public showAsideForAdd() {
    this.companiesStateService.toggleAsideForAdd();
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
