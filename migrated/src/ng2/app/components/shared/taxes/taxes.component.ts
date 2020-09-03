import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { TaxesStateService } from 'src/ng2/app/states/taxes/taxes-state.service';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Tax } from 'src/ng2/app/interfaces/service/tax';
import { Subscription } from 'rxjs';
import { TaxesService } from 'src/ng2/app/services/taxes/taxes.service';
 

@Component({
  selector: 'app-taxes',
  templateUrl: './taxes.component.html',
  styleUrls: ['./taxes.component.scss']
})
export class TaxesComponent implements OnInit, OnDestroy {
  @Input() selectedTax = [];
  taxes: Array<Tax> = [];
  sub = new Subscription();
  editItem: any;
  newTax: Tax = null;
  taxForm: FormGroup;
  @ViewChild('userInput') userInput: ElementRef<HTMLInputElement>;
  @ViewChild('addTax') containerAddTax;
  @ViewChild('taxesDropDown') taxesDropDown;
  @Output() taxesChange = new EventEmitter();


  public constructor(
    private taxesStateService: TaxesStateService,
    private taxesService: TaxesService,
    private fb: FormBuilder,
    public cd: ChangeDetectorRef,
  ) { }

  /**
   * Initializes modal quotes. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  public ngOnInit() {
    if (this.taxesStateService.getTaxes().length > 0) this.taxes = this.taxesStateService.getTaxes();
    let getOnTaxess = this.taxesStateService.onGetTaxes.subscribe((data) => {
      this.taxes = data;
    })
    this.sub.add(getOnTaxess);
    this.onInitClearState();
    this.onCheckEditItem();
  }

  public onAddTax() {
    this.taxesService.addTax(this.taxForm.value).subscribe((data: Tax) => {
      this.selected(data);
      this.containerAddTax.close();
      this.cd.detectChanges();
    })
  }

  public setEditItem(data) {
    this.selectedTax = data;
  }


  /**
  * Subscribe for edit mode
  */
  private onCheckEditItem() {
    let getTagsFromEdit = this.taxesStateService.getTaxesFromEdit().subscribe((data) => {
      this.selectedTax = data;
      this.cd.detectChanges();
      console.log("this.selectedTax",this.selectedTax);
    });
    this.sub.add(getTagsFromEdit);
  }

  /**
  * Subscribe for clear data
  */
  private onInitClearState() {
    let getClearState = this.taxesStateService.getClearState().subscribe(() => this.close());
    this.sub.add(getClearState);
  }

  public onInitAddTax() {
    this.taxesDropDown.close();
    this.taxForm = this.fb.group({
      name: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(30)]],
      rate: ['', [Validators.required,
      Validators.min(0.01),
      Validators.max(99)]],
      isDefault: [false]
    });
    this.containerAddTax.open();
  }

  /**
   * Remove tag from selected
   * @param index - user index
   */
  public remove(index): void {
    if (index >= 0) {
      this.selectedTax.splice(index, 1);
      this.taxesChange.emit(this.selectedTax);
    }
  }
  getSelectedTaxes() {
    return this.selectedTax.map(item => {
      return `${item.name} ${item.rate}%`;
    }).join(",");
  }
  /**
   * Add tag to selected
   * @param tag - selected tag
   */
  public selected(tax): void {
    const findIndex = this.selectedTax.findIndex(item => item.id === tax.id);
    if (findIndex > -1) {
      this.selectedTax.splice(findIndex, 1);
    } else {
      this.selectedTax.push(tax);
    }
    this.taxesChange.emit(this.selectedTax);
  }
  public checkTaxIsSelected(tax) {
    const find = this.selectedTax.find(item => item.id === tax.id);
    return (find) ? true : false;
  }

  /**
   * Close tags list
   */
  public close() {
    this.selectedTax = [];
    this.taxesChange.emit(this.selectedTax);
  }

  public trackById(index, item) {
    return item.id;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
