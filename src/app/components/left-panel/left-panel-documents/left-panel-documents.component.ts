import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { DocumentsService } from 'src/app/services/documents/documents.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { CategoryDocument } from './class/category-document';

@Component({
  selector: 'app-left-panel-documents',
  templateUrl: './left-panel-documents.component.html',
  styleUrls: ['./left-panel-documents.component.scss']
})
export class LeftPanelDocumentsComponent implements OnInit, OnDestroy {
  open: boolean = false;
  @Output() onChangeState = new EventEmitter();
  @Output() onOpenPanel = new EventEmitter();
  @Input() activePage: string = "";
  categoryName: string = "";
  toggleAddCategory: boolean = false;
  categories: Array<CategoryDocument> = [];
  sub: Subscription = new Subscription();
  constructor(private documentsService: DocumentsService,
    private leftPanelStateService: LeftPanelStateService,) { }

  ngOnInit() {
    this.activePage = this.leftPanelStateService.activePage;
    let onDocumentsPage = this.leftPanelStateService.onDocumentsPage.subscribe(data => {
      this.activePage = data;
    })
    this.sub.add(onDocumentsPage);
    this.leftPanelStateService.onToggleLeftPanel.subscribe(data => {
      if (data) this.open = false;
    })
    this.leftPanelStateService.onChangeState.subscribe(state => {
      if (!this.isDocumentsState(state)) this.open = false;
    })
    this.leftPanelStateService.onFirstOpen.subscribe(data => {
      if (this.isDocumentsState(data)) this.open = true;
    })
    this.documentsService.getCategories().subscribe((data: any) => {
      this.categories = data.map(item => new CategoryDocument(item));
    })
  }
  onAddCategory() {
    if (this.categoryName.length > 0) {
      this.documentsService.addCategories(this.categoryName).subscribe(data => {
        this.toggleAddCategory = false;
        this.categoryName = "";
      })
    } else {
      this.toggleAddCategory = false;
      this.categoryName = "";
    }
  }

  isDocumentsState(state) {
    return (state === 'new-documents')
  }
  public close() {
    this.open = false;
  }
  openPanel() {
    this.onOpenPanel.emit(null);
  }
  public goToState() {
    this.onChangeState.emit('new-documents');
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
