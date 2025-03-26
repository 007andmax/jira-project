export class System {
    manufacturer: string;
    model: string;
    architecture: string;
    warranty: string;
    caption: string;
    servicePack: string;
    version: string;
    releaseId: string;
}

export class Graphics {
    hardwareDeviceName: string;
    driverVersion: string;
    memory: number;
}

export class Motherboard {
    manufacturer: string;
    serialNumber: string;
}

export class Bios {
    manufacturer: string;
    releaseDate: string;
    version: string;
}

export class Processor {
    name: string;
}

export class Display {
    manufacturer: string;
    name: string;
}

export class LogicalDisk {
    deviceId: string;
    size: number;
    freeSpace: number;
}

export class Memory {
    capacity: number;
}

export class Adapter {
    description: string;
    ipAddress: string;
    subnet: string;
    dns: string;
    speed: number;
    mac: string;
    dhcpServer: string;
}

export class DeviceDetail {
    agentId: string;
}