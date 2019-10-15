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
  selectedDevice = {};

  constructor(
    private settingService: SettingService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getActivityHistory();
  }

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

  closeSession(device: any) {
    const idsForDelete = [];
    if (device) {
      idsForDelete.push(device.id);
      this.settingService
        .closeSessions(idsForDelete)
        .pipe(
          map(res => {
            this.toastr.success("Activity history removed successfully");
          })
        )
        .subscribe();
    }
  }
}
