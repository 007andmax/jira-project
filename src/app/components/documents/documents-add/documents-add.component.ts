import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DocumentsService } from 'src/app/services/documents/documents.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { TagsStateService } from 'src/app/states/tags/tags-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { CompanyTagsStateService } from '../../companies/company-tags/states/company-tags-state.service';
import { DocumentAdd } from './class/document-add';
import { DocumentValidate } from './class/document-validate';

@Component({
  selector: 'app-documents-add',
  templateUrl: './documents-add.component.html',
  styleUrls: ['./documents-add.component.scss']
})
export class DocumentsAddComponent implements OnInit {
  companyId: string;
  templateId: string;
  openAside: boolean = true;
  currentUser: any;
  showPreloader: boolean = false;
  requiredCompanyType: boolean = false;
  documentValidate: DocumentValidate = new DocumentValidate();
  documentAdd: DocumentAdd = new DocumentAdd();
  sub: Subscription = new Subscription();
  constructor(private usersStateService: UsersStateService,
    public activateRoute: ActivatedRoute,
    public documentsService: DocumentsService,
    public cd: ChangeDetectorRef,
    private tagsStateService: TagsStateService,
    public leftPanelStateService: LeftPanelStateService) {
  }

  ngOnInit() {
    let queryParams = this.activateRoute.queryParams.subscribe(
      (queryParam: any) => {
        if (queryParam['companyId']) this.companyId = queryParam['companyId'];
        if (queryParam['template']) this.templateId = queryParam['template'];
        if (queryParam['id_category']) this.documentAdd.setCategoryId(queryParam['id_category']);
        if (queryParam['clone_document']) {
          this.showPreloader = true;
          this.cd.detectChanges();
          this.documentsService.getDocument(queryParam['clone_document']).subscribe(data => {
            this.documentAdd.setData(data);

            this.documentValidate.setUniqueTittle(false);
            if (queryParam['template']) {
              let companyTag = this.tagsStateService.getTags().find(item => item.companyId === this.companyId);
              console.log("companyTag", companyTag);
              if (companyTag) this.documentAdd.tags.push(companyTag.id);
              this.documentAdd.setClientType(null);
              this.documentAdd.linked.companies.push(this.companyId);
            }
            this.showPreloader = false;
            this.cd.detectChanges();
          })
        }
      }
    );
    this.sub.add(queryParams);
    this.leftPanelStateService.changeStateWithoutNavigate('new-add-documents');
    if (this.usersStateService.getCurrentUser()) this.currentUser = this.usersStateService.getCurrentUser();
    this.usersStateService.getOnGetCurrentuser().subscribe(data => {
      this.currentUser = data;
    })
  }
  onChangeContent(data) {
    this.documentAdd.setContent(data);
  }
}
