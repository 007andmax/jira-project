import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { Tag } from 'src/ng2/app/interfaces/tag/tag';
import { Subscription } from 'rxjs';
import { TagsService } from 'src/ng2/app/services/tags/tags.service';
import { TagsStateService } from '../../shared/tags/services/tags-state.service';
import { MatChipInputEvent } from '@angular/material';
import { CompanySubscription } from '../class/company-subscription';
import { CompanySubscriptionStateService } from './class/company-subscription-state.service';

@Component({
  selector: 'app-company-subscription',
  templateUrl: './company-subscription.component.html',
  styleUrls: ['./company-subscription.component.scss']
})
export class CompanySubscriptionComponent implements OnInit, OnDestroy {

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  focus = false;
  isResend = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  subCtrl = new FormControl();
   
  sub = new Subscription();
  editItem:any;
  @ViewChild('userInput') userInput: ElementRef<HTMLInputElement>;
  @Output() subscribeChange = new EventEmitter();
  subscriptions:Array<CompanySubscription> = [new CompanySubscription('Ticket Updates','ticket'),
  new CompanySubscription('Ticket Manager','ticketManager'),
  new CompanySubscription('Invoice Updates','invoice')];
  /**
   * Creates an instance of the TagsComponent with the injected services
   * @param {TagsService} tagsService Service to work with tags
   * @param {TagsStateService} tagsState to work with tags state
   */
  public constructor(
  
    private tagsState: TagsStateService,
    private companySubscriptionState:CompanySubscriptionStateService
  ) { }

  /**
   * Initializes modal quotes. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  public ngOnInit() {
    
    this.onInitClearState();
    this.onCheckEditItem();
  }

  /**
  * Subscribe for edit mode
  */
  private onCheckEditItem () {
    let getEditMode = this.companySubscriptionState.getOnEditMode().subscribe((data) =>{
      this.subscriptions.forEach(item => item.selected = data[item.field]);
    })
    this.sub.add(getEditMode);
  /*  let getTagsFromEdit = this.tagsState.getTagsFromEdit().subscribe((data) => {
      this.selectedTag = data;
    });
    this.sub.add(getTagsFromEdit);*/
  }

  /**
  * Subscribe for clear data
  */
  private onInitClearState() {
    let getClearState = this.tagsState.getClearState().subscribe(() => this.close());
    this.sub.add(getClearState);
  }

   

  /**
   * Remove tag from selected
   * @param index - user index
   */
  public remove(index): void {
    if (index >= 0) {
      this.subscriptions[index].selected = false;
      this.subscribeChange.emit(this.subscriptions);
    }
  }

  /**
   * Add tag to selected
   * @param tag - selected tag
   */
  public selected(index): void {
    this.subscriptions[index].selected = !this.subscriptions[index].selected;
   
    this.subscribeChange.emit(this.subscriptions);
  //  this.userInput.nativeElement.blur();
    this.subCtrl.setValue(null);
  }

  /**
   * Close tags list
   */
  public close() {
   
    this.subscriptions.forEach(item => item.selected = false);
    this.subscribeChange.emit(this.subscriptions);
  }

  public trackById(index, item) {
    return item.id;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
