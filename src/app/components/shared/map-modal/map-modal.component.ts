import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MapModalStateService } from 'src/app/states/map-modal/map-modal-state.service';
import { MapModal } from 'src/app/interfaces/map-modal/map-modal';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss']
})
export class MapModalComponent implements OnInit, OnDestroy {
  latitude: number = 0;
  longitude: number = 0;
  title: string = '';
  show: boolean = false;
  sub: Subscription = new Subscription();
  constructor(private mapModalStateService: MapModalStateService) { }


  ngOnInit() {
    let getOnShowMap = this.mapModalStateService.getOnShowMap().subscribe((data: MapModal) => {
      this.latitude = data.latitude;
      this.longitude = data.longitude;
      this.title = data.title;
      this.show = true;
    })
    this.sub.add(getOnShowMap);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
