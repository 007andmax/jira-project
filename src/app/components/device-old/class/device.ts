export class command {
    companyId: string;
    agentId: string;
    sessionId: string;
    scriptType: string;
    script: string;
    file: boolean;
    keepOpen: boolean;
}

export class script {
    title: string;
    type: string;
    command: string;
    default: boolean;
    id: string;
    category: string;
    categoryId: string; 
    typeName: string;
    description: string;
}

export class commandModal {
    title: string;
    type: string;
    command: string;
    id: string;
    category: string;
    categoryId: string; 
    typeName: string;
    description: string;
}

export class scriptModal {
    category: string;
    categoryId: string;
    search: string;
}