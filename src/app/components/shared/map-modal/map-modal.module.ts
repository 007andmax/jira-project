import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapModalComponent } from './map-modal.component';
import { AgmCoreModule } from '@agm/core';


@NgModule({
    declarations: [
        MapModalComponent
    ],
    imports: [
        CommonModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyAbP4DFpz4f9YcXMWUjdkOdyArX2peNt8s'
        }),
    ],
    exports: [MapModalComponent],


})
export class MapModalModule { }
