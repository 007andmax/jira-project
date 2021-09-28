import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { CommonHttpServices } from "./_services/common_http.service";
import { RemoteControlService } from "./_services/remoteControl.service";
import { CommonServices } from "./_services/common.service";
import { ToastrService } from "ngx-toastr";
import { HardwareService } from "./_services/hardware.service";
import { DeviceDetailService } from "./_services/device_detail.service";
import { first } from "rxjs/operators";
import { v4 as uuidv4 } from "uuid";
import { ShellStateService } from "src/app/states/shell/shell-state.service";
import { UsersStateService } from "src/app/states/users/users-state.service";
import { TerminalService } from "./_services/terminal.service";
import { AgentService } from "src/app/services/agent/agent.service";
import { KafkaRealTimeService } from "src/app/states/kafka/kafka-real-time.service";
import { KafkaStateService } from "src/app/states/kafka/kafka-state.service";
declare var $: any;
@Component({
  selector: "app-device-root",
  templateUrl: "./device.component.html",
  styleUrls: ["./device.component.scss"],
})
export class DeviceComponent implements OnInit, OnDestroy {
  title = "quck-device";
  totalSeconds: any = 0;
  totalMinutes: any = 0;
  totalHours: any = 0;
  loading: boolean = false;
  deviceDetail: any = {};
  restServerAddress = "";
  remoteConnectPort = 0;
  deviceType = "";
  deviceImg = "/html/assets/img/device/device.svg";
  closeResult = "";
  play_pause_path = "/html/assets/img/device/pause.svg";
  playTimer = true;
  _id: string = "";
  type: string = "";
  interval;
  deviceName;
  kafkaMessage: any = "";
  UpTime: any = "";
  asset: any = undefined;
  constructor(
    private modalService: NgbModal,
    private commonHttpServices: CommonHttpServices,
    private commonServices: CommonServices,
    private toastr: ToastrService,
    private hardwareService: HardwareService,
    private deviceDetailService: DeviceDetailService,
    private remoteControlService: RemoteControlService,
    private usersStateService: UsersStateService,
    private shellStateService: ShellStateService,
    private agentService: AgentService,
    public kakfaService: KafkaRealTimeService,
    private kafkaStateService: KafkaStateService
  ) {}

  openModal(template) {
    if (this.deviceDetail.online === true) {
      this.modalService
        .open(template, { ariaLabelledBy: "modal-basic-title", centered: true })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismiss(reason)}`;
          }
        );
    } else {
      this.toastr.error("The device is offline!");
    }
  }
  private getDismiss(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
  lock() {
    // this.modalRef = this.modalService.show(
    //   LockScreenComponent,
    //   Object.assign({}, { class: 'remote-control modal-dialog-centered lock', backdrop: true })
    // );
  }

  ngOnInit(): void {
    this.type =
      window.location.href.split("/")[
        window.location.href.split("/").length - 2
      ];
    this._id =
      window.location.href.split("/")[
        window.location.href.split("/").length - 1
      ];
    this.usersStateService.onInit();
    this.shellStateService.onInit();
    localStorage.setItem("uuid_" + this._id, uuidv4());
    this.deviceType = this.type;
    if (this.deviceType === "printer") {
      this.deviceImg = "/html/assets/img/device/Device_printer.svg";
    }
    this.setPreviewDataDevice();

    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    $("body").addClass("ng7-device");
    this.getCurrentCompany();
    this.interval = setInterval(() => {
      this.updateTime();
    }, 1000);
  }

  setPreviewDataDevice() {
    this.agentService
      .getAgentToken(
        "QuickTech",
        "s8Y1IuPCUUYlSLMbFijHvut5uOi/KnKNqOLtn57CBlw="
      )
      .subscribe((data) => {
        console.log("data", data);
        this.agentService.setAccessToken(data.AccessToken);
        this.agentService
          .getAssetByGuid("7e22e026-9da5-41b9-9bbd-252585302310")
          .subscribe((resp) => {
            this.deviceName = resp[0].Name;
            this.asset = resp[0];
            this.getCurrentConfig(this.asset.ID);
          });
      });
  }

  getCurrentConfig(asset_ID) {
    this.kafkaStateService.onCurrentConfig.subscribe((resp) => {
      if (asset_ID != undefined && asset_ID != 0) {
        let item = resp.find((x) => x.key == asset_ID);
        if (item != undefined) {
          this.kafkaMessage = JSON.parse(item.value);
          let Time = this.kafkaMessage.IdleTime.split("Idle for");
          this.UpTime = Time[1] != "" ? Time[1] : "";
        }
      }
    });
  }
  getCurrentCompany() {
    this.commonHttpServices
      .getCurrentCompany()
      .pipe(first())
      .subscribe(
        (resp) => {
          this.getDevicesByCompany();
        },
        (error) => {
          this.toastr.error("Something went wrong please try again.");
        }
      );
  }
  getDeviceDetail() {
    this.hardwareService
      .getAllHardwareList(
        localStorage.getItem("company_id"),
        this.deviceDetail.agentId
      )
      .pipe(first())
      .subscribe(
        (resp) => {
          this.deviceDetailService.addDevice(resp);
        },
        (error) => {
          this.toastr.error("Something went wrong please try again.");
        }
      );
  }
  updateTime() {
    this.totalSeconds++;
    if (parseInt(this.totalSeconds) === 60) {
      this.totalSeconds = 0;
      this.totalMinutes++;
    }
    if (this.totalMinutes === 60) {
      this.totalMinutes = 0;
      this.totalHours++;
    }
    $("#counter").text(
      this.padNumber(this.totalHours) +
        " hr : " +
        this.padNumber(this.totalMinutes) +
        " min : " +
        this.padNumber(this.totalSeconds) +
        " sec"
    );
  }
  getDevicesByCompany() {
    // localStorage.getItem('currentCompany')
    this.commonHttpServices
      .getDevicesByCompany(localStorage.getItem("company_id"), this._id)
      .pipe()
      .subscribe(
        (resp) => {
          const tempObj = this.commonServices.cleanObject(resp);
          let deviceList = [];
          for (let key of Object.keys(tempObj)) {
            for (let key1 of Object.keys(tempObj[key])) {
              deviceList.push(tempObj[key][key1]);
              deviceList[deviceList.length - 1].company_id = key;
            }
          }
          this.deviceDetailService.addDeviceList(deviceList);
          let index = deviceList.findIndex(
            (value) => value.agentId === this._id
          );
          this.deviceDetail = deviceList[index];
          localStorage.setItem(
            "deviceDetail_" + this._id,
            JSON.stringify(deviceList[index])
          );
          localStorage.setItem("company_id", deviceList[index].company_id);
          this.deviceDetailService.setDevice(JSON.stringify(deviceList[index]));
          // this.getDeviceDetail();
        },
        (error) => {
          this.toastr.error("Something went wrong please try again.");
        }
      );
  }
  getViewer() {
    this.loading = true;
    this.remoteControlService
      .getViewer()
      .pipe()
      .subscribe(
        (resp) => {
          this.loading = false;
        },
        (error) => {}
      );
  }
  getConstant(sessionId) {
    this.remoteControlService
      .getConstant()
      .pipe()
      .subscribe(
        (resp) => {
          this.restServerAddress = resp["rest.server.url"];
          this.remoteConnectPort = resp["remote.connect.port"];
          let url =
            "quicktech://connect?serverIP=" +
            this.restServerAddress +
            "&port=" +
            this.remoteConnectPort +
            "&sessionID=" +
            sessionId;
          window.open(url, "_self");
        },
        (error) => {}
      );
  }
  createConnection(type) {
    this.loading = true;
    let data = {
      deviceId: this.deviceDetail.id,
      type: type,
      companyId: localStorage.getItem("company_id"),
    };
    this.remoteControlService
      .createConnection(data)
      .pipe()
      .subscribe(
        (resp) => {
          this.loading = false;
          if (type === "CSS") {
            // this.modalRef.hide();
            // this.getViewer();
            this.getConstant(resp.sessionId);
          } else {
            this.getConstant(resp.sessionId);
          }
        },
        (error) => {
          this.toastr.error("Something went wrong please try again.");
        }
      );
  }
  padNumber(value) {
    if (value == 0) {
      return "00";
    } else if (value < 10) {
      return "0" + value;
    }
    return value;
  }

  timerControl() {
    this.playTimer = !this.playTimer;
    if (this.interval && !this.playTimer) {
      clearInterval(this.interval);
      this.play_pause_path = "/html/assets/img/device/play.svg";
    } else {
      this.play_pause_path = "/html/assets/img/device/pause.svg";
      this.interval = setInterval(() => {
        this.updateTime();
      }, 1000);
    }
  }

  restartTimerControl() {
    clearInterval(this.interval);
    this.totalSeconds = 0;
    this.totalMinutes = 0;
    this.totalHours = 0;
    this.interval = setInterval(() => {
      this.updateTime();
    }, 1000);
  }

  sendCommand(command) {
    let data: any = {};
    if (command === "r") {
      data.AssetID = 13;
      data.MessageType = "RunPowerShellCommand";
      data.Value = "Restart-Computer -force";
      this.agentService.SendPowerShellCommand(data).subscribe((resp) => {});
    }
    if (command === "s") {
      data.AssetID = 13;
      data.MessageType = "RunPowerShellCommand";
      data.value = "Stop-Computer";
      this.agentService.SendPowerShellCommand(data).subscribe((resp) => {});
    }
  }
  ngOnDestroy(): void {
    this.deviceDetailService.setDevice(null);
  }
}
