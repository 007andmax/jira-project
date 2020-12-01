import { DeviceExtendedReportAntivirus } from './device-extended-report-antivirus';
import { DeviceExtendedReportBios } from './device-extended-report-bios';
import { DeviceExtendedReportLogicalDisks } from './device-extended-report-logical-disk';
import { DeviceExtendedReportMotherboard } from './device-extended-report-motherboard';
import { DeviceExtendedReportNetworkAdapters } from './device-extended-report-network-adapters';
import { DeviceExtendedReportPhysicalDisks } from './device-extended-report-physical-disks';
import { DeviceExtendedReportPrinter } from './device-extended-report-printer';
import { DeviceExtendedReportProcessor } from './device-extended-report-processor';
import { DeviceExtendedReportRam } from './device-extended-report-ram';
import { DeviceExtendedReportService } from './device-extended-report-service';
import { DeviceExtendedReportSoftList } from './device-extended-report-soft-list';
import { DeviceExtendedReportSystem } from './device-extended-report-system';
import { DeviceExtendedReportVariant } from './device-extended-report-variant';
import { DeviceExtendedReportWarrantyParts } from './device-extended-report-warranty-parts';

export class DeviceExtendedReport {
    OfficeLicenseKey: string;
    OfficeName: string;
    WindowsLicenseKey: string;
    agentId: string;
    antivirus: Array<DeviceExtendedReportAntivirus> = [];
    bios: DeviceExtendedReportBios;
    deviceName: string;
    externalIp: string;
    logicalDisks: Array<DeviceExtendedReportLogicalDisks> = [];
    monitors: any;
    motherboard: DeviceExtendedReportMotherboard;
    networkAdapters: Array<DeviceExtendedReportNetworkAdapters> = [];
    physicalDisks: Array<DeviceExtendedReportPhysicalDisks> = [];
    printers: Array<DeviceExtendedReportPrinter> = [];
    processors: Array<DeviceExtendedReportProcessor> = [];
    ram: DeviceExtendedReportRam;
    service: DeviceExtendedReportService;
    softList: Array<DeviceExtendedReportSoftList>;
    system: DeviceExtendedReportSystem;
    variant: DeviceExtendedReportVariant;
    videoCards: Array<any>;
    warrantyParts: DeviceExtendedReportWarrantyParts;
    constructor(data) {
        for (const key in data) {
            this[key] = data[key];
        }
        this.softList.sort((a, b) => (a.softName.toLowerCase() > b.softName.toLowerCase()) ?
            1 : ((b.softName.toLowerCase() > a.softName.toLowerCase()) ? -1 : 0));

    }
}