import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { GlobalSearchService } from 'src/ng2/app/services/global-search/global-search.service';
import { GlobalSearchResult } from './class/global-search-result';
import { GlobalSearchResultItem } from './class/global-search-result-item';

@Component({
  selector: 'app-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss']
})
export class GlobalSearchComponent implements OnInit {
  @ViewChild('globalSearch') globalSearch: NgbDropdown;
  list: Array<GlobalSearchResult> = [];
  word: string = "";
  constructor(private globalSearchService: GlobalSearchService) { }

  ngOnInit() {
  }
  onSearch() {
    this.globalSearchService.search(this.word).subscribe(data => {
      this.list = data;
      this.globalSearch.open();
      console.log(this.list);
    })
  }
  onCloseProducts(open) {

  }
  showInfo(item: GlobalSearchResultItem) {
    if (item.type === 'COMPANIES') {
      localStorage.setItem("company_id", item.id);
      let body = document.querySelector('.left-panel__category-wrap');
      var link = document.createElement('a');
      body.appendChild(link);
      link.href = `#/ng2/company/dashboard/${item.id}`
      var e = document.createEvent('MouseEvents');
      e.initEvent('click', true, true);
      link.dispatchEvent(e);
    }
  }
  isShowType(type) {
    if (type === 'TICKETS' || type === 'COMPANIES' || type === 'USERS' || type === 'SERVICES') return true;
    return false;
  }
  getText(type) {
    if (type === 'TICKETS') return 'Tickets';
    if (type === 'COMPANIES') return 'Companies';
    if (type === 'USERS') return 'Users';
    if (type === 'SERVICES') return 'Services';
  }

}
