import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AgentService } from 'src/app/services/agent/agent.service';
import { KafkaStateService } from 'src/app/states/kafka/kafka-state.service';

@Component({
  selector: 'window-updates',
  templateUrl: './window-updates.component.html',
  styleUrls: ['./window-updates.component.scss']
})
export class WindowUpdatesComponent implements OnInit {
  kafkaMessage: any = "";
  installedWindowsUpdateList: any[] = [];
  installUpdate : number;
  blockedWindowsUpdateList : any [] = [];
  blockedNumber : number;
  windowUpdatePendingList: any[] = [];
  securityUpdate: number;
  asset: any = undefined;
  categoriesName: string = "";
  _id = "";
  categories: number
  check: any[] = [];
  selectednum = false ;
  reloadWindowUpdatePendingList: any[] = [];
  isOverlay = false;
  selected: number = 0;
  public kafkaresponse:boolean = false;
  public windowupdateview:boolean = false;
  public loading: boolean;

  constructor(
    private kafkaStateService: KafkaStateService,
    private cd: ChangeDetectorRef,
    private toastr: ToastrService,
    private agentService: AgentService,
    private activateRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this._id = this.activateRoute.snapshot.params["id"];
    this.loading = true;
    this.getAssetId();
    this.kafkaStateService.onCurrentConfig.subscribe((resp)=>{
      if(resp.length>0)
      {
        this.kafkaresponse = true;
        this.onCurrentConfig(resp)        
      }      
    }) 
    this.time();       
  }

  public time(){
    setTimeout(()=>{
      if(this.kafkaresponse == false)
      {     
        this.loading = false;   
        this.windowupdateview = true;
        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }
      }      
    },60000);
    
  }

  onCurrentConfig(resp: any) {
    if(resp.length>0)
    {
      this.loading=false;
      if (this.asset.ID && this.asset.ID != 0) {
        let item = resp.find((x) => x.key == this.asset.ID);
        if (item) {
          this.kafkaMessage = JSON.parse(item.Value);
  
          this.installUpdate = this.kafkaMessage.InstalledWindowsUpdates.length;
          if(this.installUpdate > 0){
            this.installedWindowsUpdateList = [];
            for(let i=0; i< this.installUpdate ; i++){
              let install : any = {};
              install.UpdateID = this.kafkaMessage.InstalledWindowsUpdates[i].UpdateID;
              install.Title = this.kafkaMessage.InstalledWindowsUpdates[i].Title;
              install.Size = this.kafkaMessage.InstalledWindowsUpdates[i].Size;
              this.categories = this.kafkaMessage.InstalledWindowsUpdates[i].Categories.length;
              if(this.categories >0)
              {
                for(let j=0; j<this.categories; j++){
                  install.Categories = this.kafkaMessage.InstalledWindowsUpdates[i].Categories[j].Name
                }
              }
              this.installedWindowsUpdateList.push(install);
            }
          }
  
          this.blockedNumber = this.kafkaMessage.BlockedWindowsUpdates.length;
          if(this.blockedNumber > 0){
            this.blockedWindowsUpdateList = [];
            for(let i=0; i< this.blockedNumber ; i++){
              let blocked : any = {};
              blocked.UpdateID = this.kafkaMessage.BlockedWindowsUpdates[i].UpdateID;
              blocked.Title = this.kafkaMessage.BlockedWindowsUpdates[i].Title;
              blocked.Size = this.kafkaMessage.BlockedWindowsUpdates[i].Size;
  
              this.blockedWindowsUpdateList.push(blocked);
            }
          }
          this.securityUpdate = this.kafkaMessage.PendingWindowsUpdates.length;
  
          if (this.securityUpdate > 0) {
            this.windowUpdatePendingList = [];
            for (let i = 0; i < this.securityUpdate; i++) {
              let data: any = {};
              data.UpdateID = this.kafkaMessage.PendingWindowsUpdates[i].UpdateID;
              data.Title = this.kafkaMessage.PendingWindowsUpdates[i].Title;
              data.Size = this.kafkaMessage.PendingWindowsUpdates[i].Size;
              this.categories = this.kafkaMessage.PendingWindowsUpdates[i].Categories.length;
              if(this.categories >0)
              {
                for(let j=0; j<this.categories; j++){
                  data.Categories = this.kafkaMessage.PendingWindowsUpdates[i].Categories[j].Name
                }
              }
              if (this.kafkaMessage.PendingWindowsUpdates[i].RebootIsRequired == "0") {
                data.RebootIsRequired = "Never Reboots"
              }
              if (this.kafkaMessage.PendingWindowsUpdates[i].RebootIsRequired == "1") {
                data.RebootIsRequired = "Always Requires Reboot";
              }
              if (this.kafkaMessage.PendingWindowsUpdates[i].RebootIsRequired == "2") {
                data.RebootIsRequired = "Can Request Reboot";
              }
              data.loading = false;
              this.windowUpdatePendingList.push(data);
            }
          }
  
          if(!this.cd['destroyed']){
            this.cd.detectChanges();
          }
        }
      }
    }
    
  }

  onCurrentConfigError(err: any) {
    console.log('on current config error');
    this.toastr.error("Something went wrong getting real time data");
  }

  getAssetId() {
    if(this.agentService.AccessToken == '') {
      setTimeout(() => {
        this.getAssetId();
      }, 300);
      return;
    }
    this.agentService.getAssetByGuid(this._id).subscribe((resp) => {
      if (resp.length > 0) {
        this.asset = resp[0];

        this.agentService.GetCurrentConfig(this.asset.ID);
      }
    });
  }
  sizeConvert(v1) {
    let val1 = (parseInt(v1) / 1024 / 1024).toFixed(2);
    return (parseFloat(val1)).toFixed(2);
  }

  categoriesSep(name:string){
    this.categoriesName = "";
    if (name.length > 0) {
      let finalname = name.split(",");

      for (let i = 0; i < finalname.length; i++) {
        return finalname[i].split(",");
      }
    }
  }

  postWindowUpdatePending(i) {
    const index: any = { "ID": i };
    let find = this.check.find(x => x.ID == i);
    let indexs = this.check.findIndex(x => x.ID == i);
    if (!find) {
      this.check.push(index);
      this.selected = this.selected + 1;
      if(this.check.length>0){
        this.selectednum = true;
      }
      this.reloadWindowUpdatePendingList.push(this.windowUpdatePendingList[i]);
    }
    else {
      this.check.splice(indexs, 1);
      this.selected = this.selected - 1;
      if(this.check.length==0){
        this.selectednum = false
      }
      this.reloadWindowUpdatePendingList.splice(indexs, 1);
    }  
    if (!this.cd['destroyed']){
      this.cd.detectChanges();
    }  
  }

  InstallUpdate() {
    var clonedItems = [];
    for (let i = 0; i < this.reloadWindowUpdatePendingList.length; i++) {
      var itemToUpdate: any = {};
      itemToUpdate.UpdateID = this.reloadWindowUpdatePendingList[i].UpdateID;
      itemToUpdate.Title = this.reloadWindowUpdatePendingList[i].Title;
      itemToUpdate.RebootIsRequired = this.reloadWindowUpdatePendingList[i].RebootIsRequired;

      if (itemToUpdate.RebootIsRequired == "Never Reboots") {
        itemToUpdate.RebootIsRequired = "0";
      }
      else if (itemToUpdate.RebootIsRequired == "Always Requires Reboot") {
        itemToUpdate.RebootIsRequired = "1";
      }
      else if (itemToUpdate.RebootIsRequired == "Can Request Reboot") {
        itemToUpdate.RebootIsRequired = "2";
      }
      clonedItems.push(itemToUpdate);

      var item = this.windowUpdatePendingList.find(x => x.UpdateID == this.reloadWindowUpdatePendingList[i].UpdateID);
      if (item) {
        item.loading = true;
      }
    }

    this.agentService.GetWindowUpdateList(this.asset.ID, clonedItems);

    if (this.check.length) {
      this.isOverlay = true;
      setTimeout(() => {
        this.isOverlay = false;
      }, 3000)
    }
  }  
}
