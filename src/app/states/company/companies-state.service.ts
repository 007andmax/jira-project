import { Injectable, EventEmitter } from '@angular/core';
import { CompaniesService } from '../../services/company/companies.service';
import { Company } from '../../interfaces/company/company';
import { CompanyProfile } from '../../components/companies/class/company-profile';
import { CompanyCalculateCount } from '../../components/companies/class/company-calculate-count';
import { CompaniesRealTimeService } from './companies-real-time.service';
import { CompanyUpdate } from '../../components/companies/class/company-update';
import { User } from '../../components/users/class/user';
import { WebsocketService } from '../../services/websocket/websocket.service';
import { CompanyIndustry } from 'src/app/interfaces/company/company-industry';
import { UsersStateService } from '../users/users-state.service';
import { WebsocketStateService } from '../websocket/websocket-state.service';
import { CompanyAssigned } from 'src/app/components/companies/class/company-assigned';
import { CustomerPortalStateService } from '../customer-portal/customer-portal-state.service';
import { DevicesStateService } from '../devices/devices-state.service';
import { CompanyDeviceCount } from 'src/app/components/companies/class/company-device-count';

@Injectable({
  providedIn: 'root'
})
export class CompaniesStateService {
  allCompanies = [];
  lightAllCompanies = [];
  lightClientsCompanies = [];
  devicesCounts: Array<CompanyDeviceCount> = [];
  isInitLightAllCompanies: boolean = false;
  isInitLightClientsCompanies: boolean = false;
  onLightCompanies: EventEmitter<any> = new EventEmitter();
  onLightClientsCompanies: EventEmitter<any> = new EventEmitter();
  onChangeSelectedCompanyId: EventEmitter<any> = new EventEmitter();
  onChangeDevicesCount: EventEmitter<any> = new EventEmitter();
  onGetCompanies: EventEmitter<any> = new EventEmitter();
  onChangeCompanies: EventEmitter<CompanyUpdate> = new EventEmitter();
  showAsideForAdd: EventEmitter<any> = new EventEmitter();
  onEditCompany: EventEmitter<CompanyProfile> = new EventEmitter();
  companyForArchive: Company = null;
  companyForDeArchive: Company = null;
  onCalculateCount: EventEmitter<CompanyCalculateCount> = new EventEmitter();
  calculateCount: CompanyCalculateCount = new CompanyCalculateCount();
  currentCompany: any = null;
  onCurrentCompany: EventEmitter<any> = new EventEmitter();
  filter: EventEmitter<any> = new EventEmitter();
  showArchivedCompanies: boolean = false;
  isInitSubscriptions: boolean = false;
  companyRoutingId: string;
  companyIdForassignedDocumentCategory: string;
  assignedDocumentCategories: Array<CompanyAssigned> = [];
  onGetAssignedDocumentCategories: EventEmitter<any> = new EventEmitter();
  companyProfile: any;
  constructor(private companiesService: CompaniesService,
    private companiesRealTimeService: CompaniesRealTimeService,
    private usersStateService: UsersStateService,
    private websocketStateService: WebsocketStateService,
    public customerPortalStateService: CustomerPortalStateService,
    private devicesStateService: DevicesStateService,
    private websocketService: WebsocketService) {
  }
  public onInit() {
    this.onInitGetCurrentCompany();
    this.companiesService.getCompaniesList().subscribe((data: any) => {
      this.setAllCompanies(data);
      this.onInitGetCompanies(data);
    })
    this.companiesRealTimeService.changeCompanyArray.subscribe(newChange => {
      if (newChange.data.id === this.currentCompany.id) return;
      if (newChange.action === 'COMPANY_SAVED' || newChange.action === 'COMPANY_ARCHIVED') {
        const Index = this.allCompanies.findIndex((item) => item.id === newChange.data.id);
        if (Index > -1) this.allCompanies[Index] = newChange.data;
        if (Index === -1) this.allCompanies.unshift(newChange.data);

        if (this.isInitLightAllCompanies) {
          const indexLigth = this.lightAllCompanies.findIndex((item) => item.id === newChange.data.id);
          if (indexLigth > -1) this.lightAllCompanies[indexLigth] = newChange.data;
          if (indexLigth === -1) this.lightAllCompanies.unshift(newChange.data);
        }

        if (newChange.data.clientType == "CLIENT" && this.isInitLightClientsCompanies) {
          const indexLigth = this.lightClientsCompanies.findIndex((item) => item.id === newChange.data.id);
          if (indexLigth > -1) this.lightClientsCompanies[indexLigth] = newChange.data;
          if (indexLigth === -1) this.lightClientsCompanies.unshift(newChange.data);
        }

      }
      if (newChange.action === 'COMPANY_DEARCHIVED') {
        const Index = this.allCompanies.findIndex((item) => item.id === newChange.data.id);
        if (Index > -1) this.allCompanies[Index] = newChange.data;

        if (this.isInitLightAllCompanies) {
          const indexLigth = this.lightAllCompanies.findIndex((item) => item.id === newChange.data.id);
          if (indexLigth > -1) this.lightAllCompanies[indexLigth] = newChange.data;
        }
      }
      this.onChangeCompanies.emit(new CompanyUpdate(newChange.action, newChange.data, this.allCompanies));
      this.onLightCompanies.emit(this.lightAllCompanies);
      this.onLightClientsCompanies.emit(this.lightClientsCompanies);
    })
    this.websocketStateService.onConnected.subscribe(data => {
      if (this.currentCompany && !this.isInitSubscriptions && this.websocketStateService.getIsConnected()) {
        this.initSubscriptions();
      }
    })
    this.devicesStateService.onChangeDeviceCount.subscribe(data => {
      let index = this.devicesCounts.findIndex(item => item.companyId === data.data.companyId);
      if (index > -1) {
        this.devicesCounts[index].setCount(data.data.count);
      } else {
        this.devicesCounts.push(new CompanyDeviceCount(data.data));
      }
      this.onChangeDevicesCount.emit(this.devicesCounts);
    })
  }
  public setCompanyProfile(data) {
    this.companyProfile = data;
  }
  public getCompanyProfile() {
    return this.companyProfile;
  }
  public getCompanyLogoUrl(company) {
    if (company && company.logo && company.logo && company.logo.base64 && !company.logo.cropped) return company.logo.base64;
    if (company && company.logo && company.logo.cropped && company.logo.cropped.id) return `/file/${company.logo.cropped.id}`;
    if (company && company.logo && company.logo.origin && company.logo.origin.id) return `/file/${company.logo.origin.id}`;
  }
  public getDevicesCounts() {
    return this.devicesCounts;
  }
  public setDevicesCounts(data) {
    this.devicesCounts = data;
  }
  public getCompanyIdForassignedDocumentCategory() {
    return this.companyIdForassignedDocumentCategory;
  }
  public getCategoriesDocuments(id) {
    this.companyIdForassignedDocumentCategory = id;
    this.companiesService.getCategoriesDocuments(id).subscribe((data: any) => {
      this.assignedDocumentCategories = data;
      this.onGetAssignedDocumentCategories.emit(this.assignedDocumentCategories);
    })
  }
  public onInitGetCurrentCompany() {
    this.companiesService.getTechCompany().subscribe(data => {
      this.currentCompany = data;
      this.onCurrentCompany.emit(data);
      if (this.currentCompany && !this.isInitSubscriptions && this.websocketStateService.getIsConnected()) {
        this.initSubscriptions();
      }

    })
  }
  public onInitGetLightCompanies() {
    this.companiesService.getLightCompanies().subscribe((data: any) => {
      this.lightAllCompanies = data;
      this.onLightCompanies.emit(this.lightAllCompanies);
      this.isInitLightAllCompanies = true;
    })
  }
  public getLightCompanies() {
    return this.lightAllCompanies;
  }
  public onInitGetLightClietnsCompanies() {
    this.companiesService.getLightClientsCompanies().subscribe((data: any) => {
      this.lightClientsCompanies = data;
      this.onLightClientsCompanies.emit(this.lightClientsCompanies);
      this.isInitLightClientsCompanies = true;
    })
  }
  public getLightClientsCompanies() {
    return this.lightClientsCompanies;
  }
  public getAssignedDocumentCategories() {
    return this.assignedDocumentCategories;
  }
  public getCompanyRoutingId() {
    return this.companyRoutingId;
  }
  public setCompanyRoutingId(data) {
    this.onChangeSelectedCompanyId.emit(data);
    this.companyRoutingId = data;
  }
  private initSubscriptions() {
    if (!this.customerPortalStateService.isCustomerPortal) this.websocketService.subsribeToGlNumber(this.currentCompany.id);
    this.websocketService.subsribeToQuote(this.currentCompany.id);
    this.websocketService.subsribeToRecurringTickets(this.currentCompany.id);
    this.websocketService.subsribeToUserSubscriptions(this.currentCompany.id);
    this.isInitSubscriptions = true;
  }
  public onInitFilter(data) {
    this.filter.emit(data);
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
  public toggleAsideForAdd() {
    this.showAsideForAdd.emit();
  }
  public getShowAsideForAdd() {
    return this.showAsideForAdd;
  }

}
