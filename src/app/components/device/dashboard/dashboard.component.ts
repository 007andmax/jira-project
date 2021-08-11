import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { UploadOutput,  UploadInput,  UploadFile,  humanizeBytes,  UploaderOptions } from "ngx-uploader";
import { ToastrService } from "ngx-toastr";
import { CONFIGCONSTANTS } from "../config/app-constants";
import { environment } from "../../../../environments/environment";
import { NgbDatepicker } from "@ng-bootstrap/ng-bootstrap";
import { NgbDateAdapter, NgbDateParserFormatter } from "@ng-bootstrap/ng-bootstrap";
import { AgentService } from "src/app/services/agent/agent.service";
import { Subscription } from "rxjs";
import { CustomAdapter } from "./CustomDateAdapter";
import { CustomDateParserFormatter } from "./CustomDateParserFormatter";
import { reduce } from "rxjs/operators";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild(NgbDatepicker) expire: NgbDatepicker;
  url = environment.apiUrl + "upload";
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  options: UploaderOptions;
  deviceDetail: any = {};
  asset: any = undefined;
  virusprotection: string = "";
  logicalDisk: any = [];
  virusInfo: any = [];
  hostName = "";
  label: string = "";
  visible = false;
  editNote = false;
  create = false;
  type = "";
  _id = "";
  DateFormat = CONFIGCONSTANTS.DateFormat1;
  DateTimeFormat = CONFIGCONSTANTS.DateTimeFormat1;
  sub: Subscription = new Subscription();

  constructor(
    private agentService: AgentService,
    private toastr: ToastrService
  ) {
    this.options = { concurrency: 1, maxUploads: 10, maxFileSize: 1000000 };
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
  }

  onUploadOutput(output: UploadOutput): void {
    if (output.type === "allAddedToQueue") {
      const event: UploadInput = {
        type: "uploadAll",
        url: this.url,
        method: "POST",
        data: { foo: "bar" },
      };
      this.uploadInput.emit(event);
    } else if (
      output.type === "addedToQueue" &&
      typeof output.file !== "undefined"
    ) {
      this.files.push(output.file);
    } else if (
      output.type === "uploading" &&
      typeof output.file !== "undefined"
    ) {
      const index = this.files.findIndex(
        (file) =>
          typeof output.file !== "undefined" && file.id === output.file.id
      );
      this.files[index] = output.file;
    } else if (output.type === "cancelled" || output.type === "removed") {
      this.files = this.files.filter(
        (file: UploadFile) => file !== output.file
      );
    } else if (output.type === "dragOver") {
      this.dragOver = true;
    } else if (output.type === "dragOut") {
      this.dragOver = false;
    } else if (output.type === "drop") {
      this.dragOver = false;
    } else if (
      output.type === "rejected" &&
      typeof output.file !== "undefined"
    ) {
    }
    // this.files = this.files.filter(file => file.progress.status !== UploadStatus.Done);
  }
  startUpload(): void {
    const event: UploadInput = {
      type: "uploadAll",
      url: this.url,
      method: "POST",
      data: { foo: "bar" },
    };
    this.uploadInput.emit(event);
  }
  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: "cancel", id: id });
  }
  removeFile(id: string): void {
    this.uploadInput.emit({ type: "remove", id: id });
  }
  removeAllFiles(): void {
    this.uploadInput.emit({ type: "removeAll" });
  }
  ngOnInit() {
    this.type =
      window.location.href.split("/")[
        window.location.href.split("/").length - 2
      ];
    this._id =
      window.location.href.split("/")[
        window.location.href.split("/").length - 1
      ];

    this.setPreviewDataDevice();
  }

  setPreviewDataDevice() {
    this.deviceDetail = JSON.parse(
      localStorage.getItem("deviceDetail_" + this._id)
    );
    this.hostName = this.deviceDetail.hostName;
    this.agentService
      .getAgentToken(
        "QuickTech",
        "s8Y1IuPCUUYlSLMbFijHvut5uOi/KnKNqOLtn57CBlw="
      )
      .subscribe((data) => {
        this.agentService.setAccessToken(data.AccessToken);
        this.getAssetDetail();
        this.getDiskDriveDetail();
        this.agentService
          .getAssetsByCompanyId("fdadb2df-ed3d-4e28-b41e-741617b7ffa6")
          .subscribe((res) => {});
      });
  }

  getAssetDetail() {
    this.agentService
      .getAssetByGuid("48e23c98-cbe4-4a8e-82bd-8c36fe5c9502")
      .subscribe((resp) => {
        if (resp.length > 0) {
          if (resp[0].Title != "") {
            this.label =
              resp[0].Domain != ""
                ? resp[0].Title + " " + "(" + resp[0].Domain + ")"
                : resp[0].Title + " " + "(" + "In workgroup" + ")";
          }
          this.asset = resp[0];
          this.asset.IsUpdated = true;
          this.getOprationSystemDetail();
          this.getVirusProtection(resp[0].VirusProtectionProducts);
        }
      });
  }

  getVirusProtection(inputVirusproctection: string) {
    this.virusprotection = "";
    if (inputVirusproctection.length > 0) {
      let finalVirus = inputVirusproctection.split(",");

      for (let i = 0; i < finalVirus.length; i++) {
        let virus = finalVirus[i].split("|");
        if (virus.length == 3) {
          if (virus[2].toLowerCase() == "enabled") {
            this.virusprotection = virus[1];
            break;
          }
        }
      }

      if (this.virusprotection == "" && finalVirus.length > 0) {
        let dVirus = finalVirus[0].split("|");
        if (dVirus.length == 3) {
          this.virusprotection = dVirus[1];
        }
      }
    }
  }

  getOprationSystemDetail() {
    this.agentService.getOperatingSystemByAssetId("1").subscribe((resp) => {
      this.asset.SerialNumber = resp[0].SerialNumber;
      this.asset.Caption =
        resp[0].Caption.replace("Microsoft", "") +
        " " +
        resp[0].OSArchitecture +
        " " +
        resp[0].Version;
    });
  }

  getDiskDriveDetail() {
    this.agentService.getDiskDriveByAssetId("1").subscribe((resp) => {
      this.logicalDisk = resp.filter((x) => x.IsActive);
      let colors = ["#0057a8", "#00d8e7", "#16a4fa", "#0CB2B2", "#485EF0"];
      let count = 0;
      this.logicalDisk.forEach((element) => {
        if (element.IsSystem === true) {
          element.color = "#2ec866";
        } else {
          element.color = colors[count];
          count++;
        }

        if (count == 5) {
          count = 0;
        }

        if (element.FreeSpace != "" && element.Size != "") {
          let size = this.convertToGB(element.Size);
          let free = this.convertToGB(element.FreeSpace);
          let osize = parseInt(size) - parseInt(free);
          element.percent = Math.round((osize / parseInt(size)) * 100);
        } else {
          element.percent = 0;
        }
      });

      this.logicalDisk.sort((a, b) => {
        if (a["Caption"] && b["Caption"]) {
          return a["Caption"].toLowerCase() > b["Caption"].toLowerCase()
            ? 1
            : b["Caption"].toLowerCase() > a["Caption"].toLowerCase()
            ? -1
            : 0;
        } else if (a["Caption"]) {
          return 1;
        } else if (b["Caption"]) {
          return -1;
        }
        return 0;
      });
    });
  }

  onDateChange(newDate: Date) {}

  updateAsset() {
    this.agentService.overrideAsset(this.asset).subscribe(
      (resp) => {
        this.toastr.success("Asset info save successfully.");
      },
      (error) => {
        this.toastr.error("Something went wrong please try again.");
      }
    );
  }

  convertToGB(value) {
    return (parseInt(value) / 1024 / 1024 / 1024).toFixed(0);
  }

  diskSpaceDiff(v1, v2) {
    let val1 = (parseInt(v1) / 1024 / 1024 / 1024).toFixed(2);
    let val2 = (parseInt(v2) / 1024 / 1024 / 1024).toFixed(2);
    return (parseFloat(val1) - parseFloat(val2)).toFixed(0);
  }

  tooltip(value?: string) {
    if (value !== undefined && value !== null && value !== "") {
      return value.length > 18 ? value : null;
    } else {
      return value;
    }
  }

  displayValue(value?: string) {
    if (value !== undefined && value !== null && value !== "") {
      return value.length > 18 ? value.substring(0, 18) + "... " : value;
    } else {
      return value;
    }
  }

  driveBorderColor(percent: number, IsSystem: boolean) {
    return { "border-color": percent > 80 && IsSystem == true ? "red" : "" };
  }

  driveClass(IsSystem: boolean, caption?: string) {
    return {
      "e-drive": IsSystem == false,
      "c-drive": IsSystem == true,
      "d-drive": IsSystem == false && caption == "D:",
      "f-drive": IsSystem == false && caption == "F:",
    };
  }

  first50BarStyle(percent: number, IsSystem: boolean, color: string) {
    return {
      "border-color":
        percent > 80
          ? "red"
          : percent > 75 && percent < 80
          ? "yellow"
          : IsSystem == true
          ? color
          : "",
      "background-color":
        percent > 80
          ? "red"
          : percent > 75 && percent < 80
          ? "yellow"
          : IsSystem == true
          ? color
          : "",
    };
  }

  valueBarStyle(percent: number, IsSystem: boolean, color: string) {
    return {
      "border-color":
        percent > 80
          ? "red"
          : percent > 75 && percent < 80
          ? "yellow"
          : IsSystem == true
          ? color
          : "",
    };
  }

  serviceClass(update: boolean, alert: boolean) {
    return { updated: update == true, alert: alert == true };
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
