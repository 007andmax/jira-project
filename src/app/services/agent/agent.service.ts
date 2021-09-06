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
  public constructor(private http: HttpClient) {}

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

  public KafkaList() {
    const data = {
      AssetID: 1,
      MessageType: "Ack",
    };
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
