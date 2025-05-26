import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';
import { CompanyProfile } from '../class/company-profile';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { CompanyValdiate } from '../class/company-validate';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/states/app/app.service';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';

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
  @ViewChild('addBtn', { static: false }) addBtn: DisabledBtnDirective;
  constructor(private companiesStateService: CompaniesStateService,
    private companiesService: CompaniesService,
    public appService: AppService,
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
    this.addBtn.setDisabled(true);
    let createCompany = this.companiesService.createCompany(this.company.getDataForAdd()).subscribe(data => {
      this.addBtn.setDisabled(false);
      this.close();
    }, err => {
      this.addBtn.setDisabled(false);
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
    this.cd.detectChanges();
  }
  public onAddFull() {
    if (!this.validate.isValidate(this.company)) return;
    this.addBtn.setDisabled(true);
    let createCompany = this.companiesService.createCompany(this.company.getDataForAdd()).subscribe(data => {
      this.addBtn.setDisabled(false);
      this.close();
    }, err => {
      this.addBtn.setDisabled(false);
    })
    this.sub.add(createCompany);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
