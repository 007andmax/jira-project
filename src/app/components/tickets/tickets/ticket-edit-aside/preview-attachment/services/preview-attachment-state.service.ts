import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PreviewAttachmentStateService {

  preview: EventEmitter<string> = new EventEmitter();
  constructor() { }

  
  public onInitPreview(message: string) {
    this.preview.emit(message);

  }

 
  public getOnPreview() {
    return this.preview;
  }
}
