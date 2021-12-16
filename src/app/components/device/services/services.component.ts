import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DeviceServices } from '../_services/device_services.service';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { KafkaStateService } from 'src/app/states/kafka/kafka-state.service';
import { ActivatedRoute } from '@angular/router';
import { AgentService } from 'src/app/services/agent/agent.service';


@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {

  public search: string;
  public serviceList: any[] = [];
  public loading: boolean;
  public Id: string;
  public assetId: number;
  public asset: any;

  constructor(
    private agentService: AgentService,
    private kafkaStateService: KafkaStateService,
    private cd: ChangeDetectorRef,
    private activateRoute: ActivatedRoute) {

  }

  ngOnInit() {
    this.Id = this.activateRoute.snapshot.params["id"];    
    this.kafkaStateService.onGetService.subscribe((resp) => this.onGetService(resp), (e)=> this.onGetServiceError(e));
    this.loading =true;
    this.getAllServicesList();
  }

  public getAllServicesList() {
    this.agentService
      .getAgentToken(
        "QuickTech",
        "s8Y1IuPCUUYlSLMbFijHvut5uOi/KnKNqOLtn57CBlw="
      )
      .subscribe((data) => {
        this.agentService.setAccessToken(data.AccessToken);
        this.agentService.getAssetByGuid(this.Id).subscribe((resp) => {
          this.asset = resp[0];
          this.assetId = this.asset.ID;      
          this.agentService.GetService(this.assetId);    
        });        
      });
  }

  public onGetService(resp: any) {
    let item = resp.find((x) => x.key == this.assetId);
    if (item) {
      let data = item.Value.split('\r\n');
      if(data) {
        for(let i=2;i < data.length ; i++) {
          let fields = data[i].split(" ").filter(function (part) { return !!part; });
          let item:any = {};
          item.Status = fields[0];
          item.Name = fields[1];
          item.Description = '';
          for(let j=2;j< fields.length;j++) {
            item.Description += fields[j]+' ';
          }
          this.serviceList.push(item);          
        }
        this.loading = false;
      }      
      this.cd.detectChanges();
    }
  }

  public onGetServiceError(error: any) {
    console.log(error);
  }

  public onFilter(field: string) {

  }

  public printPdf() {

  }

  public downloadCsv() {

  }
}
