import { EventEmitter, Injectable } from '@angular/core';
import { NetworkScanCredential } from '../../components/company-network-scan/class/network-scan-credential';

@Injectable({
  providedIn: 'root'
})
export class NetworkScanStateService {
  credentialForRemove: NetworkScanCredential = null;
  onOpenAside: EventEmitter<any> = new EventEmitter();
  constructor() { }

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
