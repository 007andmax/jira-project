import { AgentService } from 'src/app/services/agent/agent.service';
import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';


@Component({
  selector: 'app-left-panel-devices',
  templateUrl: './left-panel-devices.component.html',
  styleUrls: ['./left-panel-devices.component.scss']
})
export class LeftPanelDevicesComponent implements OnInit {
  type: string = 'Dashboard';
  open: boolean = false;  
  @Input() activePage: string = "";
  @Output() onChangeState = new EventEmitter();
  @Output() onOpenPanel = new EventEmitter();

  searches: any[];
  company: any;
  toggleTypeCompanies: boolean = false;
  toggleTypePinnedSearch: boolean = false;
  toggleTypeReport:boolean = false;
  companyReportList: any;
  companyList:any;
  currentActivePage: string = "new-devices";
  currentActiveReportPageChild: string = "";
  currentActivePinnedPageChild: string = "";
  currentActiveCompanyPageChild: string = "";


  constructor(private leftPanelStateService: LeftPanelStateService,    
    private agentService: AgentService,
    private companiesStateService: CompaniesStateService,
    private companiesState: CompaniesStateService,
    ) { }

  ngOnInit() {      
    this.companiesState.onInit();
    if (this.companiesStateService.getCurrentCompany()) this.getCurrentCompany(this.companiesStateService.getCurrentCompany());
    this.companiesStateService.onCurrentCompany.subscribe(data => {
      this.getCurrentCompany(data);
    })
    this.leftPanelStateService.onToggleLeftPanel.subscribe(data => {
      if (data) {
        this.open = false;
      }
    })
    this.leftPanelStateService.onChangeState.subscribe(state => {
      if (!this.isSupportPage(state)) {
        this.open = false;
      }
    })
    this.leftPanelStateService.onFirstOpen.subscribe(data => {
      if (this.isSupportPage(data)) {
        this.open = true;
      }
    })
    this.leftPanelStateService.onSearchItemAdded.subscribe(data => {      
      this.getCurrentCompany(this.company);
    });

    this.companiesState.getOnCompanies().subscribe(data => {
      this.companyReportList= this.getCompaniesNames(data);
      this.companyList = this.companyReportList.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : b.name.toLowerCase() > a.name.toLowerCase() ? -1 : 0);
    })

    this.leftPanelStateService.onPageActive.subscribe(data=>{
      this.currentActiveReportPageChild = data;
    })
  }
  getCurrentCompany(data) {        
    this.company = data;
    this.agentService.getByTechCompany(this.company.id).subscribe((res) => {                 
      this.searches = res;
    });
  }
  isSupportPage(state) {
    return (state === 'new-devices' ||
      state === 'new-device-summary');
  }

  openPanel() {
    this.onOpenPanel.emit(null);
  }

  openSubPanel() {

  }

  public goToState(state) {
    this.onChangeState.emit(state);
  }

  onFilter(active) {
    this.type = active;
    this.goToState('new-devices');
  }

  public close() {
    this.open = false;
  }

  onFilter1(active, data) {       
    localStorage.setItem("currentSearch", JSON.stringify(data));
    this.type = active;
    this.goToState('new-devices');
    this.leftPanelStateService.onSearchChanged(data);
    this.currentActivePinnedPageChild = data.ID;    
  }

  onFilterCompany(active, data)
  {                  
    localStorage.setItem("currentSearchCompany", JSON.stringify(data));
    this.type = active;
    this.goToState('new-devices');
    this.leftPanelStateService.onSearchCompany(data);
    this.currentActiveCompanyPageChild = data.name;
  }

  onSearchReport(state,page){ 
    localStorage.setItem('report', state); 
    this.leftPanelStateService.goToState(state); 
    this.currentActiveReportPageChild = page;                 
  }
  
  private getCompaniesNames(list) {

    const filteredArray = [];
    list.map((item) => {
      filteredArray.push({
        companyId: item.id,
        name: item.name
      })
    });
    return filteredArray;
  }
  goToAll(){
    this.goToState('new-devices');
    this.type = 'Dashboard'
    this.currentActivePage = 'new-devices';
    this.currentActiveCompanyPageChild = '';
    this.currentActivePinnedPageChild = '';
    this.currentActiveReportPageChild = '';
    this.toggleTypePinnedSearch = false;
    this.toggleTypeCompanies = false;
    this.toggleTypeReport = false;      
  }  

  pagesActive(page)
  {        
    this.currentActivePage = page;
    if(page == 'new-devices')
    { 
      this.currentActiveCompanyPageChild = '';
      this.currentActivePinnedPageChild = '';
      this.currentActiveReportPageChild = '';      
      this.toggleTypePinnedSearch = false;
      this.toggleTypeCompanies = false;
      this.toggleTypeReport = false;      
    }
    if(page == 'devicesReports')
    {    
      this.currentActiveCompanyPageChild = '';  
      this.currentActivePinnedPageChild = '';
      this.toggleTypeCompanies = false;
      this.toggleTypePinnedSearch = false;
    }
    if(page == 'devicesCompanies')
    {
      this.currentActivePinnedPageChild = '';
      this.currentActiveReportPageChild = '';
      this.toggleTypePinnedSearch = false;
      this.toggleTypeReport = false;      
    }
    if(page == 'pinnedSearches')
    {
      this.currentActiveCompanyPageChild = '';
      this.currentActiveReportPageChild = '';
      this.toggleTypeCompanies = false;
      this.toggleTypeReport = false;       
    }    
  }

  deletePinnedSearch(data){    
    const pinnedSearch: any = {
      ID: data.ID,
      TechCompanyGuid: data.TechCompanyGuid,
      IsActive: true,
      Password: "s8Y1IuPCUUYlSLMbFijHvuYhDDrEWfYjLyyYWDFvgW",
    };    
    this.agentService.deleteAssetSearch(pinnedSearch).subscribe((res) => { 
      this.getCurrentCompany(this.company);             
    });
  }
}
