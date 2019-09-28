import { Component, OnInit } from "@angular/core";
import { SettingService } from "src/ng2/app/services/setting/setting.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-activity-history",
  templateUrl: "./activity-history.component.html",
  styleUrls: ["./activity-history.component.scss"]
})
export class ActivityHistoryComponent implements OnInit {
  activityHistory = [];
  selectedDevice = {};

  name: string = "";
  lat: number = 0;
  lng: number = 0;

  constructor(
    private settingService: SettingService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getActivityHistory();
  }

  getActivityHistory() {
    this.settingService.getActivityHistory().subscribe((res: any) => {
      if (res) {
        this.activityHistory = res;
        this.selectedDevice = res.find(device => {
          return device.current;
        });
      }
    });
  }

  selectDevice(device: any) {
    this.selectedDevice = device;
  }

  closeSession(device: any) {
    const idsForDelete = [];
    if (device) {
      idsForDelete.push(device.id);
      this.settingService.closeSessions(idsForDelete).subscribe(
        res => {
          this.toastr.success("Activity history removed successfully");
        },
        error => {
          this.toastr.error("Error occured", error);
        }
      );
    }
  }
}
