import { Component, ElementRef, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-get-direction',
  templateUrl: './get-direction.component.html',
  styleUrls: ['./get-direction.component.scss']
})
export class GetDirectionComponent {
  @Input() mapSrc: string = '';
  constructor(
    public activeModal: NgbActiveModal, private eRef: ElementRef,
    private sanitizer: DomSanitizer,) {

  }
  mapUrl() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.mapSrc);
  }
  close() {
    this.activeModal.close();
  };
}
