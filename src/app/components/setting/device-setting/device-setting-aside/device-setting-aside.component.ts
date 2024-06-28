import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AgentService } from 'src/app/services/agent/agent.service';
import { DeviceSettingStateService } from 'src/app/states/device-setting/device-setting-state.service';

@Component({
  selector: 'device-setting-aside',
  templateUrl: './device-setting-aside.component.html',
  styleUrls: ['./device-setting-aside.component.scss']
})
export class DeviceSettingAsideComponent implements OnInit, OnDestroy {
  name: string;
  opened: boolean = false;
  list = [];
  sub: Subscription = new Subscription();
  constructor(private agentService: AgentService,
    private deviceSettingStateService: DeviceSettingStateService) { }


  ngOnInit() {
    let openAside = this.deviceSettingStateService.onOpenAside.subscribe(data => {

      this.name = data.name;
      if (data.type === "HARDWARE") {
        this.agentService.getHardwareTypeAssetByTechCompanyGuidAndHardwareType(data.techCompanyGuid, data.id)
          .subscribe((resp) => {
            // this.loading = false; $(".loading").css("display", "none");
            this.list = resp;
            this.opened = true;
          });
      }
      if (data.type === "MANUFACTURE") {
        this.agentService.getManufacturerAssetByTechCompanyGuidAndManufacturer(data.techCompanyGuid, data.id)
          .subscribe((resp) => {
            // this.loading = false; $(".loading").css("display", "none");
            this.list = resp;
            this.opened = true;
          });
      }
      if (data.type === "MODEL") {
        this.agentService.getModelAssetByTechCompanyGuidAndModel(data.techCompanyGuid, data.id)
          .subscribe((resp) => {
            // this.loading = false; $(".loading").css("display", "none");
            this.list = resp;
            this.opened = true;
          });
      }
    })
    this.sub.add(openAside);
  }
  public trackByIndex(index, item) {
    return index;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
