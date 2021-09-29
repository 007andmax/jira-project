import { WebsocketService } from 'src/app/services/websocket/websocket.service';
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
  public constructor(private http: HttpClient, private wsService: WebsocketService) { }

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
      this.http.post(this.apiurl + "sendMessageToKafka", data).subscribe(() => { console.log("sent confing message: " + asset_ID) });
    }
    else {
      setTimeout(() => this.GetCurrentConfig(asset_ID), 3000);
    }
  }

  public SendPowerShellCommand(data: any) {
    return this.http.post(this.apiurl + "sendMessageToKafka", data);
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
}
