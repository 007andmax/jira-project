import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AgentService } from 'src/app/services/agent/agent.service';
import { KafkaStateService } from 'src/app/states/kafka/kafka-state.service';

@Component({
  selector: 'processes',
  templateUrl: './processes.component.html',
  styleUrls: ['./processes.component.scss']
})
export class ProcessesComponent implements OnInit {
  public processesList: any[] = [];
  public loading: boolean;
  public Id: string;
  public assetId: number;
  public asset: any;

  constructor(
    private kafkaStateService: KafkaStateService,
    private cd: ChangeDetectorRef,
    private activateRoute: ActivatedRoute,
    private agentService: AgentService,
  ) { }

  ngOnInit() {
    this.Id = this.activateRoute.snapshot.params["id"];
    this.kafkaStateService.GetProcesses.subscribe((resp) => this.onGetProcess(resp),  (e) => this.onGetProcessError(e));
    this.getAllServicesList();
  }

  public onGetProcessError(error: any) {
    console.log(error);
  }

  public getAllServicesList() {
    if(this.agentService.AccessToken == '') {
      setTimeout(() => {
        this.getAllServicesList();
      }, 300);
      return;
    }
      this.agentService.getAssetByGuid(this.Id).subscribe((resp) => {
        this.asset = resp[0];
        this.assetId = this.asset.ID;
        this.agentService.GetProcesses(this.assetId);
      });
  }

  public onGetProcess(resp: any) {
    if (resp) {
      this.processesList = JSON.parse(resp.Value);
      for(let i=0;i<this.processesList.length;i++)
      {
        this.processesList[i] = Object.assign(this.processesList[i],{Loaded:'False',RestartLoaded:'False',StopLoaded:'False'});
      }
    }
    this.loading = false;
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }
}
