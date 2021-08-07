import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { exhaustMap, map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import * as CryptoJS from "crypto-js";
import { json } from "d3";

@Injectable({
  providedIn: "root",
})
export class AgentService {
  private apiAgent = environment.apiAgent;
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

  public overrideAsset(data) {
    delete data.Version;
    delete data.Caption;
    return this.http
      .post(
        `${this.apiAgent}agent/Asset`,
        this.encrypt128(this.key, JSON.stringify(data)),
        { headers: this.getHeader(), responseType: "text" }
      )
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
