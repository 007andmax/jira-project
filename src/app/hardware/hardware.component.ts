import { Component, OnInit } from '@angular/core';
import { HardwareService } from './../_services/hardware.service';
import { DeviceDetailService } from './../_services/device_detail.service';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { CommonHttpServices } from '../_services/common_http.service';
import { CommonServices } from '../_services/common.service';
import { CONFIGCONSTANTS } from '../config/app-constants';

@Component({
  selector: 'app-hardware',
  templateUrl: './hardware.component.html',
  styleUrls: ['./hardware.component.scss']
})
export class HardwareComponent implements OnInit {
  
  companyUuid: string = '';
  hardwareDetail: any ={};
  system: any = {};
  graphics: any = {};
  motherBoard: any = {};
  bios: any = {};
  processor: any = {};
  display: any = {};
  logicalDisks: any = {};
  memory: any = {};
  networkAdapters: any = {};
  processors: any = {};
  deviceName: string = '';
  externalIp: string = '';
  deviceDetail: any = {};
  masonryImages;
  loading = false;
	limit = 15;
	dummyPictures = [
		{
			picture: 'https://source.unsplash.com/433x649/?Uruguay'
		},
		{
			picture: 'https://source.unsplash.com/530x572/?Jamaica'
		},
		{
			picture: 'https://source.unsplash.com/531x430/?Kuwait'
		},
		{
			picture: 'https://source.unsplash.com/586x1073/?Bermuda'
		},
		{
			picture: 'https://source.unsplash.com/500x571/?Ecuador'
		},
		{
			picture: 'https://source.unsplash.com/579x518/?Virgin Islands (British)'
		},
		{
			picture: 'https://source.unsplash.com/503x548/?Angola'
		},
		{
			picture: 'https://source.unsplash.com/511x630/?Mauritania'
		},
		{
			picture: 'https://source.unsplash.com/414x767/?Sri Lanka'
		},
		{
			picture: 'https://source.unsplash.com/443x704/?St. Helena'
		},
		{
			picture: 'https://source.unsplash.com/441x1145/?Namibia'
		},
		{
			picture: 'https://source.unsplash.com/491x1097/?Samoa'
		},
		{
			picture: 'https://source.unsplash.com/570x851/?Eritrea'
		},
		{
			picture: 'https://source.unsplash.com/560x1072/?Iraq'
		},
		{
			picture: 'https://source.unsplash.com/551x598/?Togo'
		},
		{
			picture: 'https://source.unsplash.com/518x813/?Romania'
		},
		{
			picture: 'https://source.unsplash.com/497x524/?Kenya'
		},
		{
			picture: 'https://source.unsplash.com/549x826/?Martinique'
		},
		{
			picture: 'https://source.unsplash.com/559x627/?Tokelau'
		},
		{
			picture: 'https://source.unsplash.com/594x513/?Belize'
		},
		{
			picture: 'https://source.unsplash.com/480x1181/?Virgin Islands (US)'
		},
		{
			picture: 'https://source.unsplash.com/526x552/?Chile'
		},
		{
			picture: 'https://source.unsplash.com/427x504/?Western Sahara'
		},
		{
			picture: 'https://source.unsplash.com/468x971/?St. Pierre and Miquelon'
		},
		{
			picture: 'https://source.unsplash.com/419x790/?Thailand'
		},
		{
			picture: 'https://source.unsplash.com/417x1125/?Myanmar'
		},
		{
			picture: 'https://source.unsplash.com/480x632/?Cocos (Keeling Islands)'
		},
		{
			picture: 'https://source.unsplash.com/416x900/?Belarus'
		},
		{
			picture: 'https://source.unsplash.com/408x837/?Panama'
		},
		{
			picture: 'https://source.unsplash.com/541x1021/?Slovak Republic'
		},
		{
			picture: 'https://source.unsplash.com/597x1107/?Malta'
		},
		{
			picture: 'https://source.unsplash.com/487x842/?Bahrain'
		},
		{
			picture: 'https://source.unsplash.com/403x904/?Somalia'
		},
		{
			picture: 'https://source.unsplash.com/544x515/?Morocco'
		},
		{
			picture: 'https://source.unsplash.com/577x1044/?Djibouti'
		},
		{
			picture: 'https://source.unsplash.com/404x437/?France, Metropolitan'
		},
		{
			picture: 'https://source.unsplash.com/482x1079/?Libya'
		},
		{
			picture: 'https://source.unsplash.com/473x887/?Bolivia'
		},
		{
			picture: 'https://source.unsplash.com/583x614/?Kazakhstan'
		},
		{
			picture: 'https://source.unsplash.com/592x838/?Guyana'
		},
		{
			picture: 'https://source.unsplash.com/422x731/?Switzerland'
		},
		{
			picture: 'https://source.unsplash.com/448x985/?Venezuela'
		},
		{
			picture: 'https://source.unsplash.com/494x936/?Uzbekistan'
		},
		{
			picture: 'https://source.unsplash.com/461x762/?Benin'
		},
		{
			picture: 'https://source.unsplash.com/550x676/?Palau'
		},
		{
			picture: 'https://source.unsplash.com/524x901/?Laos'
		},
		{
			picture: 'https://source.unsplash.com/594x1199/?French Southern Territories'
		},
		{
			picture: 'https://source.unsplash.com/557x662/?Malawi'
		},
		{
			picture: 'https://source.unsplash.com/428x1184/?Swaziland'
		},
		{
			picture: 'https://source.unsplash.com/433x631/?Lithuania'
		},
		{
			picture: 'https://source.unsplash.com/523x477/?Sweden'
		},
		{
			picture: 'https://source.unsplash.com/568x443/?Bahamas'
		},
		{
			picture: 'https://source.unsplash.com/434x448/?United Arab Emirates'
		},
		{
			picture: 'https://source.unsplash.com/566x740/?Puerto Rico'
		},
		{
			picture: 'https://source.unsplash.com/481x580/?Nicaragua'
		},
		{
			picture: 'https://source.unsplash.com/470x761/?Viet Nam'
		},
		{
			picture: 'https://source.unsplash.com/519x954/?Australia'
		},
		{
			picture: 'https://source.unsplash.com/405x1030/?Marshall Islands'
		},
		{
			picture: 'https://source.unsplash.com/587x1059/?Falkland Islands (Malvinas)'
		},
		{
			picture: 'https://source.unsplash.com/593x907/?Montserrat'
		},
		{
			picture: 'https://source.unsplash.com/462x729/?British Indian Ocean Territory'
		},
		{
			picture: 'https://source.unsplash.com/538x610/?Norway'
		},
		{
			picture: 'https://source.unsplash.com/506x1057/?Malaysia'
		},
		{
			picture: 'https://source.unsplash.com/588x756/?Anguilla'
		},
		{
			picture: 'https://source.unsplash.com/468x1047/?Senegal'
		},
		{
			picture: 'https://source.unsplash.com/574x498/?Zaire'
		},
		{
			picture: 'https://source.unsplash.com/594x635/?Ireland'
		},
		{
			picture: 'https://source.unsplash.com/448x759/?Nauru'
		},
		{
			picture: 'https://source.unsplash.com/540x619/?Mayotte'
		},
		{
			picture: 'https://source.unsplash.com/552x438/?Syria'
		},
		{
			picture: 'https://source.unsplash.com/563x759/?Ghana'
		},
		{
			picture: 'https://source.unsplash.com/569x1171/?Austria'
		},
		{
			picture: 'https://source.unsplash.com/581x657/?Macau'
		},
		{
			picture: 'https://source.unsplash.com/539x1013/?Mozambique'
		},
		{
			picture: 'https://source.unsplash.com/581x477/?Liechtenstein'
		},
		{
			picture: 'https://source.unsplash.com/495x589/?Saint Vincent and The Grenadines'
		},
		{
			picture: 'https://source.unsplash.com/579x680/?Brazil'
		},
		{
			picture: 'https://source.unsplash.com/467x642/?Turks and Caicos Islands'
		},
		{
			picture: 'https://source.unsplash.com/496x1186/?Italy'
		},
		{
			picture: 'https://source.unsplash.com/416x844/?Reunion'
		},
		{
			picture: 'https://source.unsplash.com/442x569/?Sierra Leone'
		},
		{
			picture: 'https://source.unsplash.com/517x1084/?Northern Mariana Islands'
		},
		{
			picture: 'https://source.unsplash.com/431x1164/?Belgium'
		},
		{
			picture: 'https://source.unsplash.com/541x649/?Netherlands'
		},
		{
			picture: 'https://source.unsplash.com/491x902/?Korea (South)'
		},
		{
			picture: 'https://source.unsplash.com/534x778/?Guinea'
		},
		{
			picture: 'https://source.unsplash.com/528x933/?Tunisia'
		},
		{
			picture: 'https://source.unsplash.com/441x609/?Tonga'
		},
		{
			picture: 'https://source.unsplash.com/469x1060/?Equatorial Guinea'
		},
		{
			picture: 'https://source.unsplash.com/588x794/?S. Georgia and S. Sandwich Isls.'
		},
		{
			picture: 'https://source.unsplash.com/536x1103/?Algeria'
		},
		{
			picture: 'https://source.unsplash.com/541x821/?Israel'
		},
		{
			picture: 'https://source.unsplash.com/414x541/?Bulgaria'
		},
		{
			picture: 'https://source.unsplash.com/477x879/?Turkmenistan'
		},
		{
			picture: 'https://source.unsplash.com/450x777/?Croatia (Hrvatska)'
		},
		{
			picture: 'https://source.unsplash.com/528x978/?Cook Islands'
		},
		{
			picture: 'https://source.unsplash.com/521x686/?Solomon Islands'
		},
		{
			picture: 'https://source.unsplash.com/550x432/?Bosnia and Herzegovina'
		},
		{
			picture: 'https://source.unsplash.com/540x631/?Tanzania'
		},
		{
			picture: 'https://source.unsplash.com/594x443/?Chad'
		}
	];
  DateTimeFormat = CONFIGCONSTANTS.DateTimeFormat;
  constructor(private hardwareService: HardwareService, private toastr: ToastrService,
				 private commonHttpServices: CommonHttpServices, private commonServices: CommonServices,
				 private deviceDetailService: DeviceDetailService) {}

  ngOnInit() {
	this.deviceDetail = JSON.parse(localStorage.getItem('deviceDetail'));
	this.hardwareDetail = this.deviceDetailService.getDevice();
	if (Object.keys(this.hardwareDetail).length === 0) {
		this.getDeviceDetail();
	} else {
		this.setData();
	}
	
  }

  getDeviceDetail() {
	
    this.loading = true;
    this.hardwareService.getAllHardwareList(localStorage.getItem('company_id'), this.deviceDetail.agentId)
    .pipe(first())
    .subscribe(
      resp => {
        this.deviceDetailService.addDevice(resp);
		this.hardwareDetail = this.deviceDetailService.getDevice();
		this.setData();
        this.loading = false;
      },
      error => {
      this.loading = false;
      this.toastr.error('Something went wrong please try again.');
      }
    );
  }

  setData () {
	this.system = this.hardwareDetail.reports[0].system;
	this.deviceName = this.hardwareDetail.reports[0].deviceName;
	this.graphics = this.hardwareDetail.reports[0].videoCards[0];
	this.motherBoard = this.hardwareDetail.reports[0].motherboard;
	this.bios = this.hardwareDetail.reports[0].bios;
	this.display = this.hardwareDetail.reports[0].monitors[0];
	this.logicalDisks = this.hardwareDetail.reports[0].logicalDisks.filter(value => value.is_system === true)[0];
	this.processors = this.hardwareDetail.reports[0].processors[0];
	this.memory = this.hardwareDetail.reports[0].ram.slots[0];
	this.networkAdapters = this.hardwareDetail.reports[0].networkAdapters.filter(value => value.ip_enabled === true)[0];
	this.externalIp = this.hardwareDetail.reports[0].externalIp;
  }

}
