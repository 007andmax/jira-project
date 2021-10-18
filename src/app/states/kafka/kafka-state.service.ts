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
  onTerminalCommand: EventEmitter<any> = new EventEmitter();

  constructor(private kafkaRealTimeService: KafkaRealTimeService) { }

  public onInit() {
    this.kafkaRealTimeService.changeKafkarray.subscribe((newChange) => {
      if (!(newChange && newChange.data && newChange.data.MessageType)) {
        return;
      }
      switch (newChange.data.MessageType) {

        case "GetCurrentConfig":
          this.handleGetCurrentConfig(newChange);
          break;
        case "RunPowerShellCommand":
          this.handleRunPowershellCommand(newChange);
          break;
        case "Ack":
          this.handleAck(newChange);
          break;
        case "RunDOSCommand":
          this.handleRunDosCommand(newChange);
          break;
      }
    });
  }

  private handleGetCurrentConfig(newChange: any) {
    if (this.assetConfigMessage.length > 0) {
      let index = this.assetConfigMessage.findIndex(
        (x) => (x.key = newChange.data.AssetID)
      );
      if (index != -1) {
        this.assetConfigMessage.splice(index, 1);
      }
    }
    this.assetConfigMessage.push({
      key: newChange.data.AssetID,
      Value: newChange.data.Value,
    });
    this.onCurrentConfig.emit(this.assetConfigMessage);
  }

  private handleRunPowershellCommand(newChange: any) {
    if (this.assetConfigMessage.length > 0) {
      let index = this.assetConfigMessage.findIndex(
        (x) => (x.key = newChange.data.AssetID)
      );
      if (index != -1) {
        this.assetConfigMessage.splice(index, 1);
      }
    }
    this.assetConfigMessage.push({
      key: newChange.data.AssetID,
      Value: newChange.data.Value,
    });
    this.onPowerShellCommand.emit(this.assetConfigMessage);
  }

  private handleAck(newChange: any) {
    this.onAck.emit(newChange);
  }

  private handleRunDosCommand(newChange: any){
    if (this.assetConfigMessage.length > 0) {
      let index = this.assetConfigMessage.findIndex(
        (x) => (x.key = newChange.data.AssetID)
      );
      if (index != -1) {
        this.assetConfigMessage.splice(index, 1);
      }
    }
    this.assetConfigMessage.push({
      key: newChange.data.AssetID,
      Value: newChange.data.Value,
    });
    this.onTerminalCommand.emit(this.assetConfigMessage);
  }


}
