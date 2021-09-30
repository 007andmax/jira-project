import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { CommonHttpServices } from "../_services/common_http.service";
import { ExcelService } from "../_services/download_csv.service";
import { CONFIGCONSTANTS } from "../config/app-constants";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { CompaniesStateService } from "src/app/states/company/companies-state.service";
import { AgentService } from "src/app/services/agent/agent.service";
import { DatePipe } from "@angular/common";

declare var $: any;
@Component({
  selector: "app-hardware",
  templateUrl: "./hardware.component.html",
  styleUrls: ["./hardware.component.scss"],
})
export class HardwareComponent implements OnInit {
  loading: boolean = false;
  printSystem: Array<Array<string>>;
  printMotherBoard: Array<Array<string>>;
  printProcessor: Array<Array<string>>;
  printMouse: Array<Array<string>>;
  printMemory: Array<Array<string>>;
  printNetwork: Array<Array<string>>;
  printGraphic: Array<Array<string>>;
  printDisplay: Array<Array<string>>;
  printDisk: Array<Array<string>>;
  printKeyBoard: Array<Array<string>>;
  printSoundCard: Array<Array<string>>;
  printOS: Array<Array<string>>;
  pdfUrl: string = "";
  _id: string = "";
  type: string = "";
  DateTimeFormat = CONFIGCONSTANTS.DateTimeFormat;
  DateFormats = CONFIGCONSTANTS.DateFormat2;
  motherBoards: any = [];
  bio: any = [];
  processor: any = [];
  physicalmemory: any = [];
  networkAdapter: any = [];
  diskDrive: any = [];
  keyboards: any = [];
  soundCards: any = [];
  operatingSystems: any = [];
  computer: any = [];
  systemTypes: any = [];
  desktop: any = [];
  mouse: any = [];
  graphicsCard: any = [];
  pipe = new DatePipe("en-US");
  memory: number = 0;
  Memory: any[] = [];
  differentMemory: any[] = [];
  graphicscardDriver: any[] = [];
  TempararyGraphicsDriver: any[] = [];

  constructor(
    private toastr: ToastrService,
    private commonHttpServices: CommonHttpServices,
    private router: Router,
    private companiesStateService: CompaniesStateService,
    private excelService: ExcelService,
    private agentService: AgentService,
    public activateRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this._id = this.activateRoute.snapshot.params["id"];
    this.type = this.activateRoute.snapshot.params["type"];
    if (this.type === "printer") {
      this.router.navigate([
        `${this.companiesStateService
          .getCurrentCompany()
          .name.replaceAll(" ", "")}/device/dashboard/${this.type}/${this._id}`,
      ]);
    }
    this.setPreviewDataDevice();
  }

  setPreviewDataDevice() {
    this.agentService
      .getAgentToken(
        "QuickTech",
        "s8Y1IuPCUUYlSLMbFijHvut5uOi/KnKNqOLtn57CBlw="
      )
      .subscribe((data) => {
        this.agentService.setAccessToken(data.AccessToken);
        this.agentService.getAssetByGuid(this._id).subscribe((resp) => {
          if (resp.length > 0) {
            this.HardwareList(resp[0].ID);
          }
        });
      });
  }

  HardwareList(Asset_ID) {
    this.computerList(Asset_ID);
    this.systemType(Asset_ID);
    this.motherBoardList(Asset_ID);
    this.biosList(Asset_ID);
    this.processorsList(Asset_ID);
    this.pointingDevice(Asset_ID);
    this.memoryList(Asset_ID);
    this.networkList(Asset_ID);
    this.graphicscard(Asset_ID);
    this.desktopMonitor(Asset_ID);
    this.hardDisk(Asset_ID);
    this.keyboard(Asset_ID);
    this.soundCard(Asset_ID);
    this.operatingSystem(Asset_ID);
  }

  printcsv() {
    this.setData();
    this.getPdfData();
  }

  graphicscard(Asset_ID) {
    this.agentService.getGraphicsCard(Asset_ID).subscribe((resp) => {
      if (resp.length > 0) {
        this.graphicsCard = resp[0];
        let driver = this.graphicsCard.InstalledDisplayDrivers.split(",");
        if(driver.length>0)
        {
          this.graphicscardDriver = driver;
          this.graphicscardDriver.forEach((element)=>{
            let rock = element.split('\\');
            let pieces = rock[rock.length-1];
            this.TempararyGraphicsDriver.push(pieces);
          })
          this.graphicsCard.InstalledDisplayDrivers = this.TempararyGraphicsDriver + " " + "version " + this.graphicsCard.DriverVersion ;
        }
        if (this.graphicsCard.VideoModeDescription != "") {
          let screenresolution =
            this.graphicsCard.VideoModeDescription.split("x");
          this.graphicsCard.Resolution =
            screenresolution[0] + "x" + screenresolution[1];
          this.graphicsCard.ColorDepth = screenresolution[2];
        }
        this.printcsv();
      }
    });
  }

  pointingDevice(Asset_ID) {
    this.agentService.getPointingDevice(Asset_ID).subscribe((resp) => {
      if (resp.length > 0) {
        this.mouse = resp[0];
        this.printcsv();
      }
    });
  }

  desktopMonitor(Asset_ID) {
    this.agentService.getDesktopMonitor(Asset_ID).subscribe((resp) => {
      if (resp.length > 0) {
        this.desktop = resp[0];
        this.printcsv();
      }
    });
  }

  computerList(Asset_ID) {
    this.agentService.getComputer(Asset_ID).subscribe((resp) => {
      if (resp.length > 0) {
        this.computer = resp[0];
        if (this.computer.Title == "") {
          this.computer.Title = this.computer.Name;
        }
        this.computer.Name =
          this.computer.Domain != ""
            ? this.computer.Title + " " + "(" + this.computer.Domain + ")"
            : this.computer.Title + " " + "(In workgroup)";
        this.printcsv();
      }
    });
  }

  systemType(Asset_ID) {
    this.agentService.getOperatingSystem(Asset_ID).subscribe((resp) => {
      if (resp.length > 0) {
        this.systemTypes = resp[0];
        this.printcsv();
      }
    });
  }

  motherBoardList(Asset_ID) {
    this.agentService.getMotherBoard(Asset_ID).subscribe((resp) => {
      if (resp.length > 0) {
        this.motherBoards = resp[0];
        this.printcsv();
      }
    });
  }

  biosList(Asset_ID) {
    this.agentService.getBios(Asset_ID).subscribe((resp) => {
      if (resp.length > 0) {
        this.bio = resp[0];
        let date = this.bio.ReleaseDate.split("+");
        this.bio.ReleaseDate = date[0];
        this.printcsv();
      }
    });
  }

  processorsList(Asset_ID) {
    this.agentService.getProcessor(Asset_ID).subscribe((resp) => {
      if (resp.length > 0) {
        this.processor = resp[0];
        this.printcsv();
      }
    });
  }

  memoryList(Asset_ID) {
    this.agentService.getPhysicalMemory(Asset_ID).subscribe((resp) => {
      debugger;
      if (resp.length > 0) {
        this.physicalmemory = resp[0];
        this.Memory = resp;
        this.Memory.forEach((element) => {
          this.memory += element.Capacity;
          if (element.DeviceLocator != "") {
            this.differentMemory.push(
              element.DeviceLocator+":"+' '+ + element.Capacity / 1024 / 1024 +' '+"MB RAM"
            );
          }
        });
        this.physicalmemory.Capacity = this.memory;
        let different = this.differentMemory;
        this.physicalmemory.DeviceLocator = different.toString().replace(/,/g, " ");
        this.printcsv();
      }
    });
  }

  networkList(Asset_ID) {
    this.agentService.getNetworkAdapter(Asset_ID).subscribe((resp) => {
      if (resp.length > 0) {
        this.networkAdapter = resp[0];
        this.printcsv();
      }
    });
  }

  hardDisk(Asset_ID) {
    this.agentService.getHardDisk(Asset_ID).subscribe((resp) => {
      if (resp.length > 0) {
        this.diskDrive = resp[0];
        this.printcsv();
      }
    });
  }

  keyboard(Asset_ID) {
    this.agentService.getKeyboard(Asset_ID).subscribe((resp) => {
      if (resp.length > 0) {
        this.keyboards = resp[0];
        this.printcsv();
      }
    });
  }

  soundCard(Asset_ID) {
    this.agentService.getsoundCard(Asset_ID).subscribe((resp) => {
      if (resp.length > 0) {
        this.soundCards = resp[0];
        this.printcsv();
      }
    });
  }

  operatingSystem(Asset_ID) {
    this.agentService.getOperatingSystem(Asset_ID).subscribe((resp) => {
      if (resp.length > 0) {
        this.operatingSystems = resp[0];
        this.printcsv();
      }
    });
  }

  setData() {
    this.printSystem = [
      ["Manufacturer", this.computer["Manufacturer"] || "N/A"],
      ["Computer Model", this.computer["Model"] || "N/A"],
      ["Computer Name", this.computer["Name"] || "N/A"],
      [
        "System Type",
        this.systemTypes["OSArchitecture"] != undefined
          ? this.systemTypes["OSArchitecture"]
          : "N/A",
      ],
      [
        "Warranty",
        this.computer["WarrantyExpires"] != undefined
          ? "Expires :" + this.computer["WarrantyExpires"]
          : "N/A",
      ],
    ];

    this.printMotherBoard = [
      ["Manufacturer", this.motherBoards["Manufacturer"] || "N/A"],
      ["Model", this.motherBoards["Product"] || "N/A"],
      ["BIOS Manufacturer", this.bio["Manufacturer"] || "N/A"],
      [
        "BIOS Model",
        "BIOS Date " +
          this.pipe.transform(
            this.bio["ReleaseDate"],
            this.DateTimeFormat || "N/A"
          ) +
          "Ver:" +
          (this.bio["SMBIOSBIOSVersion"] || "N/A") +
          " Version: " +
          (this.bio["Version"] || "N/A"),
      ],
    ];

    this.printProcessor = [
      ["Model", this.processor["Name"] || "N/A"],
      ["Clock Speed", this.processor["MaxClockSpeed"] + " " + "MHz" || "N/A"],
    ];

    this.printMouse = [
      ["Manufacturer", this.mouse["Manufacturer"] || "N/A"],
      ["Model", this.mouse["Caption"] || "N/A"],
    ];

    this.printMemory = [
      [
        "Memory",
        this.physicalmemory["Capacity"] != undefined
          ? this.physicalmemory["Capacity"] / 1024 / 1024 + " MB RAM"
          : "N/A",
      ],
      [ "",this.physicalmemory["DeviceLocator"]!=undefined? this.physicalmemory["DeviceLocator"]:""],
    ];

    this.printNetwork = [
      ["Model(s)", this.networkAdapter["Name"] || "N/A"],
      ["IP", this.networkAdapter["IPAddress"] || "N/A"],
      ["MAC", this.networkAdapter["MACAddress"] || "N/A"],
      ["DHCP", this.networkAdapter["DHCPEnabled"]],
    ];

    this.printGraphic = [
      ["Model", this.graphicsCard["Caption"] || "N/A"],
      ["Video Processor", "N/A"],
      [
        "Memory Size",
        this.graphicsCard["AdapterRAM"] != undefined
          ? this.graphicsCard["AdapterRAM"] / 1024 / 1024 + " MB VRAM"
          : "N/A",
      ],
      ["Driver", this.graphicsCard["InstalledDisplayDrivers"] || "N/A"],
    ];

    this.printDisplay = [
      ["Manufacturer", this.desktop["MonitorManufacturer"] || "N/A"],
      ["Model", this.desktop["Caption"] || "N/A"],
      ["Screen Resolution", this.graphicsCard["Resolution"] || "N/A"],
      ["Color Depth", this.graphicsCard["ColorDepth"] || "N/A"],
      ["Refresh Rate", "N/A"],
    ];

    this.printDisk = [
      ["Model(s)", this.diskDrive["Model"] || "N/A"],
      [
        "File Format(s)",
        this.diskDrive["FileSystem"] + "(" + this.diskDrive["Caption"] + ")",
      ],
      [
        "Size",
        this.diskDrive["Size"] != undefined
          ? (this.diskDrive["Size"] / 1024 / 1024 / 1024).toFixed(2) +
            " GB" +
            " " +
            "(" +
            (this.diskDrive["Size"] / 1024 / 1024 / 1024).toFixed(2) +
            " GB" +
            " " +
            "(" +
            this.diskDrive["Caption"] +
            ")" +
            ")"
          : "N/A",
      ],
      [
        "Free Space",
        this.diskDrive["FreeSpace"] != undefined
          ? (this.diskDrive["FreeSpace"] / 1024 / 1024 / 1024).toFixed(2) +
            " GB" +
            " " +
            "(" +
            (this.diskDrive["FreeSpace"] / 1024 / 1024 / 1024).toFixed(2) +
            " GB" +
            " " +
            "(" +
            this.diskDrive["Caption"] +
            ")" +
            ")"
          : "N/A",
      ],
    ];

    this.printKeyBoard = [
      ["Model", this.keyboards["Description"] || "N/A"],
      ["Type", this.keyboards["Caption"] || "N/A"],
    ];

    this.printSoundCard = [
      ["Manufacturer", this.soundCards["Manufacturer"] || "N/A"],
      ["Model", this.soundCards["Caption"] || "N/A"],
    ];

    this.printOS = [
      ["Name", this.operatingSystems["Caption"] || "N/A"],
      ["Version", this.operatingSystems["Version"] || "N/A"],
      ["Service Pack", this.operatingSystems["Version"] || "N/A"],
    ];
  }

  downloadCsv() {
    let downloadCsvList = [];
    downloadCsvList.push({ label: "Computer", value: "" });
    this.printSystem.forEach((element) => {
      downloadCsvList.push({ label: element[0], value: element[1] });
    });
    downloadCsvList.push({ label: "", value: "" });
    downloadCsvList.push({ label: "Motherboard", value: "" });
    this.printMotherBoard.forEach((element) => {
      downloadCsvList.push({ label: element[0], value: element[1] });
    });
    downloadCsvList.push({ label: "", value: "" });
    downloadCsvList.push({ label: "Processor", value: "" });
    this.printProcessor.forEach((element) => {
      downloadCsvList.push({ label: element[0], value: element[1] });
    });
    downloadCsvList.push({ label: "", value: "" });
    downloadCsvList.push({ label: "Mouse", value: "" });
    this.printMouse.forEach((element) => {
      downloadCsvList.push({ label: element[0], value: element[1] });
    });
    downloadCsvList.push({ label: "", value: "" });
    downloadCsvList.push({ label: "Memory", value: "" });
    this.printMemory.forEach((element) => {
      downloadCsvList.push({ label: element[0], value: element[1] });
    });
    downloadCsvList.push({ label: "", value: "" });
    downloadCsvList.push({ label: "Network Card", value: "" });
    this.printNetwork.forEach((element) => {
      downloadCsvList.push({ label: element[0], value: element[1] });
    });
    downloadCsvList.push({ label: "", value: "" });
    downloadCsvList.push({ label: "Graphics Card", value: "" });
    this.printGraphic.forEach((element) => {
      downloadCsvList.push({ label: element[0], value: element[1] });
    });
    downloadCsvList.push({ label: "", value: "" });
    downloadCsvList.push({ label: "Display", value: "" });
    this.printDisplay.forEach((element) => {
      downloadCsvList.push({ label: element[0], value: element[1] });
    });
    downloadCsvList.push({ label: "", value: "" });
    downloadCsvList.push({ label: "Hard Disk", value: "" });
    this.printDisk.forEach((element) => {
      downloadCsvList.push({ label: element[0], value: element[1] });
    });
    downloadCsvList.push({ label: "", value: "" });
    downloadCsvList.push({ label: "Keyboard", value: "" });
    this.printKeyBoard.forEach((element) => {
      downloadCsvList.push({ label: element[0], value: element[1] });
    });
    downloadCsvList.push({ label: "", value: "" });
    downloadCsvList.push({ label: "Sound Card", value: "" });
    this.printSoundCard.forEach((element) => {
      downloadCsvList.push({ label: element[0], value: element[1] });
    });
    downloadCsvList.push({ label: "", value: "" });
    downloadCsvList.push({ label: "Operating System", value: "" });
    this.printOS.forEach((element) => {
      downloadCsvList.push({ label: element[0], value: element[1] });
    });
    let fileName = "Hardware Detail";
    this.excelService.generateExcel(downloadCsvList, fileName, "hardware");
  }

  getPdfData() {
    let html =
      `
    <style>
    * {
      padding: 0;
      margin: 0;
    }
    body {
      padding: 0;
      margin: 0;
      -ms-box-sizing: border-box;
      -o-box-sizing: border-box;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 12px;
      font-weight: normal;
      font-style: normal;
      line-height: 1.33;
      letter-spacing: normal;
      color: #4f5f79;
      background-color: #f3f7f9;
    }
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    ul,
    li,
    ol {
      padding: 0;
      margin: 0;
    }
    a {
      text-decoration: none;
      border: none;
    }
    img {
      border: none;
      outline: none;
    }

    .container{
      width: 100%;
      margin: 0 auto;
      max-width:95%;
      padding:0 20px;
    }
    table{
      border-collapse: collapse;
      width: 100%;
    }
    </style>
    <body>
    <div class="container" style="width: 960px;margin: 0 auto;max-width:95%;padding:0 20px;">
      <table style="width: 100%;border-collapse: collapse;border: solid 1px #dfe3e8;table-layout:fixed;">
        <thead style="width: 100%;font-family: Arial, Helvetica, sans-serif;">
          <tr style="width: 100%;font-family: Arial, Helvetica, sans-serif;">
          <th style="width:100px;text-align: left;color: #fff;padding: 15px 24px 15px;vertical-align: middle;font-family: Arial, Helvetica, sans-serif;background-color: #fff;">
              <img src="/file/${localStorage.getItem(
                "imId"
              )}.jpg" alt="Logo" title="logo" style="max-width:100px;height:auto;"/>
          </th>
            <th style="text-align:left;font-size: 16px;line-height: 1.33;color: #000;padding:15px 0 15px 70px;vertical-align: middle;font-family: Arial, Helvetica, sans-serif;background-color: #fff;">
               <div class="reports-head" style="width:585px;text-align:center;color: #364656;margin-left:-105px;">
                    <p style="margin:0;line-height:1.2;color:#364656;font-size:16px;font-family: Arial, Helvetica, sans-serif;font-weight:600;">` +
      localStorage.getItem("currentCompanyName") +
      ` - Hardware Summary Report</p>
                    <p style="line-height:1.5;color:#364656;margin:3px 0;font-size: 13px;font-family: Arial, Helvetica, sans-serif;font-weight:400;">Summary of ` +
      this.computer.Name +
      ` hardware installed (9 items)</p>
                    <p style="margin:0;line-height:1;color:#4f5f79;font-size:11px;line-height: 1.09;font-family: Arial, Helvetica, sans-serif;font-weight:400;">Generated on ` +
      moment(new Date()).format("LL") +
      ` @ ` +
      moment(new Date()).format("LT") +
      `</p>
               </div>
            </th>
          </tr>
        </thead>
        <tbody style="background-color: #f3f7f9;">
          <tr style="width: 100%;">
            <td colspan="2" style="width: 100%;padding: 24px;">
            <table style="width: 100%;border: solid 1px #dfe3e8;border-collapse: collapse;text-align: left;margin-bottom: 8px;table-layout:fixed;">
              <thead>
                  <tr>
                      <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 100%;" colspan="2">Computer</th>
                  </tr>
              </thead>
              <tbody>`;
    this.printSystem.forEach((element) => {
      html = html + `<tr style="width: 100%;">`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 16.7%;">` +
        element[0] +
        `</td>`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;font-weight: bold;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 83.3%;">` +
        element[1] +
        `</td></tr>`;
    });
    html =
      html +
      `</tbody>
            </table>
            <table style="width: 100%;border: solid 1px #dfe3e8;border-collapse: collapse;text-align: left;margin-bottom: 8px;table-layout:fixed;">
              <thead>
                  <tr>
                      <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 100%;" colspan="2">Motherboard</th>
                  </tr>
              </thead>
              <tbody>`;
    this.printMotherBoard.forEach((element) => {
      html = html + `<tr style="width: 100%;">`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 16.7%;">` +
        element[0] +
        `</td>`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;font-weight: bold;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 83.3%;">` +
        element[1] +
        `</td></tr>`;
    });
    html =
      html +
      `</tbody>
            </table>
            <table style="width: 100%;border: solid 1px #dfe3e8;border-collapse: collapse;text-align: left;margin-bottom: 8px;table-layout:fixed;">
              <thead>
                  <tr>
                      <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 100%;" colspan="2">Processor</th>
                  </tr>
              </thead>
              <tbody>`;
    this.printProcessor.forEach((element) => {
      html = html + `<tr style="width: 100%;">`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 16.7%;">` +
        element[0] +
        `</td>`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;font-weight: bold;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 83.3%;">` +
        element[1] +
        `</td></tr>`;
    });
    html =
      html +
      `</tbody>
            </table>
            <table style="width: 100%;border: solid 1px #dfe3e8;border-collapse: collapse;text-align: left;margin-bottom: 8px;table-layout:fixed;">
              <thead>
                  <tr>
                      <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 100%;" colspan="2">Mouse</th>
                  </tr>
              </thead>
              <tbody>`;
    this.printMouse.forEach((element) => {
      html = html + `<tr style="width: 100%;">`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 16.7%;">` +
        element[0] +
        `</td>`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;font-weight: bold;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 83.3%;">` +
        element[1] +
        `</td></tr>`;
    });
    html =
      html +
      `</tbody>
            </table>
            <table style="width: 100%;border: solid 1px #dfe3e8;border-collapse: collapse;text-align: left;margin-bottom: 8px;table-layout:fixed;">
            <thead>
              <tr>
                  <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 100%;" colspan="2">Memory</th>
              </tr>
            </thead>
            <tbody>`;
    this.printMemory.forEach((element) => {
      html = html + `<tr style="width: 100%;">`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 16.7%;">` +
        element[0] +
        `</td>`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;font-weight: bold;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 83.3%;">` +
        element[1] +
        `</td></tr>`;
    });
    html =
      html +
      `</tbody>
            </table>
            <table style="width: 100%;border: solid 1px #dfe3e8;border-collapse: collapse;text-align: left;margin-bottom: 8px;table-layout:fixed;">
              <thead>
                  <tr>
                      <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 100%;" colspan="2">Network Card</th>
                  </tr>
              </thead>
              <tbody>`;
    this.printNetwork.forEach((element) => {
      html = html + `<tr style="width: 100%;">`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 16.7%;">` +
        element[0] +
        `</td>`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;font-weight: bold;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 83.3%;">` +
        element[1] +
        `</td></tr>`;
    });
    html =
      html +
      `</tbody>
            </table>
            <table style="width: 100%;border: solid 1px #dfe3e8;border-collapse: collapse;text-align: left;margin-bottom: 8px;table-layout:fixed;">
              <thead>
                  <tr>
                      <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 100%;" colspan="2">Graphics Card</th>
                  </tr>
              </thead>
              <tbody>`;
    this.printGraphic.forEach((element) => {
      html = html + `<tr style="width: 100%;">`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 16.7%;">` +
        element[0] +
        `</td>`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;font-weight: bold;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 83.3%;">` +
        element[1] +
        `</td></tr>`;
    });
    html =
      html +
      `</tbody>
            </table>
            <table style="width: 100%;border: solid 1px #dfe3e8;border-collapse: collapse;text-align: left;margin-bottom: 8px;table-layout:fixed;">
              <thead>
                  <tr>
                      <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 100%;" colspan="2">Display</th>
                  </tr>
              </thead>
              <tbody>`;
    this.printDisplay.forEach((element) => {
      html = html + `<tr style="width: 100%;">`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 16.7%;">` +
        element[0] +
        `</td>`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;font-weight: bold;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 83.3%;">` +
        element[1] +
        `</td></tr>`;
    });
    html =
      html +
      `</tbody>
            </table>
            <table style="width: 100%;border: solid 1px #dfe3e8;border-collapse: collapse;text-align: left;margin-bottom: 8px;table-layout:fixed;">
              <thead>
                  <tr>
                      <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 100%;" colspan="2">Hard Disk</th>
                  </tr>
              </thead>
              <tbody>`;
    this.printDisk.forEach((element) => {
      html = html + `<tr style="width: 100%;">`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 16.7%;">` +
        element[0] +
        `</td>`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;font-weight: bold;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 83.3%;">` +
        element[1] +
        `</td></tr>`;
    });
    html =
      html +
      `</tbody>
            </table>
            <table style="width: 100%;border: solid 1px #dfe3e8;border-collapse: collapse;text-align: left;table-layout:fixed;">
              <thead>
                  <tr>
                      <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 100%;" colspan="2">Keyboard</th>
                  </tr>
              </thead>
              <tbody>`;
    this.printKeyBoard.forEach((element) => {
      html = html + `<tr style="width: 100%;">`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 16.7%;">` +
        element[0] +
        `</td>`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;font-weight: bold;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 83.3%;">` +
        element[1] +
        `</td></tr>`;
    });
    html =
      html +
      `</tbody>
                </table>
                <table style="width: 100%;border: solid 1px #dfe3e8;border-collapse: collapse;text-align: left;table-layout:fixed;">
                <thead>
                    <tr>
                        <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 100%;" colspan="2">Sound Card</th>
                    </tr>
                </thead>
                <tbody>`;
    this.printSoundCard.forEach((element) => {
      html = html + `<tr style="width: 100%;">`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 16.7%;">` +
        element[0] +
        `</td>`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;font-weight: bold;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 83.3%;">` +
        element[1] +
        `</td></tr>`;
    });
    html =
      html +
      `</tbody>
                </table>
                <table style="width: 100%;border: solid 1px #dfe3e8;border-collapse: collapse;text-align: left;table-layout:fixed;">
                <thead>
                    <tr>
                        <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 100%;" colspan="2">Operating System</th>
                    </tr>
                </thead>
                <tbody>`;
    this.printOS.forEach((element) => {
      html = html + `<tr style="width: 100%;">`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 16.7%;">` +
        element[0] +
        `</td>`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;font-weight: bold;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 83.3%;">` +
        element[1] +
        `</td></tr>`;
    });
    html =
      html +
      `</tbody>
            </table>
     </td>
   </tr>

 </tbody>
 <tfoot style="width: 100%;">
          <tr style="width: 100%;">
            <td style="width: 100%;" colspan="2">
              <table style="width: 100%;border-collapse: collapse;table-layout:fixed;">
                <tr>
                  <td style="width: 33.33%;color: #4f5f79;font-size: 12px;font-family: Arial, Helvetica, sans-serif;padding: 8px 24px;line-height: 1.33;background-color: #fff;text-align: left;vertical-align: middle;">Report Prepare by: ` +
      localStorage.getItem("currentUser") +
      `</td>
                  <td style="width: 33.33%;color: #4f5f79;font-size:12px;font-family: Arial, Helvetica, sans-serif;padding: 8px 24px;line-height: 1.33;background-color: #fff;text-align: center;vertical-align: middle;">` +
      localStorage.getItem("currentCompanyName") +
      `</td>
                  <td style="width: 33.33%;color: #4f5f79;font-size: 12px;font-family: Arial, Helvetica, sans-serif;padding: 8px 24px;line-height: 1.33;background-color: #fff;text-align: right;vertical-align: middle;">Quicktech 2020 ©. All rights reserved</td>
               </tr>
              </table>
            </td>
          </tr>
        </tfoot>
 </table>
        </div>
        </body>`;
    let data = {
      content: html,
      id: "",
      fileName: "Hardware Summary Report",
      orientation: "PORTRAIT",
    };
    this.loading = true;
    this.commonHttpServices
      .printPdf(data)
      .pipe()
      .subscribe(
        (data) => {
          this.loading = false;
          this.pdfUrl = data.url;
        },
        (error) => {
          this.loading = false;
          const statusError = error;
          if (statusError && statusError.meta) {
            this.toastr.error(statusError.meta.message);
          } else {
            this.toastr.error("Something went wrong please try again.");
          }
        }
      );
  }

  printPdf() {
    window.open(this.pdfUrl, "_blank");
  }
}
