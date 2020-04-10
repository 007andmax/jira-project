export class ExportCSV {
    url: string;
    data: any;
    fileName:string;
    constructor(url, data,fileName) {
        this.url = url;
        this.data = data;
        this.fileName = fileName;
    }
}