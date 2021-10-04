import { data } from 'jquery';
import { EventEmitter, Injectable } from "@angular/core";
import { KafkaRealTimeService } from "./kafka-real-time.service";

@Injectable({
  providedIn: "root",
})
export class KafkaStateService {
  assetConfigMessage = [];
  onCurrentConfig: EventEmitter<any> = new EventEmitter();
  onPowerShellCommand: EventEmitter<any> = new EventEmitter();
  onAck: EventEmitter<any> = new EventEmitter();

  constructor(private kafkaRealTimeService: KafkaRealTimeService) { }

  public onInit() {
    this.kafkaRealTimeService.changeKafkarray.subscribe((newChange) => {

      if (!(newChange && newChange.data && newChange.data.messageType)) {
        return;
      }

      switch (newChange.data.messageType) {
        case "GetCurrentConfig":
          this.handleGetCurrentConfig(newChange);
          break;
        case "RunPowershellCommand":
          this.handleRunPowershellCommand(newChange);
          break;
        case "ACK":
          this.handleAck(newChange);
          break;
      }     
    });
  }

  private handleGetCurrentConfig(newChange: any) {
    if (this.assetConfigMessage.length > 0) {
      let index = this.assetConfigMessage.findIndex(
        (x) => (x.key = newChange.data.assetID)
      );
      if (index != -1) {
        this.assetConfigMessage.splice(index, 1);
      }
    }
    this.assetConfigMessage.push({
      key: newChange.data.assetID,
      value: newChange.data.value,
    });
    this.onCurrentConfig.emit(this.assetConfigMessage);
  }

  private handleRunPowershellCommand(newChange: any) {
    if (this.assetConfigMessage.length > 0) {
      let index = this.assetConfigMessage.findIndex(
        (x) => (x.key = newChange.data.assetID)
      );
      if (index != -1) {
        this.assetConfigMessage.splice(index, 1);
      }
    }
    this.assetConfigMessage.push({
      key: newChange.data.assetID,
      value: newChange.data.value,
    });
    this.onPowerShellCommand.emit(this.assetConfigMessage);
  }

  private handleAck(newChange: any) {
    this.onAck.emit(newChange);
  }


}
