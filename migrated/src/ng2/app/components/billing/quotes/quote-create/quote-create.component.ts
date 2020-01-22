import { ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import { QuoteCreateContentComponent } from "./quote-create-content/quote-create-content.component";
import { QuoteStateService } from "./quote-state.service";

/**
 *  Quotes create component
 */
@Component({
  selector: 'app-quote-create',
  templateUrl: './quote-create.component.html',
  styleUrls: ['./quote-create.component.scss']
})
export class QuoteCreateComponent implements OnInit {

  @ViewChild(QuoteCreateContentComponent) quoteCreateContentComponent:QuoteCreateContentComponent;
  public editMode = false;

  /**
   * Creates an instance of the QuoteCreateComponent with the injected services
   * @param {QuoteStateService} quoteStateService to work quote state
   */
  constructor(
    private quoteStateService: QuoteStateService
  ) {
    this.getState();
  }

  /**
   * Initializes quotes create. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    console.log('efefef',this.quoteStateService.getQuoteCreate());
   if (!this.editMode) {
    this.quoteStateService.resetQuote();
   } else {
    this.quoteStateService.setSelectedNoteFull(this.quoteStateService.getQuoteCreate().regularNote);
   }
  }

  /**
   * Create quote and save
   */
  public saveAndContinue() {
    this.quoteCreateContentComponent.saveAndContinue();
  }

  /**
   * Create quote and approve
   */
  public approve() {
    this.quoteCreateContentComponent.approveQuote();
  }

  /**
   * Create quote and download pdf
   */
  public download() {
    this.quoteCreateContentComponent.downloadPdf();
  }

  /**
   * get edit mode state
   */
  public getState() {
    this.editMode = this.quoteStateService.getState().params.editMode;
  }

}
