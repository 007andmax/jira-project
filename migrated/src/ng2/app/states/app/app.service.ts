import { Injectable, EventEmitter } from '@angular/core';
import * as $ from 'jquery';
@Injectable({
  providedIn: 'root'
})
export class AppService {
  isMobile: boolean = false;
  isInit: boolean = false;
  onMobile: EventEmitter<any> = new EventEmitter();
  init: EventEmitter<any> = new EventEmitter();
  onLockScreen: EventEmitter<any> = new EventEmitter();
  constructor() { }
  public onInit() {
    this.isInit = true;
    this.init.emit(null);

  }
  public showLockScreen () {
    this.onLockScreen.emit(null);
  }
  public getOnInit() {
    return this.init;
  }
  public getIsInit() {
    return this.isInit;
  }
  public checkMobile() {
    return this.isMobile;
  }
  public getOnMobile() {
    return this.onMobile;
  }

  public setMobile(data) {
    this.isMobile = data;
    this.onMobile.emit(data);
  }
  public downloadByUrl(url, fileName) {
    let isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    let isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;
    let isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

    const indexOfDot = fileName && fileName.lastIndexOf('.');
    const fileFormat = fileName && fileName.substring(indexOfDot);
    //iOS devices do not support downloading. We have to inform user about this.
    if (/(iP)/g.test(navigator.userAgent)) {
      alert('Your device does not support files downloading. Please try again in desktop browser.');
      return false;
    }



    //If in Chrome or Safari - download via virtual link click
    if (isChrome || isFirefox) {
      //Creating new link node.
      let indexOf = url.indexOf('.com');
      let shortUrl = url.slice(url.indexOf('.com') + 4);

      if (indexOf !== -1) {
        return this.redownload(url, fileName, true) && this.redownload(shortUrl, fileName);
      } else {

        //   return redownload(url);
        if (fileFormat === '.pdf' || fileFormat === '.html') {

          return this.redownload((url + fileFormat), fileName, true);
        } else {

          return this.redownload((url + fileFormat), fileName);
        }
      }

    } else if (isSafari) {
      $("#pdf").remove();
      $("body").append("<iframe id='pdf' style='display:none;'></iframe>");
      (<any>document.getElementById('pdf')).src = url;
      return;
    }

    // Force file download (whether supported by server).
    //            url += '?download';
    //todo fix bug with multiple files download
    window.open(url, '_blank');
    return true;
  }
  public download(url, fileName) {
    let link = document.createElement('a');
    link.target = "_blank";
    link.href = url;
    if (!fileName) {
      fileName = url.substring(url.lastIndexOf('/') + 1, url.length);
    }
    link.download = fileName;
    let e = document.createEvent('MouseEvents');
    e.initEvent('click', true, true);
    link.dispatchEvent(e);
  }
  private redownload(url, fileName, open = false) {
    let link = document.createElement('a');
    link.target = "_blank";
    link.href = url;
    if (link.download !== undefined) {
      if (!fileName) {
        fileName = url.substring(url.lastIndexOf('/') + 1, url.length);
      }
      if (!open) {
        link.download = fileName;
      }
    }
    if (document.createEvent) {
      let e = document.createEvent('MouseEvents');
      e.initEvent('click', true, true);
      link.dispatchEvent(e);
      return true;
    }
  }

  public onCheckMobile = () => {
    if (document.documentElement.clientWidth <= 414 && !this.checkMobile()) {
      this.setMobile(true);
    } else if (document.documentElement.clientWidth > 414 && this.checkMobile()) {
      this.setMobile(false);
    }
  }
}
