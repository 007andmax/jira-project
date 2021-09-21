import { Injectable } from "@angular/core";
import { KafkaRealTimeService } from "./kafka-real-time.service";

@Injectable({
  providedIn: "root",
})
export class KafkaStateService {
  constructor(private kafkaRealTimeService: KafkaRealTimeService) {}

  public onInit() {
    this.kafkaRealTimeService.changeKafkarray.subscribe((newChange) => {
    });
  }
}
