import { WebsocketService } from "src/app/services/websocket/websocket.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import * as CryptoJS from "crypto-js";

@Injectable({
  providedIn: "root",
})
export class AgentService {
  private apiAgent = environment.apiAgent;
  private apiurl = environment.apiUrl;
  key: string = "DD2B2B8B6EAE91C7";
  INITIALIZATION_VECTOR: string = "0000000000000000";
  AccessToken: string = "";
  /**
   * Device api service constructor
   * @param {HttpClient} http Service to work with request
   */
  public constructor(
    private http: HttpClient,
    private wsService: WebsocketService
  ) {
    this.ensureAccessToken();
  }

  public hasAccessToken() {
    return this.AccessToken == "" ? false : true;
  }

  ensureAccessToken(callback = null) {
    this.getAgentToken(
      "QuickTech",
      "s8Y1IuPCUUYlSLMbFijHvut5uOi/KnKNqOLtn57CBlw="
    )
      .subscribe((data) => {
        this.setAccessToken(data.AccessToken);
        if (callback) {
          callback();
        }
      });
  }

  encrypt128(keys, value) {
    var key = CryptoJS.enc.Utf8.parse(keys);
    var iv = CryptoJS.enc.Hex.parse(this.INITIALIZATION_VECTOR);
    var encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(value.toString()),
      key,
      {
        keySize: 128 / 8,
        blockSize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    return JSON.stringify(encrypted.toString());
  }

  decrypt128(value, keys) {
    var key = CryptoJS.enc.Utf8.parse(keys);
    var iv = CryptoJS.enc.Hex.parse(this.INITIALIZATION_VECTOR);
    var decrypted = CryptoJS.AES.decrypt(value, key, {
      keySize: 128 / 8,
      blockSize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  }

  getHeader() {
    return new HttpHeaders({
      "Content-Type": "application/json",
      Accept: "*/*",
      authorization: `Bearer ${this.AccessToken}`,
    });
  }

  public setAccessToken(data) {
    this.AccessToken = data;
  }

  public autoComplete(data) {
    return this.http
      .post(
        `${this.apiAgent}agent/AutoComplete/Search`,
        this.encrypt128(this.key, JSON.stringify(data)),
        { headers: this.getHeader(), responseType: "text" }
      )
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public nonAgentAsset(data) {
    return this.http
      .put(
        `${this.apiAgent}agent/Asset/CreateNonAgentAsset`,
        this.encrypt128(this.key, JSON.stringify(data)),
        { headers: this.getHeader(), responseType: "text" }
      )
      .pipe(map((data: string) => data));
  }

  public addHardwareType(hardware) {
    return this.http
      .put(
        `${this.apiAgent}agent/HardwareType`,
        this.encrypt128(this.key, JSON.stringify(hardware)),
        {
          headers: this.getHeader(),
          responseType: "text",
        }
      )
      .pipe(map((data: string) => data));
  }

  public addManufacturer(manufacturer) {
    return this.http
      .put(
        `${this.apiAgent}agent/Manufacturer`,
        this.encrypt128(this.key, JSON.stringify(manufacturer)),
        {
          headers: this.getHeader(),
          responseType: "text",
        }
      )
      .pipe(map((data: string) => data));
  }

  public addModel(model) {
    return this.http
      .put(
        `${this.apiAgent}agent/Model`,
        this.encrypt128(this.key, JSON.stringify(model)),
        {
          headers: this.getHeader(),
          responseType: "text",
        }
      )
      .pipe(map((data: string) => data));
  }

  public GetWindowUpdateList(ID, datas) {
    const data = {
      AssetID: ID,
      Value: JSON.stringify(datas),
      MessageType: "InstallWindowsUpdates",
    };

    if (this.wsService.IsKafkaConnected) {
      this.http
        .post(this.apiurl + "sendMessageToKafka", data)
        .subscribe(() => { });
    } else {
      setTimeout(() => this.GetWindowUpdateList(ID, datas), 3000);
    }
  }

  public searchDeviceWithTag(data) {
    return this.http
      .post(
        `${this.apiAgent}agent/Asset/GetBySearch`,
        this.encrypt128(this.key, JSON.stringify(data)),
        { headers: this.getHeader(), responseType: "text" }
      )
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public servicePauseCommand(data: any) {
    if (this.wsService.IsKafkaConnected) {
      console.log("sending servicepause command:" + data.Value);
      this.http
        .post(this.apiurl + "sendMessageToKafka", data)
        .subscribe(() => { });
    } else {
      setTimeout(() => this.servicePauseCommand(data), 3000);
    }
  }

  public serviceRestartCommand(data: any) {
    if (this.wsService.IsKafkaConnected) {
      console.log("sending servicerestart command:" + data.Value);
      this.http
        .post(this.apiurl + "sendMessageToKafka", data)
        .subscribe(() => { });
    } else {
      setTimeout(() => this.serviceRestartCommand(data), 3000);
    }
  }

  public serviceStartCommand(data: any) {
    if (this.wsService.IsKafkaConnected) {
      console.log("sending servicestart command:" + data.Value);
      this.http
        .post(this.apiurl + "sendMessageToKafka", data)
        .subscribe(() => { });
    } else {
      setTimeout(() => this.serviceStartCommand(data), 3000);
    }
  }

  public getDeviceDiskDriveByGuid(companyGuid) {
    return this.http
      .get(`${this.apiAgent}report/DeviceDiskDrive/${companyGuid}`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public getDeviceProcessorRamByGuid(companyGuid) {
    return this.http
      .get(`${this.apiAgent}report/DeviceProcessorRam/${companyGuid}`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public getDeviceDeploymentWarrantyByGuid(companyGuid) {
    return this.http
      .get(`${this.apiAgent}report/DeviceDeploymentWarranty/${companyGuid}`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public getDeviceDeploymentWarranty() {
    return this.http
      .get(`${this.apiAgent}report/DeviceDeploymentWarranty`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public getDeviceNetworkAdapterByGuid(companyGuid) {
    return this.http
      .get(`${this.apiAgent}report/DeviceNetworkAdapter/${companyGuid}`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public getHardwareSummaryByGuid(companyGuid) {
    return this.http
      .get(`${this.apiAgent}report/DeviceHardwareSummary/${companyGuid}`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }
  public getDeviceNetworkAdapter() {
    return this.http
      .get(`${this.apiAgent}report/DeviceNetworkAdapter`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public getHardwareSummary() {
    return this.http
      .get(`${this.apiAgent}report/DeviceHardwareSummary`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public getDeviceNetworkDetailByGuid(companyGuid) {
    return this.http
      .get(`${this.apiAgent}report/DeviceNetworkDetailed/${companyGuid}`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public getDeviceNetworkDetail() {
    return this.http
      .get(`${this.apiAgent}report/DeviceNetworkDetailed`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public getDeviceNetworkIPByGuid(companyGuid) {
    return this.http
      .get(`${this.apiAgent}report/DeviceNetworkIP/${companyGuid}`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public getDeviceNetworkIP() {
    return this.http
      .get(`${this.apiAgent}report/DeviceNetworkIP`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public getDeviceAntivirusByGuid(companyGuid) {
    return this.http
      .get(`${this.apiAgent}report/DeviceAntivirus/${companyGuid}`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public getDeviceAntivirus() {
    return this.http
      .get(`${this.apiAgent}report/DeviceAntivirus`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public getDeviceWarrantyByGuid(companyGuid) {
    return this.http
      .get(`${this.apiAgent}report/DeviceWarranty/${companyGuid}`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public getDeviceWarranty() {
    return this.http
      .get(`${this.apiAgent}report/DeviceWarranty`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public getDeviceSummaryByGuid(companyGuid) {
    return this.http
      .get(`${this.apiAgent}report/DeviceSummary/${companyGuid}`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public getDeviceSummary() {
    return this.http
      .get(`${this.apiAgent}report/DeviceSummary`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public getDeviceIpSummaryByGuid(companyGuid) {
    return this.http
      .get(`${this.apiAgent}report/DeviceIPSummary/${companyGuid}`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public getDeviceIpSummary() {
    return this.http
      .get(`${this.apiAgent}report/DeviceIPSummary`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public getDeviceProcessorRam() {
    return this.http
      .get(`${this.apiAgent}report/DeviceProcessorRam`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public getDeviceDiskDrive() {
    return this.http
      .get(`${this.apiAgent}report/DeviceDiskDrive`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public getCompanyApplicationByGuid(companyGuid) {
    return this.http
      .get(`${this.apiAgent}report/CompanyApplication/${companyGuid}`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public getCompanyApplications() {
    return this.http
      .get(`${this.apiAgent}report/CompanyApplication`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public getCompanyApplication() {
    return this.http
      .get(`${this.apiAgent}report/CompanyApplication`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public UninstallAgent(assetId) {
    const data = {
      AssetID: assetId,
      MessageType: "UninstallAgent",
    };

    if (this.wsService.IsKafkaConnected) {
      console.log("sending UninstallAgent command:" + data.MessageType);
      this.http
        .post(this.apiurl + "sendMessageToKafka", data)
        .subscribe(() => { });
    } else {
      setTimeout(() => this.UninstallAgent(assetId), 3000);
    }
  }
  public TerminalShellCommand(data: any) {
    if (this.wsService.IsKafkaConnected) {
      console.log("sending terminal command:" + data.Value);
      this.http
        .post(this.apiurl + "sendMessageToKafka", data)
        .subscribe(() => { });
    } else {
      setTimeout(() => this.TerminalShellCommand(data), 3000);
    }
  }

  public getHardwareTypeByTechCompanyGuid(guid) {
    return this.http
      .get(`${this.apiAgent}agent/HardwareType/${guid}`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public getHardwareTypeAssetByTechCompanyGuidAndHardwareType(techCompanyGuid,hardwareTypeId) {
    return this.http
      .get(`${this.apiAgent}agent/HardwareType/GetAssetsByTechCompanyGuidAndHardwareTypeID?techCompanyGuid=${techCompanyGuid}&hardwareTypeID=${hardwareTypeId}`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public getManufacturerAssetByTechCompanyGuidAndManufacturer(techCompanyGuid,manufacturerId) {
    return this.http
      .get(`${this.apiAgent}agent/Manufacturer/GetAssetsByTechCompanyGuidAndManufacturerID?techCompanyGuid=${techCompanyGuid}&manufacturerID=${manufacturerId}`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public getModelAssetByTechCompanyGuidAndModel(techCompanyGuid,modelId) {
    return this.http
      .get(`${this.apiAgent}agent/Model/GetAssetsByTechCompanyGuidAndModelID?techCompanyGuid=${techCompanyGuid}&modelId=${modelId}`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public getGraphicsCard(asset_id) {
    return this.http
      .get(`${this.apiAgent}agent/VideoController/${asset_id}`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public getPointingDevice(asset_id) {
    return this.http
      .get(`${this.apiAgent}agent/PointingDevice/${asset_id}`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public getDesktopMonitor(asset_id) {
    return this.http
      .get(`${this.apiAgent}agent/DesktopMonitor/${asset_id}`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public getComputer(asset_id) {
    return this.http
      .get(`${this.apiAgent}agent/Asset/${asset_id}`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public getMotherBoard(asset_id) {
    return this.http
      .get(`${this.apiAgent}agent/Motherboard/${asset_id}`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public getBios(asset_id) {
    return this.http
      .get(`${this.apiAgent}agent/BIOS/${asset_id}`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public getProcessor(asset_id) {
    return this.http
      .get(`${this.apiAgent}agent/Processor/${asset_id}`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }
  public getPhysicalMemory(asset_id) {
    return this.http
      .get(`${this.apiAgent}agent/PhysicalMemory/${asset_id}`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }
  public getNetworkAdapter(asset_id) {
    return this.http
      .get(`${this.apiAgent}agent/NetworkAdapter/${asset_id}`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }
  public getHardDisk(asset_id) {
    return this.http
      .get(`${this.apiAgent}agent/DiskDrive/${asset_id}`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }
  public getKeyboard(asset_id) {
    return this.http
      .get(`${this.apiAgent}agent/Keyboard/${asset_id}`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }
  public getsoundCard(asset_id) {
    return this.http
      .get(`${this.apiAgent}agent/SoundDevice/${asset_id}`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public getOperatingSystem(asset_id) {
    return this.http
      .get(`${this.apiAgent}agent/OperatingSystem/${asset_id}`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public GetCurrentConfig(asset_ID) {
    const data = {
      AssetID: asset_ID,
      MessageType: "GetCurrentConfig",
    };

    if (this.wsService.IsKafkaConnected) {
      this.http
        .post(this.apiurl + "sendMessageToKafka", data)
        .subscribe(() => { });
    } else {
      setTimeout(() => this.GetCurrentConfig(asset_ID), 3000);
    }
  }

  public GetDeviceListConfig(asset_ID) {
    const data = {
      AssetID: asset_ID,
      MessageType: "GetDeviceListConfig",
    };

    if (this.wsService.IsKafkaConnected) {
      this.http
        .post(this.apiurl + "sendMessageToKafka", data)
        .subscribe(() => { });
    } else {
      setTimeout(() => this.GetDeviceListConfig(asset_ID), 3000);
    }
  }

  public SendPowerShellCommand(data: any) {
    if (this.wsService.IsKafkaConnected) {
      console.log("sending powershell command:" + data.Value);
      this.http
        .post(this.apiurl + "sendMessageToKafka", data)
        .subscribe(() => { });
    } else {
      setTimeout(() => this.SendPowerShellCommand(data), 3000);
    }
  }

  public SendNetworkCommand(data: any) {
    if (this.wsService.IsKafkaConnected) {
      console.log("sending network command:" + data);
      this.http
        .post(this.apiurl + "sendMessageToKafka", data)
        .subscribe(() => { });
    } else {
      setTimeout(() => this.SendNetworkCommand(data), 3000);
    }
  }

  public SendSetMasterAgent(data: any) {
    if (this.wsService.IsKafkaConnected) {
      console.log("sending network command:" + data);
      this.http
        .post(this.apiurl + "sendMessageToKafka", data)
        .subscribe(() => { });
    } else {
      setTimeout(() => this.SendNetworkCommand(data), 3000);
    }
  }

  public addNewTag(Tag) {
    return this.http
      .put(
        `${this.apiAgent}agent/Tag`,
        this.encrypt128(this.key, JSON.stringify(Tag)),
        { headers: this.getHeader(), responseType: "text" }
      )
      .pipe(map((data: string) => data));
  }

  public deleteSoftware(data) {
    const httpOptions = {
      headers: this.getHeader(),
      body: this.encrypt128(this.key, JSON.stringify(data)),
    };
    return this.http
      .delete(`${this.apiAgent}agent/SoftwareItem`, httpOptions)
      .pipe(map((data: string) => data));
  }

  public getSoftwareListByAssetId(asset_id) {
    return this.http
      .get(`${this.apiAgent}agent/SoftwareItem/${asset_id}`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public deleteHardwareType(data) {
    return this.http
      .post(
        `${this.apiAgent}agent/HardwareType`,
        this.encrypt128(this.key, JSON.stringify(data)),
        { headers: this.getHeader(), responseType: "text" }
      )
      .pipe(map((data: string) => data));
  }

  public deleteManufacturer(data) {
    return this.http
      .post(
        `${this.apiAgent}agent/Manufacturer`,
        this.encrypt128(this.key, JSON.stringify(data)),
        { headers: this.getHeader(), responseType: "text" }
      )
      .pipe(map((data: string) => data));
  }

  public deleteModel(data) {
    return this.http
      .post(
        `${this.apiAgent}agent/Model`,
        this.encrypt128(this.key, JSON.stringify(data)),
        { headers: this.getHeader(), responseType: "text" }
      )
      .pipe(map((data: string) => data));
  }

  public overrideAsset(data) {
    return this.http
      .post(
        `${this.apiAgent}agent/Asset`,
        this.encrypt128(this.key, JSON.stringify(data)),
        { headers: this.getHeader(), responseType: "text" }
      )
      .pipe(map((data: string) => data));
  }

  public overrideOperationSystem(system) {
    return this.http
      .post(
        `${this.apiAgent}agent/OperatingSystem`,
        this.encrypt128(this.key, JSON.stringify(system)),
        {
          headers: this.getHeader(),
          responseType: "text",
        }
      )
      .pipe(map((data: string) => data));
  }

  public overrideAssetNotes(notes) {
    delete notes.CreateDate;
    return this.http
      .post(
        `${this.apiAgent}agent/AssetNote`,
        this.encrypt128(this.key, JSON.stringify(notes)),
        {
          headers: this.getHeader(),
          responseType: "text",
        }
      )
      .pipe(map((data: string) => data));
  }

  public screenConnect(sconnect) {
    return this.http
    .post(
      `${this.apiAgent}agent/ScreenConnect`,
      this.encrypt128(this.key, JSON.stringify(sconnect)),
      {
        headers: this.getHeader(),
        responseType: "text",
      }
    )
    .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public addAssetNotes(notes) {
    return this.http
      .put(
        `${this.apiAgent}agent/AssetNote`,
        this.encrypt128(this.key, JSON.stringify(notes)),
        {
          headers: this.getHeader(),
          responseType: "text",
        }
      )
      .pipe(map((data: string) => data));
  }

  public getAssetNotes(asset_id) {
    return this.http
      .get(`${this.apiAgent}agent/AssetNote/${asset_id}`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public addAssetTag(tag) {
    return this.http
      .put(
        `${this.apiAgent}agent/Tag`,
        this.encrypt128(this.key, JSON.stringify(tag)),
        {
          headers: this.getHeader(),
          responseType: "text",
        }
      )
      .pipe(map((data: string) => data));
  }

  public removeAssetTag(tag) {
    const httpOptions = {
      headers: this.getHeader(),
      body: this.encrypt128(this.key, JSON.stringify(tag)),
    };
    return this.http
      .delete(`${this.apiAgent}agent/Tag`, httpOptions)
      .pipe(map((data: string) => data));
  }

  public removeManufactur(data) {
    const httpOptions = {
      headers: this.getHeader(),
      body: this.encrypt128(this.key, JSON.stringify(data)),
    };
    return this.http
      .delete(`${this.apiAgent}agent/Manufacturer`, httpOptions)
      .pipe(map((data: string) => data));
  }

  public getAssetTag() {
    return this.http
      .get(`${this.apiAgent}agent/Tag`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public getAssetTagByAssetId(asset_id) {
    return this.http
      .get(`${this.apiAgent}agent/Tag/${asset_id}`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public getOperatingSystemByAssetId(asset_id) {
    return this.http
      .get(`${this.apiAgent}agent/OperatingSystem/${asset_id}`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public getAssetByGuid(Guid) {
    return this.http
      .get(`${this.apiAgent}agent/Asset/GUID/${Guid}`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public getDiskDriveByAssetId(asset_id) {
    return this.http
      .get(`${this.apiAgent}agent/DiskDrive/${asset_id}`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public getAssetsByCompanyId(companyGuid) {

    return this.http
      .get(`${this.apiAgent}agent/Asset/Company/${companyGuid}`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public getManufactures(guid) {
    return this.http
      .get(`${this.apiAgent}agent/Manufacturer/GetByTechCompanyGuid?TechCompanyGuid=${guid}`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public getModels(guid) {
    return this.http
      .get(`${this.apiAgent}agent/Model/GetByTechCompanyGuid?TechCompanyGuid=${guid}`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public getModelsByManufacturer(id: any) {
    return this.http
      .get(`${this.apiAgent}agent/Model/GetByManufacturerID?ManufacturerID=${id}`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }
  public getAgentToken(UserName, Password) {
    return this.http
      .post(
        `${this.apiAgent}agent/token/login`,
        this.encrypt128(
          this.key,
          JSON.stringify({
            UserName: UserName,
            Password: Password,
          })
        ),
        { headers: this.getHeader(), responseType: "text" }
      )
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public GetService(asset_ID) {
    const data = {
      AssetID: asset_ID,
      MessageType: "GetServices",
    };

    if (this.wsService.IsKafkaConnected) {
      this.http
        .post(this.apiurl + "sendMessageToKafka", data)
        .subscribe(() => { });
    } else {
      setTimeout(() => this.GetService(asset_ID), 3000);
    }
  }

  public GetProcesses(asset_ID) {
    const data = {
      AssetID: asset_ID,
      MessageType: "GetProcesses",
    };

    if (this.wsService.IsKafkaConnected) {
      this.http
        .post(this.apiurl + "sendMessageToKafka", data)
        .subscribe(() => { });
    } else {
      setTimeout(() => this.GetProcesses(asset_ID), 3000);
    }
  }

  public KillProcesses(asset_ID, Process_ID) {
    const data = {
      AssetID: asset_ID,
      MessageType: "KillProcess",
      Value: Process_ID
    };

    if (this.wsService.IsKafkaConnected) {
      this.http
        .post(this.apiurl + "sendMessageToKafka", data)
        .subscribe(() => { });
    } else {
      setTimeout(() => this.KillProcesses(asset_ID, Process_ID), 3000);
    }
  }

  public GetStartupPrograms(asset_ID) {
    const data = {
      AssetID: asset_ID,
      MessageType: "GetStartupPrograms",
    };

    if (this.wsService.IsKafkaConnected) {
      this.http
        .post(this.apiurl + "sendMessageToKafka", data)
        .subscribe(() => { });
    } else {
      setTimeout(() => this.GetStartupPrograms(asset_ID), 3000);
    }
  }

  public createAssetSearch(data) {
    return this.http
      .put(
        `${this.apiAgent}agent/AssetSearch`,
        this.encrypt128(this.key, JSON.stringify(data)),
        { headers: this.getHeader(), responseType: "text" }
      )
      .pipe(map((data: string) => data));
  }

  public getByTechCompany(techCompanyId) {
    return this.http
      .get(`${this.apiAgent}agent/AssetSearch/GetByTechCompany?techCompanyGuid=${techCompanyId}`, {
        headers: this.getHeader(),
        responseType: "text",
      })
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }    

  public autoCompleteDevices(data) {
    return this.http
      .post(
        `${this.apiAgent}agent/AssociatedAsset/Search`,
        this.encrypt128(this.key, JSON.stringify(data)),
        { headers: this.getHeader(), responseType: "text" }
      )
      .pipe(map((data: string) => this.decrypt128(data, this.key)));
  }

  public createAssociatedAsset(data){
    return this.http
      .put(
        `${this.apiAgent}agent/AssociatedAsset`,
        this.encrypt128(this.key, JSON.stringify(data)),
        { headers: this.getHeader(), responseType: "text" }
      )
      .pipe(map((data: string) => data));
  }
  
}
