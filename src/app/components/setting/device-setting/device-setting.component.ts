import { ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AgentService } from 'src/app/services/agent/agent.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { DeviceSettingFilter } from './Class/devicesetting-filter';

@Component({
  selector: 'device-setting',
  templateUrl: './device-setting.component.html',
  styleUrls: ['./device-setting.component.scss']
})
export class DeviceSettingComponent implements OnInit, OnDestroy {
  activeTab: string = "deviceType";
  hardwareTypes: any[] = [];
  techCompany: any;
  deviceType: any;
  popup: boolean;
  Name: string;
  manufacturerList: any[] = [];
  modelList: any[] = [];
  modelIsActiveList:any[]=[];
  selectManufactureList:any[]=[];
  manufactureId: Number;
  manufacturer:any;
  deviceTypeList: any[] = [];
  manufactureIsActiveList: any[]=[];
  searchAll:string;
  popupModel:boolean;
  model:any;
  manufacturerIsActiveList:any[]=[];
  closeResult: string = '';
  openedCounter: boolean = false;
  @ViewChild("templatecounterDevice") templatecounterDevice;
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
  message: string = "";
  removeType: string = "";
  showPreloader: boolean = true;
 

  constructor(private agentService: AgentService,    
    private toastrService: ToastrService,
    private ngZone: NgZone,
    private modalService: NgbModal,    
    private companiesStateService : CompaniesStateService,
    private companiesState: CompaniesStateService) { }

  ngOnInit() {             
    this.companiesState.onInit();    

    $('body').addClass('page-settings');        
    $('body').removeClass('backMenu');
    
    this.companiesStateService.onCurrentCompany.subscribe((data) =>{        
        if(data)
        {
          this.getCurrentCompany(data);
          this.techCompany = data;
          this.getDeviceTypes(this.techCompany.id);
          this.getManufacturers(this.techCompany.id);
          this.getModels(this.techCompany.id);
          this.showPreloader = false;
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

  counterPopup(templatecounterDevice, deviceType) {      
    this.AssetbyHardwaretypeList = [];     
    this.deviceTypeId = deviceType.ID;
    this.deviceName = deviceType.Name;
    this.getAssetbyTechCompanyAndHardwareType(this.techCompany.id, this.deviceTypeId)
    this.ngZone.run(() => {
      this.modalService
        .open(templatecounterDevice, { ariaLabelledBy: "modal-basic-title", centered: true, size: 'lg', },
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
        this.AssetbyHardwaretypeList = resp;
      });
  }

  getAssetbyTechCompanyAndManufacture(TechCompanyGuid, ManufactureId){
    this.agentService.getManufacturerAssetByTechCompanyGuidAndManufacturer(TechCompanyGuid, ManufactureId)
    .subscribe((resp)=>{        
    this.AssetbyManufactureList= resp;
    })
  }

  getAssetbyTechCompanyAndModel(TechCompanyGuid, modelId){
    this.agentService.getModelAssetByTechCompanyGuidAndModel(TechCompanyGuid, modelId)
    .subscribe((resp)=>{        
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
    this.searchAll = "";
    this.activeTab = data['nextId'];
  }

  removeDeviceType(item) {        
    this.removeDevice = [];
    this.removeDevice = item;
    this.message = "Remove DeviceType";
    this.popup = true;
    this.removeType = "DeviceType";
  } 

  removeManufacturer(item){    
    this.removeDevice = [];
    this.removeDevice = item;
    this.message = "Remove Manufacturer";
    this.popup = true;
    this.removeType = "DeviceManufacturer";
  }

  removeModel(item){
    this.removeDevice = [];
    this.removeDevice = item;
    this.message = "Remove Model";
    this.popup = true;
    this.removeType = "DeviceModel";
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

  closeModal(){
    this.removeDevice = [];
    this.popup = false;
  }

  cancelConfirm(){
    this.removeDevice = [];
    this.popup = false;
  }

  removeConfirm(data){     
    this.popup = false;  
    if(data == "DeviceType")
    {
      if(this.removeDevice != undefined)
      {
        this.removeDevice.IsActive = false;
        this.agentService
        .deleteHardwareType(this.removeDevice)
        .subscribe((resp) => {                    
          this.toastrService.success(`${this.removeDevice.Name} is Deleted Successfully.`);                            
          this.getDeviceTypes(this.techCompany.id);
  
        }, (error) => {
          this.toastrService.error("Something went wrong please try again.");
        });
      }  
    }

    if(data == "DeviceManufacturer")
    {
      if(this.removeDevice != undefined)
      {
        this.removeDevice.IsActive = false;
        this.removeDevice.TechCompanyGuid = this.techCompany.id;
        this.agentService
        .deleteManufacturer(this.removeDevice)
        .subscribe((resp) => {
          this.toastrService.success(`${this.removeDevice.Name} is Deleted Successfully.`);        
          this.getManufacturers(this.techCompany.id);        
          }, (error) => {
            this.toastrService.error("Something went wrong please try again.");
        });
      }     
    }

    if(data == "DeviceModel"){
      if(this.removeDevice != undefined)
      {
        this.removeDevice.IsActive = false;

      this.agentService
        .deleteModel(this.removeDevice)
        .subscribe((resp) => {
        this.toastrService.success(`${this.model.Name} is Deleted Successfully.`);
        this.getModels(this.techCompany.id);                
        }, (error) => {
          this.toastrService.error("Something went wrong please try again.");
        });
      }
    }    
  }
}
