import { CategoryDocument } from "src/app/components/left-panel/left-panel-documents/class/category-document"

export class DocumentEditCategory extends CategoryDocument {
    assignedCompaniesIds = [];
    assignedCompanyTypes = [];
    assignedToCompany: boolean;
    constructor(data) {
        super(data);
        this.assignedCompaniesIds = data.assignedCompaniesIds;
        this.assignedCompanyTypes = data.assignedCompanyTypes;
        this.assignedToCompany = data.assignedToCompany;
    }
    public getDataForUpdate() {
        return {
            "name": this.name,
            "assignedCompanyTypes": this.assignedCompanyTypes,
            "assignedCompaniesIds": this.assignedCompaniesIds
        }
    }
    public addAssignedCompaniesIds(data) {
        this.assignedCompaniesIds.push(data);
    }
    public removedAssignedCompaniesIds(data) {
        this.assignedCompaniesIds.splice(data, 1);
    }
    public addAssignedCompanyTypes(data) {
        this.assignedCompanyTypes.push(data);
    }
    public removedAssignedCompanyTypes(data) {
        this.assignedCompanyTypes.splice(data, 1);
    }
    public setAssignedCompaniesIds(data) {
        this.assignedCompaniesIds = data;
    }
}