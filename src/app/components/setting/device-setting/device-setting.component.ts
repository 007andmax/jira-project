import { CompanyTagsStateService } from 'src/app/components/companies/company-tags/states/company-tags-state.service';
import { Component, OnInit, Pipe } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { param } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { AgentService } from 'src/app/services/agent/agent.service';
import { SettingStateService } from 'src/app/states/setting/setting-state.service';
import { DeviceFilter } from '../../devices/class/devices';
import { CommissionService } from '../commission/commission.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';

@Component({
  selector: 'device-setting',
  templateUrl: './device-setting.component.html',
  styleUrls: ['./device-setting.component.scss']
})
export class DeviceSettingComponent implements OnInit {
  devicebutton: boolean = false;
  manufacturebutton: boolean;
  modelbutton: boolean;
  hardwareTypes: any[] = [];
  companyId: any;
  techCompany: any;
  deviceType: any;
  popup: boolean;
  loading = false;
  create = false;
  deviceForm: FormGroup;
  submitted = false;
  selectedIdx = -1;
  Name: string;
  manufactureForm: FormGroup;
  manufacturerList: any[] = [];
  modelForm: FormGroup;
  modelList: any[] = [];
  filter: DeviceFilter = new DeviceFilter();

  constructor(private settingStateService: SettingStateService,
    private agentService: AgentService,
    private commissionService: CommissionService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private companyStateService: CompaniesStateService) { }

  ngOnInit() {
    this.devicebutton = true;
    $('body').addClass('ng7');
    $('body').removeClass('backMenu');

    this.deviceForm = this.formBuilder.group({
      Name: [
        "",
        [Validators.required, Validators.minLength(2), Validators.maxLength(30)]
      ],
      ID: [""],
      TechCompanyID: [""],
      TechCompanyGuid: [""],

    });

    this.manufactureForm = this.formBuilder.group({
      Name: [
        "",
        [Validators.required, Validators.minLength(2), Validators.maxLength(30)]
      ],
      ID: [""],
      TechCompanyID: [""],
      TechCompanyGuid: [""],
    })

    this.modelForm = this.formBuilder.group({
      Name: [
        "",
        [Validators.required, Validators.minLength(2), Validators.maxLength(30)]
      ],
      ID: [""]
    })
    this.settingStateService.setComponentName('DeviceSettingComponent');
    this.getCurrentCompany();
  }

  onFilter(field) {
    this.filter.onFilter(field, this.hardwareTypes);
  }

  toggle(evt: any) {
    if (evt.nextId == "tab1") {
      this.devicebutton = true;
    }
    else {
      this.devicebutton = false
    }

    if (evt.nextId == "tab2") {
      this.manufacturebutton = true;
    }
    else {
      this.manufacturebutton = false
    }

    if (evt.nextId == "tab3") {
      this.modelbutton = true;
    }
    else {
      this.modelbutton = false
    }
  }

  getCurrentCompany(): any {
    this.companyStateService.onCurrentCompany.subscribe((data: any)=> {
      this.techCompany = data;      
      this.getDeviceTypes(this.techCompany.id);
      this.getManufacturers(this.techCompany.id);
      this.getModels(this.techCompany.id);
    });    
  }

  getManufacturers(TechCompanyGuid: any) {
    if(this.agentService.AccessToken == '') {
      setTimeout(() => {
        this.getManufacturers(TechCompanyGuid);
      }, 300);
      return;
    }
    this.agentService.getManufactures(TechCompanyGuid)
      .subscribe((resp) => {
        this.manufacturerList = resp;
      });
  }

  getDeviceTypes(TechCompanyGuid: any) {
    if(this.agentService.AccessToken == '') {
      setTimeout(() => {
        this.getDeviceTypes(TechCompanyGuid);
      }, 300);
      return;
    }
    this.agentService
      .getHardwareTypeByTechCompanyGuid(TechCompanyGuid)
      .subscribe((resp) => {
        this.hardwareTypes = resp;
      });
  }

  getModels(TechCompanyGuid: any) {
    if(this.agentService.AccessToken == '') {
      setTimeout(() => {
        this.getModels(TechCompanyGuid);
      }, 300);
      return;
    }
    this.agentService
      .getModels(TechCompanyGuid)
      .subscribe((resp) => {
        this.modelList = resp;
      });
  }


  openModel(isCreated: boolean, index: number, device: any) {
    this.submitted = false;
    this.deviceForm.reset();
    this.create = isCreated;


    this.selectedIdx = index;
    this.deviceForm.patchValue({
      ID: device.Id,
      Name: device.Name,
      TechCompanyID: device.TechCompanyID,
      TechCompanyGuid: this.companyId
    });
  }

  get f() {
    return this.deviceForm.controls;
  }


  onSubmit() {
    this.submitted = true;

    // add
    this.loading = true; $(".loading").css("display", "block");
    this.agentService.addHardwareType(this.deviceForm.value)
      .pipe(
        map((res: any) => {
          this.loading = false; $(".loading").css("display", "none");
          this.hardwareTypes.push(res);
          this.create = false;
        })
      )
      .subscribe(
        () => {
          this.toastrService.success("Device Type Saved Successfully");
          this.getCurrentCompany()
        },
        error => {
          this.loading = false; $(".loading").css("display", "none");
        }
      );

  }

  removeConfirm(deviceType: any) {
    this.deviceType = deviceType;
    this.popup = true;
  }


  removeDeviceType() {
    this.loading = true; $(".loading").css("display", "block");
    this.deviceType.IsActive = false;

    this.agentService
      .deleteHardwareType(this.deviceType)
      .subscribe((resp) => {
        this.toastrService.success(`${this.deviceType.Name} is Deleted Successfully.`);
      }, (error) => {
        this.toastrService.error("Something went wrong please try again.");
      });
  }


  openModelManufacture(isCreated: boolean, index: number, manufacture: any) {
    this.submitted = false;
    this.manufactureForm.reset();
    this.create = isCreated;


    this.selectedIdx = index;
    this.manufactureForm.patchValue({
      ID: manufacture.Id,
      Name: manufacture.Name,
      TechCompanyID: manufacture.TechCompanyID,
      TechCompanyGuid: this.companyId
    });
  }

  onSubmitManufacturer() {
    this.submitted = true;

    // add
    this.loading = true; $(".loading").css("display", "block");
    this.agentService.addManufacturer(this.manufactureForm.value)
      .pipe(
        map((res: any) => {
          this.loading = false; $(".loading").css("display", "none");
          this.manufacturerList.push(res);
          this.create = false;
        })
      )
      .subscribe(
        () => {
          this.toastrService.success("Manufacturer Saved Successfully");
          this.getCurrentCompany()
        },
        error => {
          this.loading = false; $(".loading").css("display", "none");
        }
      );
    console.log(this.manufacturerList)
  }

  get f1() {
    return this.manufactureForm.controls;
  }

  openModelPopup(isCreated: boolean, index: number, model: any) {
    this.submitted = false;
    this.modelForm.reset();
    this.create = isCreated;


    this.selectedIdx = index;
    this.modelForm.patchValue({
      ID: model.Id,
      Name: model.Name,
    });
  }

  get f2() {
    return this.modelForm.controls;
  }

  SaveModel() {
    this.submitted = true;

    // add
    this.loading = true; $(".loading").css("display", "block");
    this.agentService.addModel(this.modelForm.value)
      .pipe(
        map((res: any) => {
          this.loading = false; $(".loading").css("display", "none");
          this.modelList.push(res);
          this.create = false;
        })
      )
      .subscribe(
        () => {
          this.toastrService.success("Model Saved Successfully");
        },
        error => {
          this.loading = false; $(".loading").css("display", "none");
        }
      );
  }
}
