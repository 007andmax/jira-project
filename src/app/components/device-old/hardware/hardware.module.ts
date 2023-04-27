import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HardwareComponent } from './hardware.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HardwareRoutingOldModule } from './hardware-routing.module';
import { HardwareComputerComponent } from './hardware-computer/hardware-computer.component';
import { HardwareMotherboardComponent } from './hardware-motherboard/hardware-motherboard.component';
import { HardwareProcessorComponent } from './hardware-processor/hardware-processor.component';
import { HardwareMemoryComponent } from './hardware-memory/hardware-memory.component';
import { HardwareNetworkCardComponent } from './hardware-network-card/hardware-network-card.component';
import { HardwareGraphicsCardComponent } from './hardware-graphics-card/hardware-graphics-card.component';
import { HardwareDisplayComponent } from './hardware-display/hardware-display.component';
import { HardwareHardDiskComponent } from './hardware-hard-disk/hardware-hard-disk.component';
import { HardwareOperatingSystemComponent } from './hardware-operating-system/hardware-operating-system.component';
import { HardwareHeaderComponent } from './hardware-header/hardware-header.component';
import { MatSelectModule, MatChipsModule, MatIconModule, MatFormFieldModule } from '@angular/material';



@NgModule({
    declarations: [HardwareComponent, HardwareComputerComponent, HardwareMotherboardComponent, HardwareProcessorComponent, HardwareMemoryComponent, HardwareNetworkCardComponent, HardwareGraphicsCardComponent, HardwareDisplayComponent, HardwareHardDiskComponent, HardwareOperatingSystemComponent, HardwareHeaderComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        HardwareRoutingOldModule,
        MatSelectModule,
        MatChipsModule,
        MatIconModule,
        MatFormFieldModule,
    ],



})
export class HardwareOldModule { }
