
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DocumentsService } from 'src/app/services/documents/documents.service';
import { TagsService } from 'src/app/services/tags/tags.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { TagsStateService } from 'src/app/states/tags/tags-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { DocumentAdd } from './class/document-add';
import { DocumentValidate } from './class/document-validate';
import { fadeInAnimation } from 'src/app/animations';
import { DocumentsAddBodyComponent } from './documents-add-body/documents-add-body.component';
import { DocumentsAddFooterComponent } from './documents-add-footer/documents-add-footer.component';
import { DocumentsAddHeaderComponent } from './documents-add-header/documents-add-header.component';
import { DocumentsAddInfoComponent } from './documents-add-info/documents-add-info.component';

@Component({
  standalone: true,
  imports: [DocumentsAddBodyComponent, DocumentsAddFooterComponent, DocumentsAddHeaderComponent, DocumentsAddInfoComponent, CommonModule],
  selector: 'app-documents-add',
  templateUrl: './documents-add.component.html',
  animations: [fadeInAnimation],
  // attach the fade in animation to the host (root) element of this component
  host: { '[@fadeInAnimation]': '' },
  styleUrls: ['./documents-add.component.scss'],

})
export class DocumentsAddComponent implements OnInit, OnDestroy {
  companyId: string;
  templateId: string;
  openAside: boolean = true;
  currentUser: any;
  showPreloader: boolean = false;
  requiredCompanyType: boolean = false;
  attachments = [];
  documentValidate: DocumentValidate = new DocumentValidate();
  documentAdd: DocumentAdd = new DocumentAdd();
  sub: Subscription = new Subscription();
  constructor(private usersStateService: UsersStateService,
    public activateRoute: ActivatedRoute,
    public documentsService: DocumentsService,
    public cd: ChangeDetectorRef,
    public tagsService: TagsService,
    public companiesStateService: CompaniesStateService,
    public leftPanelStateService: LeftPanelStateService) {
  }

  ngOnInit() {
    let queryParams = this.activateRoute.queryParams.subscribe(
      (queryParam: any) => {
        if (queryParam['companyId']) {
          this.companyId = queryParam['companyId'];
          this.companiesStateService.setCompanyRoutingId(this.companyId);
          this.leftPanelStateService.changeStateWithoutNavigate('new-add-documents-company');
        }
        if (queryParam['template']) this.templateId = queryParam['template'];
        if (queryParam['id_category']) this.documentAdd.setCategoryId(queryParam['id_category']);
        if (queryParam['clone_document']) {
          this.showPreloader = true;
          this.cd.detectChanges();
          this.documentsService.getDocument(queryParam['clone_document']).subscribe(data => {
            this.documentAdd.setData(data);
            this.documentValidate.setUniqueTittle(false);
            if (queryParam['template']) {
              this.documentAdd.setClientType(null);
              this.tagsService.getTagsCompanyById(this.companyId).subscribe((tags: any) => {
                let companyTag = tags.commonTagViews;
                if (companyTag) this.documentAdd.tags.push(...companyTag);
                this.documentAdd.setClientType(null);
                this.documentAdd.linked.companies.push(this.companyId);
              })
            }
            this.showPreloader = false;
            this.cd.detectChanges();
          })
        }
      }
    );
    this.sub.add(queryParams);
    if (!this.companyId) this.leftPanelStateService.changeStateWithoutNavigate('new-add-documents');
    if (this.companyId) this.leftPanelStateService.changeStateWithoutNavigate('new-add-documents-company');
    if (this.usersStateService.getCurrentUser()) this.currentUser = this.usersStateService.getCurrentUser();
    let getOnGetCurrentuser = this.usersStateService.getOnGetCurrentuser().subscribe(data => {
      this.currentUser = data;
    })
    this.sub.add(getOnGetCurrentuser);
  }
  onChangeAttachments(data) {
    this.attachments = data;
  }
  onChangeContent(data) {
    this.documentAdd.setContent(data);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.companiesStateService.setCompanyRoutingId(null);
  }
}
