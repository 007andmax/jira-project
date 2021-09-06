import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { UploadInput, UploadFile, humanizeBytes, UploaderOptions } from "ngx-uploader";
import { ToastrService } from "ngx-toastr";
import { CONFIGCONSTANTS } from "../config/app-constants";
import { environment } from "../../../../environments/environment";
import { NgbDatepicker } from "@ng-bootstrap/ng-bootstrap";
import { NgbDateAdapter, NgbDateParserFormatter } from "@ng-bootstrap/ng-bootstrap";
import { AgentService } from "src/app/services/agent/agent.service";
import { Subscription } from "rxjs";
import { CustomAdapter } from "./CustomDateAdapter";
import { CustomDateParserFormatter } from "./CustomDateParserFormatter";
import * as _ from "lodash";
import { NotesAdd } from "./class/dashboard";
import { ActivatedRoute } from "@angular/router";
import * as moment from "moment";

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
  DateFormat = CONFIGCONSTANTS.DateFormat1;
  DateTimeFormat = CONFIGCONSTANTS.DateTimeFormat1;
  DateFormats = CONFIGCONSTANTS.DateFormat;
  url = environment.apiUrl + "upload";
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  options: UploaderOptions;
  deviceDetail: any = {};
  asset: any = undefined;
  operatingSystem: any = undefined;
  System: any = undefined;
  virusprotection: string = "";
  logicalDisk: any = [];
  virusInfo: any = [];
  assetTag: any = [];
  assetNotes;
  hostName = "";
  label: string = "";
  selectedTag = [];
  filteredTag = [];
  tagFilterValue = "";
  visible = false;
  editNote = false;
  create = false;
  type = "";
  _id = "";
  sub: Subscription = new Subscription();
  noteAdd: NotesAdd = new NotesAdd();
  noteEdit: NotesAdd = new NotesAdd();
  currentUser: string = "";
  caption: string = "";
  serialnumber: string = "";
  notesTitle: string ="";
  notesDescription: string="";

  constructor(
    private agentService: AgentService,
    private toastr: ToastrService,
    public activateRoute: ActivatedRoute
  ) {
    this.options = { concurrency: 1, maxUploads: 10, maxFileSize: 1000000 };
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
  }

  ngOnInit() {
    this.type = this.activateRoute.snapshot.params["type"];
    this._id = this.activateRoute.snapshot.params["id"];
    this.setPreviewDataDevice();
  }

  setPreviewDataDevice() {
    this.agentService.KafkaList().subscribe((resp=>{
      console.log(resp);
    }))
    this.currentUser = localStorage.getItem("currentUser");
    this.agentService
      .getAgentToken(
        "QuickTech",
        "s8Y1IuPCUUYlSLMbFijHvut5uOi/KnKNqOLtn57CBlw="
      )
      .subscribe((data) => {
        this.agentService.setAccessToken(data.AccessToken);
        this.getAssetDetail();
      });
  }

  AddTags(Tag) {
    const newTag: any = { AssetID: this.asset.ID, Name: Tag };
    this.agentService.addNewTag(newTag).subscribe(
      (res) => {
        this.tagFilterValue = "";
        this.getAssetTagDropDownDetail();
        this.toastr.success("Asset Tag save successfully.");
      },
      (error) => {
        this.toastr.error("Something went wrong please try again.");
      }
    );
  }

  editAssetNote() {
    this.noteEdit.AssetID = this.asset.ID;
    this.noteEdit.Title = this.notesTitle;
    this.noteEdit.Description = this.notesDescription;
    this.agentService.overrideAssetNotes(this.noteEdit).subscribe(
      (res) => {
        this.editCloseNotes();
        this.toastr.success("Asset Notes save successfully.");
      },
      (error) => {
        this.toastr.error("Something went wrong please try again.");
      }
    );
  }

  addAssetNote() {
    this.noteAdd.AssetID = this.asset.ID;
    this.agentService.addAssetNotes(this.noteAdd).subscribe(
      (res) => {
        this.closeNotes();
        this.getAssetNotesDetail();
        this.toastr.success("Asset Notes save successfully.");
      },
      (error) => {
        this.closeNotes();
        this.toastr.error("Something went wrong please try again.");
      }
    );
  }

  editNotes(id: any) {
    this.noteEdit = this.assetNotes.find((x) => x.ID == id);
    this.notesTitle = this.noteEdit.Title;
    this.notesDescription = this.noteEdit.Description ;
    this.editNote = !this.editNote;
  }

  openNotes() {
    this.noteAdd = new NotesAdd();
    this.create = !this.create;
  }

  closeNotes() {
    this.create = !this.create;
  }

  editCloseNotes() {
    this.editNote = !this.editNote;
  }

  onSearchTag(value: string) {
    let filter = value.toLowerCase();

    if (filter != "" && this.filteredTag.length > 0) {
      this.filteredTag = _.differenceBy(
        this.filteredTag.filter((x) => x.Name.toLowerCase().includes(filter)),
        this.selectedTag,
        "ID"
      );
    } else if (this.filteredTag.length > 0) {
      this.filteredTag = _.differenceBy(
        this.filteredTag,
        this.selectedTag,
        "ID"
      );
    } else {
      this.filteredTag = this.assetTag;
    }
  }

  onSelectTag(tag: any): void {
    const addTag: any = { ID: tag.ID, AssetID: this.asset.ID, Name: tag.Name };
    this.agentService.addAssetTag(addTag).subscribe(
      (resp) => {
        this.selectedTag.push(addTag);
        this.filteredTag = _.differenceBy(
          this.assetTag,
          this.selectedTag,
          "ID"
        );
        this.tagFilterValue = "";
        this.toastr.success("Asset tag save successfully.");
      },
      (error) => {
        this.toastr.error("Something went wrong please try again.");
      }
    );
  }

  onRemoveTag(index: number): void {
    const removetag: any = {
      ID: this.asset.ID,
      ID2: this.selectedTag[index].ID,
      Password: "s8Y1IuPCUUYlSLMbFijHvuYhDDrEWfYjLyyYWDFvgW",
    };

    this.agentService.removeAssetTag(removetag).subscribe(
      (resp) => {
        this.selectedTag.splice(index, 1);
        this.filteredTag = _.differenceBy(
          this.assetTag,
          this.selectedTag,
          "ID"
        );
        this.toastr.success("Asset tag delete successfully.");
      },
      (error) => {
        this.toastr.error("Something went wrong please try again.");
      }
    );
  }

  getAssetDetail() {
    this.agentService
      .getAssetByGuid("48e23c98-cbe4-4a8e-82bd-8c36fe5c9502")
      .subscribe((resp) => {
        if (resp.length > 0) {
          this.asset = resp[0];
          this.asset.IsUpdated = true;
          if(this.minDate(this.asset.WarrantyExpires)){
            this.asset.WarrantyExpires ="";
          }

          if(this.minDate(this.asset.InstallDate)){
            this.asset.InstallDate ="";
          }

          if(this.minDate(this.asset.DeploymentDate)){
            this.asset.DeploymentDate ="";
          }

          if(this.minDate(this.asset.LastRebootDate)){
            this.asset.LastRebootDate ="";
          }

          this.getlabel(this.asset.Title, this.asset.Domain, this.asset.Name);
          this.getOprationSystemDetail();
          this.getVirusProtection(resp[0].VirusProtectionProducts);
          this.getDiskDriveDetail();
          this.getAssetTagDropDownDetail();
          this.getAssetNotesDetail();
        }
      });
  }

  getAssetNotesDetail() {
    this.agentService.getAssetNotes(this.asset.ID).subscribe((res) => {
      this.assetNotes = res.filter((x) => x.IsActive);
    });
  }

  getAssetTagDropDownDetail() {
    this.agentService.getAssetTag().subscribe((resp) => {
      this.agentService.getAssetTagByAssetId(this.asset.ID).subscribe((res) => {
        this.selectedTag = res;

        if (this.selectedTag.length !== 0) {
          this.assetTag = resp;
          this.filteredTag = _.differenceBy(resp, this.selectedTag, "ID");
        } else {
          this.assetTag = resp;
          this.filteredTag = resp;
        }
      });
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
    this.agentService
      .getOperatingSystemByAssetId(this.asset.ID)
      .subscribe((resp) => {
        this.System = resp.filter((x) => x.IsActive);
        if (this.System.length > 0) {
          this.operatingSystem = this.System[0];
          this.serialnumber = this.System[0].SerialNumber;
          this.caption =
            this.System[0].Caption.replace("Microsoft", "") +
            " " +
            this.System[0].OSArchitecture +
            " " +
            this.System[0].Version;
        }
      });
  }

  getDiskDriveDetail() {
    this.agentService.getDiskDriveByAssetId(this.asset.ID).subscribe((resp) => {
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
    this.getlabel(this.asset.Title, this.asset.Domain, this.asset.Name);
    this.agentService.overrideAsset(this.asset).subscribe(
      (resp) => {
        this.toastr.success("Asset info save successfully.");
      },
      (error) => {
        this.toastr.error("Something went wrong please try again.");
      }
    );
  }

  updateSerialNo() {
    this.operatingSystem.SerialNumber = this.serialnumber;
    this.agentService.overrideOperationSystem(this.operatingSystem).subscribe(
      (resp) => {
        this.toastr.success("Asset info save successfully.");
      },
      (error) => {
        this.toastr.error("Something went wrong please try again.");
      }
    );
  }

  getlabel(title?: string, domain?: string, name?: string) {
    if (title == "") {
      title = name;
      this.asset.Title = title;
    }
    this.label =
      domain != ""
        ? title + " " + "(" + domain + ")"
        : title + " " + "(" + "In workgroup" + ")";
  }

  convertToGB(value) {
    return (parseInt(value) / 1024 / 1024 / 1024).toFixed(0);
  }

  minDate(dateVal: any) {
    var minDate = moment.utc("0001-01-01");
    var receiveDate = moment(dateVal);
    if (moment.utc(receiveDate).isAfter(minDate)) {
      return false;
    } else {
      return true;
    }
  }

  diskSpaceDiff(v1, v2) {
    let val1 = (parseInt(v1) / 1024 / 1024 / 1024).toFixed(2);
    let val2 = (parseInt(v2) / 1024 / 1024 / 1024).toFixed(2);
    return (parseFloat(val1) - parseFloat(val2)).toFixed(0);
  }

  tooltip(txtLength: number, value?: string) {
    if (value !== undefined && value !== null && value !== "") {
      return value.length > txtLength ? value : null;
    } else {
      return value;
    }
  }

  displayValue(txtLength: number, value?: string) {
    if (value !== undefined && value !== null && value !== "") {
      return value.length > txtLength
        ? value.substring(0, txtLength) + "... "
        : value;
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
