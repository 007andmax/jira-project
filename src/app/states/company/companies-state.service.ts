import { Injectable, EventEmitter } from '@angular/core';
import { CompaniesService } from '../../services/company/companies.service';
import { Company } from '../../interfaces/company/company';
import { CompanyProfile } from '../../components/companies/class/company-profile';
import { CompanyCalculateCount } from '../../components/companies/class/company-calculate-count';
import { CompaniesRealTimeService } from './companies-real-time.service';
import { CompanyUpdate } from '../../components/companies/class/company-update';
import { User } from '../../components/users/class/user';
import { WebsocketService } from '../../services/websocket/websocket.service';

@Injectable({
  providedIn: 'root'
})
export class CompaniesStateService {
  allCompanies = [];
  industries = [];
  selectedCompanyId: string = null;
  onFilterTags: EventEmitter<any> = new EventEmitter();
  onGetCompanies: EventEmitter<any> = new EventEmitter();
  onChangeCompanies: EventEmitter<CompanyUpdate> = new EventEmitter();
  showAsideForAdd: EventEmitter<any> = new EventEmitter();
  onShowArchived: EventEmitter<any> = new EventEmitter();
  onEditCompany: EventEmitter<CompanyProfile> = new EventEmitter();
  companyForArchive: Company = null;
  companyForDeArchive: Company = null;
  onCalculateCount: EventEmitter<CompanyCalculateCount> = new EventEmitter();
  calculateCount: CompanyCalculateCount = new CompanyCalculateCount();
  currentCompany: any = null;
  onCurrentCompany: EventEmitter<any> = new EventEmitter();
  showArchivedCompanies: boolean = false;
  isInitCurrentCompany: boolean = false;
  constructor(private companiesService: CompaniesService,
    private companiesRealTimeService: CompaniesRealTimeService,
    private websocketService: WebsocketService) {
  }
  public onInit() {
    this.onInitGetCurrentCompany();
    this.companiesService.getCompaniesList().subscribe((data: any) => {
      this.setAllCompanies(data);
      this.onInitGetCompanies(data);
    })
    this.companiesRealTimeService.changeCompanyArray.subscribe(newChange => {
      if (newChange.action === 'COMPANY_SAVED' || newChange.action === 'COMPANY_ARCHIVED') {
        const Index = this.allCompanies.findIndex((item) => item.id === newChange.data.id);
        if (Index > -1) this.allCompanies[Index] = newChange.data;
        if (Index === -1) this.allCompanies.unshift(newChange.data);
      }
      if (newChange.action === 'COMPANY_DEARCHIVED') {
        const Index = this.allCompanies.findIndex((item) => item.id === newChange.data.id);
        if (Index > -1) this.allCompanies[Index] = newChange.data;
      }
      this.onChangeCompanies.emit(new CompanyUpdate(newChange.action, newChange.data, this.allCompanies));
    })
    this.companiesService.getIndustries().subscribe((data: Array<string>) => {
      this.industries = data.sort((a, b) => (a.toLowerCase() > b.toLowerCase()) ?
        1 : ((b.toLowerCase() > a.toLowerCase()) ? -1 : 0));
    })
  }
  public onInitGetCurrentCompany() {
    this.companiesService.getTechCompany().subscribe(data => {
      this.currentCompany = data;
      this.onCurrentCompany.emit(data);
      if (!this.isInitCurrentCompany) {
        this.websocketService.subsribeToGlNumber(this.currentCompany.id);
        this.websocketService.subsribeToQuote(this.currentCompany.id);
        this.websocketService.subsribeToRecurringTickets(this.currentCompany.id);
      }
      this.isInitCurrentCompany = true;
    })
  }
  public getSelectedCompanyId() {
    return this.selectedCompanyId;
  }
  public setSelectedCompanyId(data) {
    this.selectedCompanyId = data;
  }
  public setShowArchivedCompanies(data) {
    this.showArchivedCompanies = data;
  }
  public getShowArchivedCompanies() {
    return this.showArchivedCompanies;
  }
  public getOnCurrentCompany() {
    return this.onCurrentCompany;
  }
  public getCurrentCompany() {
    return this.currentCompany;
  }
  public getIndustries() {
    return this.industries;
  }
  public getChangeCompanies() {
    return this.onChangeCompanies;
  }
  public getCalculateCount() {
    return this.calculateCount;
  }
  public getOnCalculateCount() {
    return this.onCalculateCount;
  }
  public setCalculateCount(data) {
    this.calculateCount = data;
    this.onCalculateCount.emit(data);
  }

  public getCompanyFromEdit() {
    return this.onEditCompany;
  }
  public setEditCompany(data) {

    this.onEditCompany.emit(data);
  }
  public setAllCompanies(data) {
    this.allCompanies = data;
  }
  public onInitGetCompanies(data) {
    this.onGetCompanies.emit(data);
  }

  public getOnCompanies() {
    return this.onGetCompanies;
  }
  public getCompanies() {
    return this.allCompanies;
  }
  public setCompnayForDeArchive(data) {
    this.companyForDeArchive = data;
  }
  public setCompnayForArchive(data) {
    this.companyForArchive = data;
  }
  public getCompanytForArchive() {
    return this.companyForArchive;
  }
  public getCompanyFortDeArchive() {
    return this.companyForDeArchive;
  }
  public getOnShowArchived() {
    return this.onShowArchived;
  }
  public setOnShowArchived(data) {
    this.onShowArchived.emit(data);
  }
  public toggleAsideForAdd() {
    this.showAsideForAdd.emit();
  }
  public getShowAsideForAdd() {
    return this.showAsideForAdd;
  }

}
