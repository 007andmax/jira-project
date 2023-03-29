export class System {
    manufacturer: string;
    model: string;
    architecture: string;
    warranty: string;
    caption: string;
    service_pack: string;
    version: string;
    release_id: string;
}

export class Graphics {
    hardwareDeviceName: string;
    driverVersion: string;
    memory: number;
}

export class Motherboard {
    manufacturer: string;
    serial_number: string;
}

export class Bios {
    manufacturer: string;
    release_date: string;
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
    device_id: string;
    size: number;
    free_space: number;
}

export class Memory {
    capacity: number;
}

export class Adapter {
    description: string;
    ip_address: string;
    subnet: string;
    dns: string;
    speed: number;
    mac: string;
    dhcp_server: string;
}

export class DeviceDetail {
    agentId: string;
}