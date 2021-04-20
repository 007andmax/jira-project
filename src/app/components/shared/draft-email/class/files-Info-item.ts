export class FilesInfoItem {
    error: boolean = false;
    message:string = "";
    code: number = 0;
    progress:number = 0;
    id:string;
    constructor () {}

    public setError(error,message,code) {
        this.error = error;
        this.message = message;
        this.code = code;
    }
    public setFileId (id) {
        this.id = id;
    }
}