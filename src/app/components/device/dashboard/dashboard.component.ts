import { ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { UploadInput, UploadFile, humanizeBytes, UploaderOptions } from "ngx-uploader";
import { ToastrService } from "ngx-toastr";
import { CONFIGCONSTANTS } from "../config/app-constants";
import { environment } from "../../../../environments/environment";
import { ModalDismissReasons, NgbActiveModal, NgbDatepicker, NgbDropdown, NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
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
import { CompaniesStateService } from "src/app/states/company/companies-state.service";

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
  @ViewChild('searchInput') private searchInput: ElementRef;
  @ViewChild('Tagproducts') Tagproducts: NgbDropdown;
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
  isNonAgentDevice: boolean;
  tab = "PendingWindows";
  installedWindowsUpdateList: any[] = [];
  installUpdate: number;
  blockedWindowsUpdateList: any[] = [];
  blockedNumber: number;
  categories: number;
  networkDisk: any = [];
  manufactureList: any[] = [];
  loading: boolean;
  techCompany: any;
  allModelList: any[] = [];
  modelList: any[] = [];
  manufactureId: any = undefined;
  selectModelList: any[] = [];
  modelId: any = undefined;
  model: any;
  manufacturename: string;
  modelName: string;
  selectManufactureNames: any;
  selectModelName: any;
  company: any;
  searches: any[];
  noteId: any;

  constructor(
    private agentService: AgentService,
    private toastr: ToastrService,
    private activateRoute: ActivatedRoute,
    private kafkaStateService: KafkaStateService,
    private cd: ChangeDetectorRef,
    private modalService: NgbModal,
    private ngZone: NgZone,
    private companyStateService: CompaniesStateService
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
    this.currentUser = localStorage.getItem("currentUser");
    if (this.agentService.getDataAssetByGuid()) this.getAssetDetail(this.agentService.getDataAssetByGuid());
    this.agentService.onAssetByGuid.subscribe(data => {
      this.getAssetDetail(data);
    })
    let onSetAccessToken = this.agentService.onSetAccessToken.subscribe(data => {
      if (this.techCompany) this.getManufacturers(this.techCompany.id);
      if (this.techCompany) this.getModels(this.techCompany.id);
    })
    this.sub.add(onSetAccessToken);
    this.kafkaStateService.onCurrentConfig.subscribe((resp) => this.onCurrentConfig(resp), this.loading = false, (e) => this.onCurrentConfigError(e));
    this.kafkaStateService.onInstallWindowsUpdates.subscribe((resp) => this.onInstallWindowsUpdates(resp), (e) => this.onInstallWindowsUpdatesError(e));
    if (this.companyStateService.getCurrentCompany()) this.getCurrentCompany(this.companyStateService.getCurrentCompany());
    this.companyStateService.onCurrentCompany.subscribe((data) => {
      this.getCurrentCompany(data);
      this.techCompany = data;
      if (this.agentService.hasAccessToken()) this.getManufacturers(this.techCompany.id);
      if (this.agentService.hasAccessToken()) this.getModels(this.techCompany.id);
    })
  }

  onCurrentConfig(resp: any) {
    if (this.asset.ID && this.asset.ID != 0) {
      let item = resp.find((x) => x.key == this.asset.ID);
      if (item) {
        this.kafkaMessage = JSON.parse(item.Value);

        this.installUpdate = this.kafkaMessage.InstalledWindowsUpdates.length;
        if (this.installUpdate > 0) {
          this.installedWindowsUpdateList = [];
          for (let i = 0; i < this.installUpdate; i++) {
            let install: any = {};
            install.UpdateID = this.kafkaMessage.InstalledWindowsUpdates[i].UpdateID;
            install.Title = this.kafkaMessage.InstalledWindowsUpdates[i].Title;
            install.Size = this.kafkaMessage.InstalledWindowsUpdates[i].Size;
            this.categories = this.kafkaMessage.InstalledWindowsUpdates[i].Categories.length;
            if (this.categories > 0) {
              for (let j = 0; j < this.categories; j++) {
                install.Categories = this.kafkaMessage.InstalledWindowsUpdates[i].Categories[j].Name
              }
            }
            this.installedWindowsUpdateList.push(install);
          }
        }

        this.blockedNumber = this.kafkaMessage.BlockedWindowsUpdates.length;
        if (this.blockedNumber > 0) {
          this.blockedWindowsUpdateList = [];
          for (let i = 0; i < this.blockedNumber; i++) {
            let blocked: any = {};
            blocked.UpdateID = this.kafkaMessage.BlockedWindowsUpdates[i].UpdateID;
            blocked.Title = this.kafkaMessage.BlockedWindowsUpdates[i].Title;
            blocked.Size = this.kafkaMessage.BlockedWindowsUpdates[i].Size;

            this.blockedWindowsUpdateList.push(blocked);
          }
        }

        this.securityUpdate = this.kafkaMessage.PendingWindowsUpdates.length;

        if (this.securityUpdate > 0) {
          this.windowUpdatePendingList = [];
          for (let i = 0; i < this.securityUpdate; i++) {
            let data: any = {};
            data.UpdateID = this.kafkaMessage.PendingWindowsUpdates[i].UpdateID;
            data.Title = this.kafkaMessage.PendingWindowsUpdates[i].Title;
            data.Size = this.kafkaMessage.PendingWindowsUpdates[i].Size;
            this.categories = this.kafkaMessage.PendingWindowsUpdates[i].Categories.length;
            if (this.categories > 0) {
              for (let j = 0; j < this.categories; j++) {
                data.Categories = this.kafkaMessage.PendingWindowsUpdates[i].Categories[j].Name
              }
            }
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
        this.getNetworkDriveDetail(this.kafkaMessage.NetworkDrives);

        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }
      }
    }
  }

  onCurrentConfigError(err: any) {
    this.toastr.error("Something went wrong getting real time data");
  }

  getCurrentCompany(data) {
    this.company = data;
    this.agentService.getByTechCompany(this.company.id).subscribe((res) => {
      this.searches = res;
    });
  }

  onInstallWindowsUpdates(resp: any) {
    this.ngZone.run(() => {
      this.modalService.dismissAll();
      this.toastr.success(resp.Value);
    });
  }

  onInstallWindowsUpdatesError(error: any) {
    this.toastr.error("Something went wrong installing updates");
  }

  getAssetDetail(resp) {
    this.loading = true;
    if (resp.length > 0) {
      this.loading = false;
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

      if (this.asset.AgentVersion == "") {
        this.isNonAgentDevice = false;
      }

      this.model = this.asset.ModelID;
      this.selectManufacture(this.asset.ManufacturerId)
      this.selectModel(this.asset.ModelID);
      this.getlabel(this.asset.Title, this.asset.Domain, this.asset.Name);
      this.getOprationSystemDetail();
      if (resp[0].VirusProtectionProducts != null) {
        this.getVirusProtection(resp[0].VirusProtectionProducts);
      }
      this.getDiskDriveDetail();
      this.getAssetTagDropDownDetail();
      this.getAssetNotesDetail();
      this.agentService.GetCurrentConfig(this.asset.ID);
    }

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
    this.noteAdd.IsActive = true;
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
    this.noteId = id;
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

  deleteNote() {
    let note: any = {};
    note.ID = this.noteId;
    note.AssetID = this.asset.ID;
    this.agentService.deleteAssetNotes(note).subscribe(response => {
      this.closeNotes();
      this.toastr.success("Asset note deleted");
      this.getAssetNotesDetail();
    });
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
      ID: this.selectedTag[index].AssetTagID,
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

  getNetworkDriveDetail(resp: any) {
    let colors = ["#0057a8", "#00d8e7", "#16a4fa", "#0CB2B2", "#485EF0"];
    let count = 0;
    this.networkDisk = resp;

    this.networkDisk.forEach((element) => {
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

    this.networkDisk.sort((a, b) => {
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
  }

  onDateChange(newDate: Date) { }

  updateAsset() {
    this.asset.InstallDate = this.asset.InstallDate || '0001-01-01';
    this.asset.LastRebootDate = this.asset.LastRebootDate || '0001-01-01';
    this.asset.DeploymentDate = this.asset.DeploymentDate || '0001-01-01';
    this.asset.WarrantyExpires = this.asset.WarrantyExpires || '0001-01-01';
    if (this.manufactureId != undefined) {
      this.asset.ManufacturerId = this.manufactureId;
    }
    if (this.modelId != undefined) {
      this.asset.ModelID = this.modelId;
    }


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
    this.operatingSystem.manufactureId = this.manufactureId;
    this.operatingSystem.modelId = this.modelId;

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
    this.asset.Title = title;
    this.label = (domain != "" && domain != null) ? (title != "" && title != null) ? title + " " + "(" + domain + ")" : name + " " + "(" + domain + ")" : (title != "" && title != null) ? title + " " + "(" + "In workgroup" + ")" : name + " " + "(" + "In workgroup" + ")";
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

  categoriesSep(name: string) {
    this.categoriesName = "";
    if (name.length > 0) {
      let finalname = name.split(",");

      for (let i = 0; i < finalname.length; i++) {
        return finalname[i].split(",");
      }
    }
  }

  onChangeTemplate(data) {
    this.tab = data;
  }

  focusMyInput() {
    setTimeout(() => this.searchInput.nativeElement.focus(), 0);
    this.Tagproducts.open();
  }

  getManufacturers(TechCompanyGuid: any) {
    this.agentService.getManufactures(TechCompanyGuid)
      .subscribe((resp) => {
        this.manufactureList = resp;
        if (this.asset) {
          this.selectManufacture(this.asset.ManufacturerId);
        }
      });
  }

  selectManufacture(manufactureId) {
    this.selectManufactureNames = this.manufactureList.find(x => x.ID == manufactureId);
  }

  getModels(TechCompanyGuid: any) {
    this.agentService
      .getModels(TechCompanyGuid)
      .subscribe((resp) => {
        this.selectModelList = resp;
        this.allModelList = resp;
        if (this.asset) {
          this.selectModel(this.asset.ModelID);
        }
      });
  }


  getModelsByManufacturer() {
    this.agentService
      .getModelsByManufacturer(this.manufactureId)
      .subscribe((resp) => {
        this.selectModelList = resp;
        this.allModelList = resp;
        if (this.asset) {
          this.selectModel(this.asset.ModelID);
        }
      });
  }

  selectModel(modelId) {
    this.selectModelName = this.selectModelList.find(x => x.ID == modelId);
  }

  onSelectManufactureName(SelectManufacturer) {
    if (SelectManufacturer) {
      this.manufactureId = SelectManufacturer.ID;
      this.selectManufactureNames = this.manufactureList.find(x => x.ID == this.manufactureId);
      this.getModelsByManufacturer();
      this.selectModelName = '';
      this.updateAsset();
    }
    else {
      this.getModels(this.techCompany.id);
      this.selectManufactureNames = "";
      this.updateAsset();
    }
  }

  onSelectModel(SelectModel) {
    if (SelectModel) {
      this.modelId = SelectModel.ID;
      this.selectModelName = this.selectModelList.find(x => x.ID == this.modelId);
      this.updateAsset();
    }
    else {
      this.selectModelName = "";
      this.updateAsset();
    }
  }
}
