import { ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { AgentService } from 'src/app/services/agent/agent.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { DeviceSettingFilter } from './Class/devicesetting-filter';

@Component({
  selector: 'device-setting',
  templateUrl: './device-setting.component.html',
  styleUrls: ['./device-setting.component.scss']
})
export class DeviceSettingComponent implements OnInit, OnDestroy {
  activeTab: string = "deviceType";
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
  modelIsActiveList:any[]=[];
  selectManufactureList:any[]=[];
  manufactureId: Number;
  manufacturer:any;
  deviceTypeList: any[] = [];
  manufactureIsActiveList: any[]=[];
  searchModel:string;
  popupModel:boolean;
  model:any;
  manufacturerIsActiveList:any[]=[];
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
  removeDevice:any = undefined;
  deviceTypeName: string = "";
  deviceTypeManufacturer: string = "";
  deviceTypeModel: string = "";
  disableCreate: boolean = false;
  isInitRequest: boolean = false;
  showAdd: boolean = false;
  showModel: boolean = false;
  public filter: DeviceSettingFilter = new DeviceSettingFilter();
 

  constructor(private agentService: AgentService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private ngZone: NgZone,
    private modalService: NgbModal,    
    private companiesStateService : CompaniesStateService,
    private companiesState: CompaniesStateService,
    private confirmStateService: ConfirmStateService) { }

  ngOnInit() {             
    this.companiesState.onInit();    

    $('body').addClass('page-settings');        
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
    
    this.companiesStateService.onCurrentCompany.subscribe((data) =>{        
        if(data)
        {
          this.getCurrentCompany(data);
          this.techCompany = data;
          this.getDeviceTypes(this.techCompany.id);
          this.getManufacturers(this.techCompany.id);
          this.getModels(this.techCompany.id);
        }                              
    })

    
  }

  onFilter(field) {    
    this.filter.onFilter(field, this.deviceTypeList);
  }

  onFilterManufacturer(field){
    this.filter.onFilter(field, this.manufacturerList)
  }

  onFilterModel(field){    
    this.filter.onFilter(field, this.modelList)
  }

  getCurrentCompany(data) { 
    if(data)
    {
      this.company = data;
      this.agentService.getByTechCompany(this.company.id).subscribe((res) => {
        this.searches = res;
      });  
    }       
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
        this.manufacturerList = [];
        this.manufactureIsActiveList = resp;

        this.manufactureIsActiveList.forEach(element=>{
          if(element.IsActive == true)
          this.manufacturerList.push(element)
        })
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
    if(this.agentService.AccessToken == '') {
      setTimeout(() => {
        this.getModels(TechCompanyGuid);
      }, 300);
      return;
    }
    this.agentService
      .getModels(TechCompanyGuid)
      .subscribe((resp) => {         
        this.modelList = [];
        this.modelIsActiveList = resp;
      
        this.modelIsActiveList.forEach(element =>{
          if(element.IsActive == true ){            
            this.modelList.push(element);
          }
        })

      });
  }

  // onSelectManufactureName(SelectManufacturer) {
  //   if (SelectManufacturer) {
  //     this.manufactureId = SelectManufacturer.ID;
  //     this.agentService.getModelsByManufacturer(this.manufactureId).subscribe((resp)=>{
  //       this.selectManufactureList = resp;
  //     })
  //   }
  //   else{
  //     this.getModels(this.techCompany.id);
  //   }
  // }

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

  ngOnDestroy(): void {
    $('body').removeClass('page-settings');
  }

  parseAddText() {
    if (this.activeTab === "deviceType") return "Add DeviceType";
    if (this.activeTab === "deviceManufacturer") return "Add Manufacturer";
    if (this.activeTab === "deviceModel") return "Add Model";    
    return "";
  }

  setTab(data) {    
    this.showAdd = false;
    this.activeTab = data['nextId'];
  }

  removeDeviceType(item) {
    this.removeDevice = item;
    this.popup = true;
  }

  remove() {
    if(this.removeDevice != undefined)
    {
      this.removeDevice.IsActive = false;
      this.agentService
      .deleteHardwareType(this.removeDevice)
      .subscribe((resp) => {
        this.toastrService.success(`${this.removeDevice.Name} is Deleted Successfully.`);
        //this.getDeviceTypes(this.techCompany.id);
        this.popup = false;        

      }, (error) => {
        this.toastrService.error("Something went wrong please try again.");
      });
    }  
  } 

  onKeyUp(event,type) {    
    if(type == "DeviceType")
    {
      if (event.keyCode === 13) this.deviceTypeSave();
    }
    if(type == "Manufacturer")
    {
      if (event.keyCode === 13) this.deviceManufacturerSave();
    }
    if(type == "Model")
    {
      if (event.keyCode === 13) this.deviceModelSave();
    }
  }

  deviceTypeSave() {    
    if (this.deviceTypeName.length === 0 || this.disableCreate || this.isInitRequest) return;
    this.isInitRequest = true;
    let device: any ={};   
    device.Name = this.deviceTypeName;
    device.TechCompanyGuid = this.techCompany.id;     
    this.agentService.addHardwareType(device).subscribe((res)=>{
      this.deviceTypeName = "";
      this.isInitRequest = false;
      this.showAdd = false;
      this.getDeviceTypes(this.techCompany.id);
      this.toastrService.success("Device Type Saved Successfully");      
    });       
  }

  deviceManufacturerSave(){
    if (this.deviceTypeManufacturer.length === 0 || this.disableCreate || this.isInitRequest) return;
    this.isInitRequest = true;
    let deviceManufacturer: any ={};   
    deviceManufacturer.Name = this.deviceTypeManufacturer;
    deviceManufacturer.TechCompanyGuid = this.techCompany.id;   
    this.agentService.addManufacturer(deviceManufacturer).subscribe((res)=>{
      this.deviceTypeManufacturer = "";
      this.isInitRequest = false;
      this.showAdd = false;    
      this.getManufacturers(this.techCompany.id);
      this.toastrService.success("Manufacturer Saved Successfully");      
    });       
  }

  deviceModelSave(){    
    if (this.deviceTypeModel.length === 0 || this.disableCreate || this.isInitRequest) return;
    this.isInitRequest = true;
    let deviceModel: any ={};   
    deviceModel.Name = this.deviceTypeModel;
    deviceModel.ManufacturerID = this.manufactureId;   
    deviceModel.IsActive = true;    
    this.agentService.addModel(deviceModel).subscribe((res)=>{
      this.isInitRequest = false;
      this.showAdd = false;   
      this.showModel = false; 
      this.getModels(this.techCompany.id);
      this.toastrService.success("Model Saved Successfully");     
    })          
  }

  public toggleShowAdd(data) {
    this.showAdd = data;
  }

  deviceSettingCreate() {
    if (this.activeTab === "deviceType") this.toggleShowAdd(true);
    if (this.activeTab === "deviceManufacturer") this.toggleShowAdd(true);
    if (this.activeTab === "deviceModel") this.toggleShowAdd(true);    
  }

  onSelectManufactureName(data){
    if(data)
    {
      this.showModel = true;
      this.manufactureId = data.ID;      
    }
    else
    {
      this.showModel = false;
    }
  }
  
}
