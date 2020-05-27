import { Component, OnInit } from '@angular/core';
import { MapModalStateService } from 'src/ng2/app/states/map-modal/map-modal-state.service';
import { MapModal } from 'src/ng2/app/interfaces/map-modal/map-modal';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss']
})
export class MapModalComponent implements OnInit {
  latitude: number = 0;
  longitude: number = 0;
  title: string = '';
  show: boolean = false;
  constructor(private mapModalStateService: MapModalStateService) { }

  ngOnInit() {
    this.mapModalStateService.getOnShowMap().subscribe((data: MapModal) => {
      this.latitude = data.latitude;
      this.longitude = data.longitude;
      this.title = data.title;
      this.show = true;
    })
  }

}
