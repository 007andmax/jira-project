import { Injectable } from '@angular/core';

@Injectable()
export class CompanyNetworkScanService {

  constructor() { }
  public getStatusText(device) {
    if (device.agentStatus === 'managed') {
      return 'Managed';
    } else if (device.agentStatus === 'Installed') {
      return 'Installed';
    } else if (device.agentStatus === 'Install error') {
      return 'Install error';
    } else if (device.agentStatus === 'ErrorInitialization') {
      return 'Error Initialization';
    } else if (device.agentStatus === 'Bad password') {
      return 'Bad password';
    } else if (device.agentStatus === 'Installing') {
      return '';
    } else if (device.agentStatus === 'init') {
      return 'Copy install files'
    } else if (device.agentStatus === 'Blocked') {
      return 'Blocked';
    } else if (device.agentStatus === 'ErrorUac') {
      return 'Error Uac';
    } else {
      return '';
    }
  }
  public onFilterName(devices) {
    devices.sort((a, b) => (this.getNameDevice(a).toLowerCase() > this.getNameDevice(b).toLowerCase()) ?
      1 : ((this.getNameDevice(b).toLowerCase() > this.getNameDevice(a).toLowerCase()) ? -1 : 0));
  }
  private getNameDevice(device) {
    return device.label || device.hostName || device.ip
  }
}
