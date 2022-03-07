import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { AgentService } from 'src/app/services/agent/agent.service';
import { SettingStateService } from 'src/app/states/setting/setting-state.service';
import { CommissionService } from '../commission/commission.service';

@Component({
  selector: 'device-setting',
  templateUrl: './device-setting.component.html',
  styleUrls: ['./device-setting.component.scss']
})
export class DeviceSettingComponent implements OnInit {
  templeteInfo: any;
  devicebutton : boolean = false;
  manufacturebutton:boolean;
  modelbutton : boolean;
  hardwareTypes: any[] = [];
  assetList: any[] = [];
  companyId: any;

  constructor(private settingStateService: SettingStateService,
    private agentService: AgentService,
    private commissionService: CommissionService) { }

  ngOnInit() {
    this.devicebutton = true;
    $('body').addClass('ng7');
    $('body').removeClass('backMenu');
    this.settingStateService.setComponentName('DeviceSettingComponent');
    this.getCurrentCompany();

  }

  toggle(evt: any){
    if(evt.nextId == "tab1"){
      this.devicebutton = true;
    }
    else{
      this.devicebutton = false
    }

    if(evt.nextId == "tab2"){
      this.manufacturebutton = true;
    }
    else{
      this.manufacturebutton = false
    }

    if(evt.nextId == "tab3"){
      this.modelbutton = true;
    }
    else{
      this.modelbutton = false
    }
  }


  getCurrentCompany(): any {
    this.commissionService
      .getCurrentCompany()
      .pipe(map(res => res))
      .subscribe((res: any) => {
        this.companyId = res.id;

        this.agentService.getAssetsByCompanyId(this.companyId).subscribe((resp) => {
          this.assetList = resp;
          //this.HardwareTypeList(resp[0].TechCompanyGuid);
        });
      });
  }


  HardwareTypeList(TechCompanyGuid: any) {
    this.agentService
      .getHardwareTypeByTechCompanyGuid(TechCompanyGuid)
      .subscribe((resp) => {
        this.hardwareTypes = resp;
        this.assetList.forEach((element, index) => {
          var ht = this.hardwareTypes.find(
            (x) => x.ID == element.HardwareTypeID
          );
          if (ht) {
            element.iconName = ht.Name;
          }
        });
      });
  }
}
