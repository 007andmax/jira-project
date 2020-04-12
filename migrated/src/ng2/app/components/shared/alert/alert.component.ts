import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
 
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  @Input() message: string = '';
  

  /**
   * Creates an instance of the AlertComponent with the injected services
   
   * @param {ChangeDetectorRef} cdRef Service to work with date
   */
  constructor( 
    public cd: ChangeDetectorRef, public activeModal: NgbActiveModal) { }

     /**
   * Initializes alert. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
   
  }
  cancelConfirm() {
    this.activeModal.close();
   
  };

}
