import { Injectable, EventEmitter } from '@angular/core';
import { IntegrationsService } from 'src/app/services/integrations/integrations.service';

@Injectable({
  providedIn: 'root'
})
export class IntegrationsStateService {
  isInit: boolean = false;
  connected: boolean = false;
  onGetConnected: EventEmitter<any> = new EventEmitter();
  constructor(private integrationsService: IntegrationsService) { }

  public onInit() {
    this.integrationsService.getConnected().subscribe((data: any) => {
      this.isInit = true;
      this.connected = data.connected;
      this.onGetConnected.emit(this.connected);
    });
  }
}
