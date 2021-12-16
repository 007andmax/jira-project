import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions, } from 'ngx-uploader';
import { ToastrService } from 'ngx-toastr';
import { startupService } from '../_services/startup.service';
import { first } from 'rxjs/operators';
import { environment } from './../../../../environments/environment';
import { AgentService } from 'src/app/services/agent/agent.service';
import { KafkaStateService } from 'src/app/states/kafka/kafka-state.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-startup-programes',
  templateUrl: './startup-programes.component.html',
  styleUrls: ['./startup-programes.component.scss']
})
export class StartupComponent implements OnInit {

  public search: string;
  public startupList: any[]=[];
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
    this.kafkaStateService.onGetStartupPrograms.subscribe((resp) => this.onGetStartupPrograms(resp), (e)=> this.onGetStartupProgramsError(e));
    this.loading =true;
    this.GetStartupPrograms();
  }

  public GetStartupPrograms() {
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
          this.agentService.GetStartupPrograms(this.assetId);    
        });       
      });
  }

  public onGetStartupPrograms(resp: any) {
    let item = resp.find((x) => x.key == this.Id);
    if (item) {
      this.startupList = JSON.parse(item.Value);
      debugger;
      this.cd.detectChanges();
    }
  }

  public onGetStartupProgramsError(error: any) {
    console.log(error);
  }

  public onFilter(field: string) {

  }

  public printPdf() {

  }

  public downloadCsv() {

  }

}
