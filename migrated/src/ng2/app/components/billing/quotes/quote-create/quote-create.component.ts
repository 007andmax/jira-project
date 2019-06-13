import { ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import { QuoteCreateContentComponent } from "./quote-create-content/quote-create-content.component";
import { QuoteStateService } from "./quote-state.service";

class ChangeDetectorRefv {
}

/**
 * Password quotes create component
 */
@Component({
  selector: 'app-quote-create',
  templateUrl: './quote-create.component.html',
  styleUrls: ['./quote-create.component.scss']
})
export class QuoteCreateComponent implements OnInit {

  @ViewChild(QuoteCreateContentComponent) quoteCreateContentComponent:QuoteCreateContentComponent;
  public editMode = false;

  constructor(
    private quoteStateService: QuoteStateService,
    private cdRef:ChangeDetectorRef
  ) {
    this.getState();
  }

  ngOnInit() {
    if (!this.cdRef['destroyed']) {
      console.log('init QuotePreviewComponent');
      this.cdRef.detectChanges();
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

  public getState() {
    this.editMode = this.quoteStateService.getState().params.editMode;
  }

}
