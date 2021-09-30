import { EventEmitter, Injectable } from "@angular/core";
import { KafkaRealTimeService } from "./kafka-real-time.service";

@Injectable({
  providedIn: "root",
})
export class KafkaStateService {
  assetConfigMessage = [];
  onCurrentConfig: EventEmitter<any> = new EventEmitter();

  constructor(private kafkaRealTimeService: KafkaRealTimeService) {}

  public onInit() {
    this.kafkaRealTimeService.changeKafkarray.subscribe((newChange) => {
      if(newChange.data.messageType =="GetCurrentConfig")
      {
        if(this.assetConfigMessage.length > 0)
        {
          let index = this.assetConfigMessage.findIndex(x=>x.key=newChange.data.assetID);
          if(index !=-1)
          {
            this.assetConfigMessage.splice(index,1);
          }
        }
        this.assetConfigMessage.push({key:newChange.data.assetID,value:newChange.data.value});
      }
      if(newChange.data.messageType =="RunPowerShellCommand")
      {
        if(this.assetConfigMessage.length > 0)
        {
          let index = this.assetConfigMessage.findIndex(x=>x.key=newChange.data.assetID);
          if(index !=-1)
          {
            this.assetConfigMessage.splice(index,1);
          }
        }
        this.assetConfigMessage.push({key:newChange.data.assetID,value:newChange.data.value});
      }
      this.onCurrentConfig.emit(this.assetConfigMessage);
    });

  }
}
