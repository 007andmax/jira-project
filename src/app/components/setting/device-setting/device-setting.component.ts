import { Component, OnInit, Pipe } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { param } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { AgentService } from 'src/app/services/agent/agent.service';
import { SettingStateService } from 'src/app/states/setting/setting-state.service';
import { DeviceFilter } from '../../devices/class/devices';
import { CommissionService } from '../commission/commission.service';

@Component({
  selector: 'device-setting',
  templateUrl: './device-setting.component.html',
  styleUrls: ['./device-setting.component.scss']
})
export class DeviceSettingComponent implements OnInit {
  templeteInfo: any;
  devicebutton : boolean = false;
  manufacturebutton:boolean;
  modelbutton : boolean;
  hardwareTypes: any[] = [];
  assetList: any[] = [];
  companyId: any;
  deviceType: any;
  popup: boolean;
  loading = false;
  create = false;
  deviceForm: FormGroup;
  submitted = false;
  selectedIdx = -1;
  Name : string;
  manufactureForm:FormGroup;
  manufacturerList : any[]=[];
  modelForm : FormGroup;
  modelList: any[]=[];
  filter: DeviceFilter = new DeviceFilter();

  constructor(private settingStateService: SettingStateService,
    private agentService: AgentService,
    private commissionService: CommissionService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.devicebutton = true;
    $('body').addClass('ng7');
    $('body').removeClass('backMenu');

    this.deviceForm = this.formBuilder.group({
      Name: [
        "",
        [Validators.required, Validators.minLength(2), Validators.maxLength(30)]
      ],
      ID :[""],
      TechCompanyID : [""],
      TechCompanyGuid :[""]

    });

    this.manufactureForm = this.formBuilder.group({
      Name: [
        "",
        [Validators.required, Validators.minLength(2), Validators.maxLength(30)]
      ],
      ID :[""]
    })

    this.modelForm = this.formBuilder.group({
      Name: [
        "",
        [Validators.required, Validators.minLength(2), Validators.maxLength(30)]
      ],
      ID :[""]
    })
    this.settingStateService.setComponentName('DeviceSettingComponent');
    this.getCurrentCompany();

  }

  onFilter(field) {
    this.filter.onFilter(field, this.hardwareTypes);
  }

  toggle(evt: any){
    if(evt.nextId == "tab1"){
      this.devicebutton = true;
    }
    else{
      this.devicebutton = false
    }

    if(evt.nextId == "tab2"){
      this.manufacturebutton = true;
    }
    else{
      this.manufacturebutton = false
    }

    if(evt.nextId == "tab3"){
      this.modelbutton = true;
    }
    else{
      this.modelbutton = false
    }
  }


  getCurrentCompany(): any {
    this.commissionService
      .getCurrentCompany()
      .pipe(map(res => res))
      .subscribe((res: any) => {
        this.companyId = res.id;
        this.Manufacture(this.companyId);
        this.HardwareTypeList(this.companyId);
      });
  }

  Manufacture(TechCompanyGuid: any){
    this.agentService.getManufactureByTechCompanyGuid(TechCompanyGuid)
    .subscribe((resp) => {
       this.manufacturerList = resp;
    });
  }

  HardwareTypeList(TechCompanyGuid: any) {
    this.agentService
      .getHardwareTypeByTechCompanyGuid(TechCompanyGuid)
      .subscribe((resp) => {
        this.hardwareTypes = resp;
      });
  }

  ModelList(ManufacturerID: any) {
    this.agentService
      .getModelByManufacturerId(ManufacturerID)
      .subscribe((resp) => {
        this.modelList = resp;
      });
  }


  openModel(isCreated: boolean, index: number, device:any) {
    this.submitted = false;
    this.deviceForm.reset();
    this.create = isCreated;


      this.selectedIdx = index;
      this.deviceForm.patchValue({
        ID: device.Id,
        Name: device.Name,
        TechCompanyID : device.TechCompanyID,
        TechCompanyGuid :this.companyId
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

  removeConfirm(devicetype: any) {
    this.deviceType = devicetype;
    this.popup = true;
  }


  removeDeviceType() {
    this.loading = true; $(".loading").css("display", "block");

    this.agentService
    .deleteHardwareType(this.deviceType)
    // .pipe(
    //   map(res => {
    //     this.loading = false; $(".loading").css("display", "none");
    //     this.popup = false;
    //     this.hardwareTypes = this.hardwareTypes.filter(t => t.ID !== this.deviceType.ID);
    //     this.toastrService.success(`${this.deviceType.Name} is Deleted Successfully.`);
    //   })
    // )
    .subscribe(
      ()=>{
        this.toastrService.success(`${this.deviceType.Name} is Deleted Successfully.`);
      }
    );
  }


  openModelManufacture(isCreated: boolean, index: number, manufacture:any) {
    this.submitted = false;
    this.manufactureForm.reset();
    this.create = isCreated;


      this.selectedIdx = index;
      this.manufactureForm.patchValue({
        ID: manufacture.Id,
        Name: manufacture.Name,
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

    openModelPopup(isCreated: boolean, index: number, model:any) {
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
        console.log(this.modelList)
      }
}
