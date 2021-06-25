import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CompanyProfile } from '../class/company-profile';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { CompanyValdiate } from '../class/company-validate';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-company-add-aside',
  templateUrl: './company-add-aside.component.html',
  styleUrls: ['./company-add-aside.component.scss']
})
export class CompanyAddAsideComponent implements OnInit, OnDestroy {
  opened = false;
  version: string = 'short';
  validate: CompanyValdiate = new CompanyValdiate();
  company: CompanyProfile = new CompanyProfile();
  sub: Subscription = new Subscription();
  constructor(private companiesStateService: CompaniesStateService,
    private companiesService: CompaniesService,
    public cd: ChangeDetectorRef,) { }

  ngOnInit() {
    this.onShowAside();
  }
  close() {
    this.opened = false;
    this.version = 'short';
    this.company = new CompanyProfile();
    this.validate = new CompanyValdiate();
    this.cd.detectChanges();
  }

  onAddShort() {
    if (!this.validate.isValidate(this.company)) return;
    let createCompany = this.companiesService.createCompany(this.company.getDataForAdd()).subscribe(data => {
      this.close();
    })
    this.sub.add(createCompany);
  }
  public onShowAside() {
    let getShowAsideForAdd = this.companiesStateService.getShowAsideForAdd().subscribe(() => {
      this.opened = true;
    })
    this.sub.add(getShowAsideForAdd);
  }
  public onInitFullVersion() {
    this.company.fullVersion();
    this.version = 'full';
  }
  public onAddFull() {
    if (!this.validate.isValidate(this.company)) return;
    let createCompany = this.companiesService.createCompany(this.company.getDataForAdd()).subscribe(data => {
      this.close();
    })
    this.sub.add(createCompany);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
