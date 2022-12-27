import { EventEmitter, Injectable } from '@angular/core';
import { NetworkScanCredential } from 'src/app/components/company-network-scan-beta/class/network-scan-credential';
import { NetworkScanDevice } from 'src/app/components/company-network-scan-beta/class/network-scan-device';

@Injectable({
  providedIn: 'root'
})
export class NetworkScanStateService {
  credentialForRemove: NetworkScanCredential = null;
  deviceForRemove: NetworkScanDevice = null;
  onOpenAside: EventEmitter<any> = new EventEmitter();
  constructor() { }

  public getDeviceForRemove() {
    return this.deviceForRemove;
  }
  public setDeviceForRemove(data) {
    this.deviceForRemove = data;
  }
  public getOnOpenAside() {
    return this.onOpenAside;
  }
  public openAside() {
    this.onOpenAside.emit(null);
  }
  public setCredentialForRemove(data) {
    this.credentialForRemove = data;
  }
  public getCredentialForRemove() {
    return this.credentialForRemove;
  }
}
