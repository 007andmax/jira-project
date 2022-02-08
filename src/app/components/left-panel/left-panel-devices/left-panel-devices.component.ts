import { CompaniesService } from 'src/app/services/company/companies.service';
import { AgentService } from 'src/app/services/agent/agent.service';
import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';


@Component({
  selector: 'app-left-panel-devices',
  templateUrl: './left-panel-devices.component.html',
  styleUrls: ['./left-panel-devices.component.scss']
})
export class LeftPanelDevicesComponent implements OnInit {
  type: string = 'Dashboard';
  open: boolean = false;
  open1: boolean = false;
  @Input() activePage: string = "";
  @Output() onChangeState = new EventEmitter();
  @Output() onOpenPanel = new EventEmitter();

  searches: any[];
  company: any;

  constructor(private leftPanelStateService: LeftPanelStateService,
    private agentService: AgentService,
    private companiesService: CompaniesService) { }

  ngOnInit() {
    this.open1=true;
    this.companiesService.getTechCompany().subscribe(data => {
      this.company = data;
      this.agentService
        .getAgentToken(
          "QuickTech",
          "s8Y1IuPCUUYlSLMbFijHvut5uOi/KnKNqOLtn57CBlw="
        )
        .subscribe((data) => {
          this.agentService.setAccessToken(data.AccessToken);
          this.agentService.getByTechCompany(this.company.id).subscribe((res) => {
            this.searches = res;
          });
        });

    });

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

}
