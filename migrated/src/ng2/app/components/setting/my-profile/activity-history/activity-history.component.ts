import { Component, OnInit } from "@angular/core";
import { SettingService } from "src/ng2/app/services/setting/setting.service";
import { ToastrService } from "ngx-toastr";
import { map } from "rxjs/operators";

@Component({
  selector: "app-activity-history",
  templateUrl: "./activity-history.component.html",
  styleUrls: ["./activity-history.component.scss"]
})
export class ActivityHistoryComponent implements OnInit {
  name: string = "";
  activityHistory = [];
  selectedDevice = {
    longitude: 0,
    latitude: 0,
    city: '',
    country: ''
  };

  constructor(
    private settingService: SettingService,
    private toastr: ToastrService
  ) {}

  /**
   * init
   */
  ngOnInit() {
    this.getActivityHistory();
  }

  /**
   * get activity history
   */
  getActivityHistory() {
    this.settingService
      .getActivityHistory()
      .pipe(
        map((res: any) => {
          if (res) {
            this.activityHistory = res;
            this.selectedDevice = res.find(device => {
              return device.current;
            });
          }
        })
      )
      .subscribe();
  }

  selectDevice(device: any) {
    this.selectedDevice = device;
  }

  /**
   * close sessing based on device
   * @param device 
   */
  closeSession(device: any) {
    const idsForDelete = [];
    if (device) {
      idsForDelete.push(device.id);
      this.settingService
        .closeSessions(idsForDelete)
        .pipe(
          map(res => {
            this.toastr.success("Activity History Removed Successfully");
          })
        )
        .subscribe();
    }
  }

  trackByDeviceFun(index, device){
    return index; 
  }
}
