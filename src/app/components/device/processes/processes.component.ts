import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AgentService } from 'src/app/services/agent/agent.service';
import { KafkaStateService } from 'src/app/states/kafka/kafka-state.service';
import { ExcelService } from '../_services/download_csv.service';

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
  pdfUrl = "";
  public search: string;

  constructor(
    private kafkaStateService: KafkaStateService,
    private cd: ChangeDetectorRef,
    private activateRoute: ActivatedRoute,
    private agentService: AgentService,
    private excelService: ExcelService,
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
    let item = resp.find((x) => x.key == this.assetId);
    if (item) {
      this.processesList = JSON.parse(item.Value);
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

  public downloadCsv(){
    let downloadCsvList = [];
    this.processesList.forEach((element) => {
      downloadCsvList.push([
        element.id == null ? "N/A" : element.id,
        element.Name == null ? "N/A" : element.Name.replace(",", " "),
        element.CPU == null ? "N/A" : element.CPU.replace(",", " "),
        element.Memory == null ? "N/A" : element.Memory,
      ]);
    });
    let fileName = "Processes";
    this.excelService.generateExcel(downloadCsvList, fileName, "processes");
  }

  printPdf() {
    window.open(this.pdfUrl, "_blank");
  }

}
