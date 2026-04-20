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
    selector: '[appDnd]',
    standalone: true
})
export class DndDirective implements OnInit {
  @HostBinding('class.fileover') fileOver: boolean;
  @Output() fileDropped = new EventEmitter<any>();
  @Output() onDragover = new EventEmitter<any>();
  @Output() onDragleave = new EventEmitter<any>();
  ngOnInit() {
  }

  // Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = true;
    this.onDragover.emit(null);
  }

  // Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
    this.onDragleave.emit(null);
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
