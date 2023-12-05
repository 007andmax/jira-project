import {
  Directive,
  Output,
  Input,
  EventEmitter,
  HostBinding,
  HostListener,
  OnInit
} from '@angular/core';

@Directive({
  selector: '[appDnd]'
})
export class DndDirective implements OnInit {
  @HostBinding('class.fileover') fileOver: boolean;
  @Output() fileDropped = new EventEmitter<any>();

  ngOnInit() {
    console.log("DndDirective");
  }

  // Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(evt) {
    console.log("dragover");
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = true;
  }

  // Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    console.log("dragleave");
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
  }

  // Drop listener
  @HostListener('drop', ['$event']) public ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
    let files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.fileDropped.emit(files);
    }
  }
}
