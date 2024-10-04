import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Company } from 'src/app/interfaces/company/company';
import { LeftPanelService } from 'src/app/services/left-panel/left-panel.service';
import { AppService } from 'src/app/states/app/app.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';

@Component({
  selector: 'app-left-panel-file-manager',
  templateUrl: './left-panel-file-manager.component.html',
  styleUrls: ['./left-panel-file-manager.component.scss']
})
export class LeftPanelFileManagerComponent implements OnInit {
  open: boolean = false;
  sub: Subscription = new Subscription();
  @Input() activePage: string = "";
  @Output() onGoToLink = new EventEmitter();
  @Output() onChangeState = new EventEmitter();
  @Output() onOpenPanel = new EventEmitter();
  constructor(private companiesState: CompaniesStateService,
    public appService: AppService,
    private leftPanelService: LeftPanelService,
    private leftPanelStateService: LeftPanelStateService) { }


  ngOnInit() {
    let onToggleLeftPanel = this.leftPanelStateService.onToggleLeftPanel.subscribe(data => {
      if (data) this.open = false;
    })
    this.sub.add(onToggleLeftPanel);
    let onChangeState = this.leftPanelStateService.onChangeState.subscribe(state => {
      if (!this.leftPanelService.isFilePage(state)) this.open = false
    })
    this.sub.add(onChangeState);
    let onFirstOpen = this.leftPanelStateService.onFirstOpen.subscribe(data => {
      if (this.leftPanelService.isFilePage(data)) this.open = true;
    })
    this.sub.add(onFirstOpen);
  }


  public close() {
    this.open = false;
  }
  public togglePanel(data) {
    this.open = data;
  }
  public openPanel() {
    this.onOpenPanel.emit(null);
  }

  public goToState(data) {
    this.onChangeState.emit(data);
  }

  public trackByIndex(index, item) {
    return index;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
