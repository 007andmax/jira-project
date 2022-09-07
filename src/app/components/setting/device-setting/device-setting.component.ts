import { ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { AgentService } from 'src/app/services/agent/agent.service';
import { SettingStateService } from 'src/app/states/setting/setting-state.service';
import { DeviceFilter } from '../../devices/class/devices';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CompaniesService } from 'src/app/services/company/companies.service';

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
  popupManufacturer:boolean;
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
  selectManufactureList:any[]=[];
  manufactureId: Number;
  manufacturer:any;
  deviceTypeList: any[] = [];
  manufactureIsActiveList: any[]=[];
  searchModel:string;
  popupModel:boolean;
  model:any;
  manufacturerIsActiveList:any[]=[];
  filter: DeviceFilter = new DeviceFilter();
  closeResult: string = '';
  openedCounter: boolean = false;
  @ViewChild("templatecounter") templatecounter;
  @ViewChild("templatecounterManufactuer") templatecounterManufactuer;
  @ViewChild("templatecounterModel") templatecounterModel;
  deviceTypeId : number;
  AssetbyHardwaretypeList : any[]=[];
  deviceName: string;
  manufacturerId:number
  AssetbyManufactureList : any[]=[];
  AssetbyModelList : any[]=[];
  modelId : number;
  manufactureName :any;
  modelName: string;  
  company : any;
  searches : any[];


  constructor(private settingStateService: SettingStateService,
    private agentService: AgentService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private ngZone: NgZone,
    private modalService: NgbModal,
    private companiesService: CompaniesService,
    private companiesStateService : CompaniesStateService,
    private companiesState: CompaniesStateService) { }

  ngOnInit() {      
    this.loading = true; $(".loading").css("display", "block");
    this.devicebutton = true;
    this.openedCounter = true;

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
      Counter:[""]

    });

    this.manufactureForm = this.formBuilder.group({
      Name: [
        "",
        [Validators.required, Validators.minLength(2), Validators.maxLength(30)]
      ],
      ID: [""],
      TechCompanyID: [""],
      TechCompanyGuid: [""],
      IsActive :[""],
      CreateDate: [""]
    })

    this.modelForm = this.formBuilder.group({
      Name: [
        "",
        [Validators.required, Validators.minLength(2), Validators.maxLength(30)]
      ],
      ID: [""],
      ManufacturerID:[""],
      ManufactureName: [""],
      IsActive: [""],
      CreateDate: [""]
    })

    this.settingStateService.setComponentName('DeviceSettingComponent');    
    if(this.companiesStateService.getCurrentCompany())this.getCurrentCompany(this.companiesStateService.getCurrentCompany());
    this.companiesStateService.onCurrentCompany.subscribe((data) =>{                    
        this.getCurrentCompany(data);
        this.techCompany = data;
        this.getDeviceTypes(this.techCompany.id);      
    })

    this.loading = false; $(".loading").css("display", "none");
  }

  onFilter(field) {
    this.filter.onFilter(field, this.deviceTypeList);
  }

  onFilterManufacturer(field){
    this.filter.onFilter(field, this.manufactureIsActiveList)
  }

  onFilterModel(field){
    this.filter.onFilter(field, this.selectManufactureList)
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
      if(this.techCompany !== undefined)
      {
        this.getManufacturers(this.techCompany.id);            
      }  
    }
    else {
      this.manufacturebutton = false
    }

    if (evt.nextId == "tab3") {
      this.modelbutton = true; 
      if(this.techCompany !== undefined)
      {
        this.getModels(this.techCompany.id);
        this.getManufacturers(this.techCompany.id);
      }           
    }
    else {
      this.modelbutton = false
    }
  }

  getCurrentCompany(data) {    
    this.company = data;
    this.agentService.getByTechCompany(this.company.id).subscribe((res) => {
      this.searches = res;
    });
  }

  getManufacturers(TechCompanyGuid: any) {    
    this.loading = true; $(".loading").css("display", "block");
    if(this.agentService.AccessToken == '') {
      setTimeout(() => {
        this.getManufacturers(TechCompanyGuid);
      }, 300);
      return;
    }
    this.agentService.getManufactures(TechCompanyGuid)
      .subscribe((resp) => {        
        this.loading = false; $(".loading").css("display", "none");
        this.manufactureIsActiveList = [];
        this.manufacturerList = resp;

        this.manufacturerList.forEach(element=>{
          if(element.IsActive == true)
          this.manufactureIsActiveList.push(element)
        })
      });
  }

  getDeviceTypes(TechCompanyGuid: any) {        
    this.loading = true; $(".loading").css("display", "block");
    if(this.agentService.AccessToken == '') {
      setTimeout(() => {
        this.getDeviceTypes(TechCompanyGuid);
      }, 300);
      return;
    }
    this.agentService
      .getHardwareTypeByTechCompanyGuid(TechCompanyGuid)
      .subscribe((resp) => {                
        this.loading = false; $(".loading").css("display", "none");
        this.deviceTypeList = [];
        this.hardwareTypes = resp;

        this.hardwareTypes.forEach(element =>{
          if(element.IsActive == true){
             this.deviceTypeList.push(element);
          }
        })
      });
  }

  getModels(TechCompanyGuid: any) {    
    this.loading = true; $(".loading").css("display", "block");
    if(this.agentService.AccessToken == '') {
      setTimeout(() => {
        this.getModels(TechCompanyGuid);
      }, 300);
      return;
    }
    this.agentService
      .getModels(TechCompanyGuid)
      .subscribe((resp) => {        
        this.loading = false; $(".loading").css("display", "none");
        this.selectManufactureList = resp;
        this.selectManufactureList[0].manufacture = this.manufacturerList;
        this.modelList = resp;

        this.modelList.forEach(element =>{
          if(element.IsActive == true ){
            this.selectManufactureList.push(element);
          }
        })

      });
  }

  onSelectManufactureName(SelectManufacturer) {
    if (SelectManufacturer) {
      this.manufactureId = SelectManufacturer.ID;
      this.agentService.getModelsByManufacturer(this.manufactureId).subscribe((resp)=>{
        this.selectManufactureList = resp;
      })
    }
    else{
      this.getModels(this.techCompany.id);
    }
  }

  openModel(isCreated: boolean, index: number) {
    this.submitted = false;
    this.deviceForm.reset();
    this.create = isCreated;


    this.selectedIdx = index;
    let device:any ={};
    this.deviceForm.patchValue({
      ID: device.Id,
      Name: device.Name,
      TechCompanyID: device.TechCompanyID,
      TechCompanyGuid: this.techCompany.id,
      Counter:device.Counter
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
          this.getDeviceTypes(this.techCompany.id)
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
    this.deviceType.IsActive = false;
    this.loading = true; $(".loading").css("display", "block");

    this.agentService
      .deleteHardwareType(this.deviceType)
      .subscribe((resp) => {
        this.toastrService.success(`${this.deviceType.Name} is Deleted Successfully.`);
        this.getDeviceTypes(this.techCompany.id);
        this.popup = false;
        this.loading = false; $(".loading").css("display", "none");

      }, (error) => {
        this.toastrService.error("Something went wrong please try again.");
      });
  }


  openModelManufacture(isCreated: boolean, index: number) {
    this.submitted = false;
    this.manufactureForm.reset();
    this.create = isCreated;


    this.selectedIdx = index;
    let manufacture : any = {};
    this.manufactureForm.patchValue({
      ID: manufacture.Id,
      Name: manufacture.Name,
      TechCompanyID: manufacture.TechCompanyID,
      TechCompanyGuid: this.techCompany.id,
      IsActive : manufacture.IsActive,
      CreateDate: manufacture.CreateDate
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
          this.getManufacturers(this.techCompany.id)
        },
        error => {
          this.loading = false; $(".loading").css("display", "none");
        }
      );
  }

  get f1() {
    return this.manufactureForm.controls;
  }


  removeConfirmManufacturer(manufacturer: any) {
    this.manufacturer = manufacturer;
    this.popupManufacturer = true;
  }

  removeManufacturer() {
    this.loading = true; $(".loading").css("display", "block");
    this.manufacturer.IsActive = false;

    this.agentService
      .deleteManufacturer(this.manufacturer)
      .subscribe((resp) => {
        this.toastrService.success(`${this.manufacturer.Name} is Deleted Successfully.`);
        this.popupManufacturer = false;
        this.getManufacturers(this.techCompany.id)
        this.loading = false; $(".loading").css("display", "none");
      }, (error) => {
        this.toastrService.error("Something went wrong please try again.");
      });
  }

  openModelPopup(isCreated: boolean, index: number) {
    this.submitted = false;
    this.modelForm.reset();
    this.create = isCreated;


    this.selectedIdx = index;
    let model:any ={};
    this.modelForm.patchValue({
      ID: model.Id,
      Name: model.Name,
      ManufacturerID: this.manufactureId,
      ManufactureName: model.ManufactureName,
      IsActive: model.IsActive,
      CreateDate:model.CreateDate
    });
  }

  get f2() {
    return this.modelForm.controls;
  }

  onSubmitModel() {
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
          this.getModels(this.techCompany.id)
        },
        error => {
          this.loading = false; $(".loading").css("display", "none");
        }
      );
  }

  removeConfirmModel(model: any) {
    this.model = model;
    this.popupModel = true;
  }

  removeModel() {
    this.model.IsActive = false;

    this.agentService
      .deleteModel(this.model)
      .subscribe((resp) => {
        this.toastrService.success(`${this.model.Name} is Deleted Successfully.`);
        this.getModels(this.techCompany.id)
        this.popupModel = false;
        this.loading = false; $(".loading").css("display", "none");
      }, (error) => {
        this.toastrService.error("Something went wrong please try again.");
      });
  }

  counterPopup(templatecounter, deviceType) {    
    this.loading = true; $(".loading").css("display", "block");
    this.deviceTypeId = deviceType.ID;
    this.deviceName = deviceType.Name;
    this.getAssetbyTechCompanyAndHardwareType(this.techCompany.id, this.deviceTypeId)
    this.ngZone.run(() => {
      this.modalService
        .open(templatecounter, { ariaLabelledBy: "modal-basic-title", centered: true, size: 'lg', },
        )
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismiss(reason)}`;
          }
        );
    });
  }

  private getDismiss(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  closed() {
    this.modalService.dismissAll("Cross click");
  }

  counterPopupManufactuer(templatecounterManufactuer, manufacture) {    
    this.loading = true; $(".loading").css("display", "block");
    this.manufacturerId = manufacture.ID;
    this.manufactureName = manufacture.Name;
    this.getAssetbyTechCompanyAndManufacture(this.techCompany.id, this.manufacturerId)
    this.ngZone.run(() => {
      this.modalService
        .open(templatecounterManufactuer, { ariaLabelledBy: "modal-basic-title", centered: true, size: 'lg', },
        )
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismiss(reason)}`;
          }
        );
    });
  }

  counterPopupModel(templatecounterModel, model) {    
    this.loading = true; $(".loading").css("display", "block");
    this.modelId = model.ID;
    this.modelName = model.Name;
    this.getAssetbyTechCompanyAndModel(this.techCompany.id, this.modelId)
    this.ngZone.run(() => {
      this.modalService
        .open(templatecounterModel, { ariaLabelledBy: "modal-basic-title", centered: true, size: 'lg', },
        )
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismiss(reason)}`;
          }
        );
    });
  }

  getAssetbyTechCompanyAndHardwareType(TechCompanyGuid, DeviceTypeId){
    this.agentService.getHardwareTypeAssetByTechCompanyGuidAndHardwareType(TechCompanyGuid, DeviceTypeId)
      .subscribe((resp) => {        
        this.loading = false; $(".loading").css("display", "none");
        this.AssetbyHardwaretypeList = resp;
      });
  }

  getAssetbyTechCompanyAndManufacture(TechCompanyGuid, ManufactureId){
    this.agentService.getManufacturerAssetByTechCompanyGuidAndManufacturer(TechCompanyGuid, ManufactureId)
    .subscribe((resp)=>{    
    this.loading = false; $(".loading").css("display", "none");
    this.AssetbyManufactureList= resp;
    })
  }

  getAssetbyTechCompanyAndModel(TechCompanyGuid, modelId){
    this.agentService.getModelAssetByTechCompanyGuidAndModel(TechCompanyGuid, modelId)
    .subscribe((resp)=>{    
    this.loading = false; $(".loading").css("display", "none");
     this.AssetbyModelList = resp;
    })
  }

  ngOnDestroy() {
    $('body').removeClass('ng7');    
  }

}
