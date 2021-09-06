import { Injectable } from "@angular/core";
import { AgentService } from "src/app/services/agent/agent.service";
import { KafkaRealTimeService } from "./kafka-real-time.service";

@Injectable({
  providedIn: "root",
})
export class KafkaStateService {
  constructor(
    private agentService: AgentService,
    private kafkaRealTimeService: KafkaRealTimeService
  ) {}

  public onInit() {
    this.agentService.KafkaList().subscribe((data: any) => {
      console.log(data);
    });

    this.kafkaRealTimeService.changeDeviceArray.subscribe((newChange) => {
      console.log(newChange);
    });
  }
}
