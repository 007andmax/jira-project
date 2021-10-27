import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { DELETE_CATEGORY_PRODUCT, DELETE_TICKET_STATUS } from 'src/app/const/confirm';
import { CategoryProduct } from 'src/app/interfaces/product/category-product';
import { LeftPanelService } from 'src/app/services/left-panel/left-panel.service';
import { ModalEditCategoryProductComponent } from 'src/app/services/modal/modal-edit-category-product/modal-edit-category-product.component';
import { ProductService } from 'src/app/services/product/product.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { InventoryStateService } from 'src/app/states/inventory/inventory-state.service';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { StatusColor } from '../../tickets/class/status-color';
import { TicketStatus } from './class/ticket-status';

@Component({
  selector: 'customizable-lists',
  templateUrl: './customizable-lists.component.html',
  styleUrls: ['./customizable-lists.component.scss']
})
export class CustomizableListsComponent implements OnInit, OnDestroy {
  activeTab: string = "productCategories";
  showAddCategory: boolean = false;
  showAddTicketStatus: boolean = false;
  categoriesProducts: Array<CategoryProduct> = [];
  ticketsStatus: Array<TicketStatus> = [];
  statusColors: Array<StatusColor> = [];
  editTicketsStatus: TicketStatus;
  sub: Subscription = new Subscription();
  constructor(private inventoryStateService: InventoryStateService,
    private confirmStateService: ConfirmStateService,
    private productService: ProductService,
    private ticketsService: TicketsService,
    private ticketsStateService: TicketsStateService,
    private leftPanelService: LeftPanelService,
    private modalService: NgbModal,) { }


  ngOnInit() {
    $('body').addClass('ng7');
    $('body').removeClass('backMenu');
    this.categoriesProducts = this.inventoryStateService.getCategories();
    this.inventoryStateService.onGetCategories.subscribe(data => {
      this.categoriesProducts = data;
      console.log("this.categoriesProducts", this.categoriesProducts);
    })
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_CATEGORY_PRODUCT) {
          this.onRemoveCategoryProduct(this.inventoryStateService.getCategoryForDelete().id);
        }
        if (this.confirmStateService.getConfirmAction() === DELETE_TICKET_STATUS) {
          this.onRemoveTicketStatus(this.ticketsStateService.getTicketStatusForRemove().id);
        }
      }
    })
    this.sub.add(getConfirm);
    let onGetTicketsStatus = this.ticketsStateService.onGetTicketsStatus.subscribe(data => {
      this.ticketsStatus = data;
    })
    this.sub.add(onGetTicketsStatus);
  }
  create() {
    if (this.activeTab === "productCategories") this.showAddCategory = true;
    if (this.activeTab === "ticketStatus") this.showAddTicketStatus = true;
  }
  getColors() {
    if (this.ticketsStateService.getListStatusColor().length === 0) {
      this.leftPanelService.getColors().subscribe((data: any) => {
        this.statusColors = data.map(item => {
          return new StatusColor(item.backgroundColor, item.borderColor);
        })
      })
    } else {
      this.statusColors = this.ticketsStateService.getListStatusColor();
    }
    console.log("this.statusColors", this.statusColors);
  }
  onRemoveCategoryProduct(id) {
    this.productService.removeCategory(id).subscribe(data => {

    })
  }
  onRemoveTicketStatus(id) {
    this.ticketsService.removeTicketStatus(id).subscribe(data => {

    })
  }
  editCategoryProduct(data) {
    const modalRef = this.modalService.open(ModalEditCategoryProductComponent, { windowClass: 'quote-send-modal' });
    modalRef.componentInstance.categoryProduct = data;
  }
  removeCategoryProduct(data) {
    this.confirmStateService.setConfirmAction(DELETE_CATEGORY_PRODUCT);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal' });
    modalRef.componentInstance.message = `Do you want to delete this category?`;
    this.inventoryStateService.setCategoryForDelete(data);
  }
  removeTicketStatus(data) {
    this.confirmStateService.setConfirmAction(DELETE_TICKET_STATUS);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal' });
    modalRef.componentInstance.message = `Do you want to delete this status?`;
    this.ticketsStateService.setTicketStatusForRemove(data);
  }
  setTab(data) {

    this.activeTab = data['nextId'];
    if (data['nextId'] === 'productCategories') {
      this.categoriesProducts = this.inventoryStateService.getCategories();
    } else if (data['nextId'] === 'ticketStatus') {
      this.getColors();
      this.ticketsStatus = this.ticketsStateService.getTicketsStatus();
    } else if (data['nextId'] === 'tab3') {

    }

  }
  resetEditTicketsStatus() {
    this.editTicketsStatus = null;
  }
  parseColor(i) {
    return (this.statusColors.length > 0) ? this.statusColors[i].borderColor : "";
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
