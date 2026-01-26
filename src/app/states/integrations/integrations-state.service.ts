import { Injectable } from '@angular/core';
import { IntegrationsService } from 'src/app/services/integrations/integrations.service';

@Injectable({
  providedIn: 'root'
})
export class IntegrationsStateService {
  connected: boolean = false;
  constructor(private integrationsService: IntegrationsService) { }

  public onInit() {
    this.integrationsService.getConnected().subscribe((data: any) => {
      this.connected = data.connected;
    });
  }
}
