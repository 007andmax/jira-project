import { Component, OnDestroy, OnInit } from "@angular/core";
import { SettingService } from "src/app/services/setting/setting.service";
import { ToastrService } from "ngx-toastr";
import { map } from "rxjs/operators";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ConfirmStateService } from "src/app/components/shared/confirm/services/confirm-state.service";
import { CLOSE_SESSION } from "src/app/const/confirm";
import { ConfirmComponent } from "src/app/components/shared/confirm/confirm.component";
import { SettingStateService } from "src/app/states/setting/setting-state.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-activity-history",
  templateUrl: "./activity-history.component.html",
  styleUrls: ["./activity-history.component.scss"]
})
export class ActivityHistoryComponent implements OnInit, OnDestroy {
  name: string = "";
  activityHistory = [];
  selectedDevice = {
    longitude: 0,
    latitude: 0,
    city: '',
    country: ''
  };
  sub: Subscription = new Subscription();
  constructor(
    private settingService: SettingService,
    private modalService: NgbModal,
    private confirmStateService: ConfirmStateService,
    public settingStateService: SettingStateService,
  ) { }


  /**
   * init
   */
  ngOnInit() {
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === CLOSE_SESSION) {
          this.onCloseSession(this.settingStateService.getSessionForRemove());
        }

      }
    })
    this.sub.add(getConfirm);
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
  onCloseSession(device) {
    const idsForDelete = [];
    if (device) {
      idsForDelete.push(device.id);
      this.settingService
        .closeSessions(idsForDelete)
        .subscribe((data) => {
          this.confirmStateService.initRequest(false);
          this.activityHistory.splice(this.activityHistory.findIndex(item => item.id == device.id), 1);
        }, err => {
          this.confirmStateService.initRequest(false);
        });
    }
  }

  /**
   * close sessing based on device
   * @param device 
   */
  closeSession(device: any) {
    this.confirmStateService.setConfirmAction(CLOSE_SESSION);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = `Delete Location`;
    modalRef.componentInstance.message = `Are you sure you want to delete this location?`;
    this.settingStateService.setSessionForRemove(device);
  }

  trackByDeviceFun(index, device) {
    return index;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
