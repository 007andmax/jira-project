import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { UploadInput, UploadFile, humanizeBytes, UploaderOptions } from "ngx-uploader";
import { ToastrService } from "ngx-toastr";
import { CONFIGCONSTANTS } from "../config/app-constants";
import { environment } from "../../../../environments/environment";
import { ModalDismissReasons, NgbActiveModal, NgbDatepicker, NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { NgbDateAdapter, NgbDateParserFormatter } from "@ng-bootstrap/ng-bootstrap";
import { AgentService } from "src/app/services/agent/agent.service";
import { Subscription } from "rxjs";
import { CustomAdapter } from "./CustomDateAdapter";
import { CustomDateParserFormatter } from "./CustomDateParserFormatter";
import * as _ from "lodash";
import { NotesAdd } from "./class/dashboard";
import { ActivatedRoute } from "@angular/router";
import * as moment from "moment";
import { KafkaStateService } from "src/app/states/kafka/kafka-state.service";

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
  notesTitle: string = "";
  notesDescription: string = "";
  kafkaMessage: any = "";
  securityUpdate: number;
  closeResult: string = "";
  windowUpdatePendingList: any[] = [];
  selected: number = 0;
  reloadWindowUpdatePendingList: any[] = [];
  check: any[] = [];
  isOverlay = false;
  installUpdateModal: NgbModalRef;
  categoriesName: string = "";
  isNonAgentDevice:boolean;

  constructor(
    private agentService: AgentService,
    private toastr: ToastrService,
    private activateRoute: ActivatedRoute,
    private kafkaStateService: KafkaStateService,
    private cd: ChangeDetectorRef,
    private modalService: NgbModal,
    private ngZone: NgZone
  ) {
    this.options = { concurrency: 1, maxUploads: 10, maxFileSize: 1000000 };
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
  }

  ngOnInit() {
    this.isNonAgentDevice = true;
    this.type = this.activateRoute.snapshot.params["type"];
    this._id = this.activateRoute.snapshot.params["id"];

    this.setPreviewDataDevice();
    this.kafkaStateService.onCurrentConfig.subscribe((resp) => this.onCurrentConfig(resp), (e) => this.onCurrentConfigError(e));
    this.kafkaStateService.onInstallWindowsUpdates.subscribe((resp) => this.onInstallWindowsUpdates(resp), (e) => this.onInstallWindowsUpdatesError(e));
  }

  onCurrentConfig(resp: any) {
    if (this.asset.ID && this.asset.ID != 0) {
      let item = resp.find((x) => x.key == this.asset.ID);
      if (item) {
        this.kafkaMessage = JSON.parse(item.Value);
        this.securityUpdate = this.kafkaMessage.PendingWindowsUpdates.length;
        if (this.securityUpdate > 0) {
          this.windowUpdatePendingList = [];
          for (let i = 0; i < this.securityUpdate; i++) {
            let data: any = {};
            data.UpdateID = this.kafkaMessage.PendingWindowsUpdates[i].UpdateID;
            data.Title = this.kafkaMessage.PendingWindowsUpdates[i].Title;
            data.Size = this.kafkaMessage.PendingWindowsUpdates[i].Size;
            data.Categories = this.kafkaMessage.PendingWindowsUpdates[i].Categories[i].Name
            if (this.kafkaMessage.PendingWindowsUpdates[i].RebootIsRequired == "0") {
              data.RebootIsRequired = "Never Reboots"
            }
            if (this.kafkaMessage.PendingWindowsUpdates[i].RebootIsRequired == "1") {
              data.RebootIsRequired = "Always Requires Reboot";
            }
            if (this.kafkaMessage.PendingWindowsUpdates[i].RebootIsRequired == "2") {
              data.RebootIsRequired = "Can Request Reboot";
            }
            data.loading = false;
            this.windowUpdatePendingList.push(data);
          }
        }
        this.cd.detectChanges();
      }
    }
  }

  onCurrentConfigError(err: any) {
    console.log('on current config error');
    this.toastr.error("Something went wrong getting real time data");
  }

  onInstallWindowsUpdates(resp: any) {
    this.ngZone.run(() => {
      this.modalService.dismissAll();
      this.toastr.success(resp.Value);
    });
  }

  onInstallWindowsUpdatesError(error: any) {
    console.log('onInstallWindowsUpdatesError');
    this.toastr.error("Something went wrong installing updates");
  }

  setPreviewDataDevice() {
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

  getAssetDetail() {
    this.agentService.getAssetByGuid(this._id).subscribe((resp) => {
      if (resp.length > 0) {
        this.asset = resp[0];
        localStorage.setItem(
          "deviceDetail_" + this._id,
          JSON.stringify(this.asset)
        );
        this.asset.IsUpdated = true;

        if (this.minDate(this.asset.WarrantyExpires)) {
          this.asset.WarrantyExpires = "";
        }

        if (this.minDate(this.asset.InstallDate)) {
          this.asset.InstallDate = "";
        }

        if (this.minDate(this.asset.DeploymentDate)) {
          this.asset.DeploymentDate = "";
        }

        if (this.minDate(this.asset.LastRebootDate)) {
          this.asset.LastRebootDate = "";
        }

        if(this.asset.AgentVersion == ""){
          this.isNonAgentDevice = false;
        }

        this.getlabel(this.asset.Title, this.asset.Domain, this.asset.Name);
        this.getOprationSystemDetail();
        this.getVirusProtection(resp[0].VirusProtectionProducts);
        this.getDiskDriveDetail();
        this.getAssetTagDropDownDetail();
        this.getAssetNotesDetail();
        this.agentService.GetCurrentConfig(this.asset.ID);
      }
    });
  }

  AddTags(Tag) {
    //return if no tag
    if (!Tag) {
      return;
    }
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
    this.notesDescription = this.noteEdit.Description;
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
          element.percent = isNaN(Math.round((osize / parseInt(size)) * 100))
            ? 0
            : Math.round((osize / parseInt(size)) * 100);
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

  onDateChange(newDate: Date) { }

  updateAsset() {
    this.asset.InstallDate = this.asset.InstallDate || '0001-01-01';
    this.asset.LastRebootDate = this.asset.LastRebootDate || '0001-01-01';
    this.asset.DeploymentDate = this.asset.DeploymentDate || '0001-01-01';
    this.asset.WarrantyExpires = this.asset.WarrantyExpires || '0001-01-01';

    this.getlabel(this.asset.Title, this.asset.Domain, this.asset.Name);
    this.agentService.overrideAsset(this.asset).subscribe(
      (resp) => {
        this.toastr.success("Asset info save successfully.");
      },
      (error) => {
        this.toastr.error("Something went wrong please try again.");
      }
    );
    if (this.minDate(this.asset.WarrantyExpires)) {
      this.asset.WarrantyExpires = "";
    }

    if (this.minDate(this.asset.InstallDate)) {
      this.asset.InstallDate = "";
    }

    if (this.minDate(this.asset.DeploymentDate)) {
      this.asset.DeploymentDate = "";
    }

    if (this.minDate(this.asset.LastRebootDate)) {
      this.asset.LastRebootDate = "";
    }

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

  getPendingWindowUpdate(template) {
    this.ngZone.run(() => {
      this.modalService
        .open(template, { ariaLabelledBy: "modal-basic-title", centered: true, size: 'lg', })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismiss(reason)}`;
          }
        );
    });
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

  postWindowUpdatePendint(i) {
    const index: any = { "ID": i };
    let find = this.check.find(x => x.ID == i);
    let indexs = this.check.findIndex(x => x.ID == i);
    if (!find) {
      this.check.push(index);
      this.selected = this.selected + 1;
      this.reloadWindowUpdatePendingList.push(this.windowUpdatePendingList[i]);
    }
    else {
      this.check.splice(indexs, 1);
      this.selected = this.selected - 1;
      this.reloadWindowUpdatePendingList.splice(indexs, 1);
    }
  }

  InstallUpdate() {
    var clonedItems = [];
    for (let i = 0; i < this.reloadWindowUpdatePendingList.length; i++) {
      var itemToUpdate: any = {};
      itemToUpdate.UpdateID = this.reloadWindowUpdatePendingList[i].UpdateID;
      itemToUpdate.Title = this.reloadWindowUpdatePendingList[i].Title;
      itemToUpdate.RebootIsRequired = this.reloadWindowUpdatePendingList[i].RebootIsRequired;

      if (itemToUpdate.RebootIsRequired == "Never Reboots") {
        itemToUpdate.RebootIsRequired = "0";
      }
      else if (itemToUpdate.RebootIsRequired == "Always Requires Reboot") {
        itemToUpdate.RebootIsRequired = "1";
      }
      else if (itemToUpdate.RebootIsRequired == "Can Request Reboot") {
        itemToUpdate.RebootIsRequired = "2";
      }
      clonedItems.push(itemToUpdate);

      var item = this.windowUpdatePendingList.find(x => x.UpdateID == this.reloadWindowUpdatePendingList[i].UpdateID);
      if (item) {
        item.loading = true;
      }
    }

    this.agentService.GetWindowUpdateList(this.asset.ID, clonedItems);

    if (this.check.length) {
      this.isOverlay = true;
      setTimeout(() => {
        this.isOverlay = false;
      }, 3000)
    }
  }

  sizeConvert(v1) {
    let val1 = (parseInt(v1) / 1024 / 1024).toFixed(2);
    return (parseFloat(val1)).toFixed(2);
  }

  categoriesSep(name:string){
    this.categoriesName = "";
    if (name.length > 0) {
      let finalname = name.split(",");

      for (let i = 0; i < finalname.length; i++) {
        return finalname[i].split(",");
      }
    }
  }
}
