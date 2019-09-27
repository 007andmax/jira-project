import { Component, OnInit } from '@angular/core';
import { SettingService } from 'src/ng2/app/services/setting/setting.service';

@Component({
  selector: 'app-activity-history',
  templateUrl: './activity-history.component.html',
  styleUrls: ['./activity-history.component.scss']
})
export class ActivityHistoryComponent implements OnInit {
  activityHistory = [];
  selectedDevice = {};

  name: string = 'My first AGM project';
  lat: number = 51.678418;
  lng: number = 7.809007;

  constructor(private settingService: SettingService) { }

  ngOnInit() {
    this.getActivityHistory();
  }

  getActivityHistory() {
    this.settingService.getActivityHistory().subscribe((res: any) => {
      if (res) {
        this.activityHistory = res;
        console.log(res);
        this.selectedDevice = res.find(device => {
          return device.current;
        })
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
      this.settingService.closeSessions(idsForDelete).subscribe(res => {
        console.log(res);
      }, error => {
        console.log(error)
      });
    }
  }

}
