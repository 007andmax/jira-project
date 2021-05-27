import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
var aesjs = require('aes-js');
var pbkdf2 = require('pbkdf2');
var randomBytes = require('randombytes');
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class AgentService {

  private apiAgent = environment.apiAgent;
  key: string = 'DD2B2B8B6EAE91C7';
  INITIALIZATION_VECTOR: string = '0000000000000000';
  AccessToken: string = '';
  /**
   * Device api service constructor
   * @param {HttpClient} http Service to work with request
   */
  public constructor(
    private http: HttpClient,

  ) { }



  encrypt128(keys, value) {
    var key = CryptoJS.enc.Utf8.parse(keys);
    var iv = CryptoJS.enc.Hex.parse(this.INITIALIZATION_VECTOR);
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
      {
        keySize: 128 / 8,
        blockSize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
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
      padding: CryptoJS.pad.Pkcs7
    });

    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  }

  public setAccessToken(data) {
    this.AccessToken = data;
  }
  public getAssetsByCompanyId(companyGuid) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': '*/*',
      "authorization": `Bearer ${this.AccessToken}`
    });
    return this.http.get(`${this.apiAgent}agent/Asset/Company/${companyGuid}`, { headers: headers, responseType: 'text' }).pipe(map((data: string) => this.decrypt128(data, this.key)))
  }
  public getAgentToken(UserName, Password) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': '*/*'
    });
    return this.http.post(`${this.apiAgent}agent/token/login`, this.encrypt128(this.key, JSON.stringify({
      "UserName": UserName,
      "Password": Password
    })), { headers: headers, responseType: 'text' }).pipe(map((data: string) => this.decrypt128(data, this.key)))
  }
}
