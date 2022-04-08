import { Component, Input, OnInit } from '@angular/core';
import { SupportPageCategory } from '../../left-panel-super-admin-categories/class/support-page-category';
import { SupportPageCategoryContent } from '../class/support-page-category-content';

@Component({
  selector: 'support-page-info',
  templateUrl: './support-page-info.component.html',
  styleUrls: ['./support-page-info.component.scss']
})
export class SupportPageInfoComponent implements OnInit {
  @Input() selectedCategory: SupportPageCategory;
  @Input() supportPageCategoryContent: SupportPageCategoryContent;
  @Input() isPreview: boolean;
  constructor() { }

  ngOnInit() {
  }
  onChangeTags(data) {
    this.supportPageCategoryContent.setIdTags(data);
  }

}
