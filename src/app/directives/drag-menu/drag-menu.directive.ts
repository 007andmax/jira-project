import { Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';

@Directive({
    selector: '[appDragMenu]',
    standalone: true
})
export class DragMenuDirective {
  @Output() dropEnd = new EventEmitter<any>();
  @Input() classDropped: string;
  @Input() classContainer: string;
  lengthItems: number = 0;
  isInit = false;
  dragStart;
  dropped;
  cancelDefault;

  constructor(private element: ElementRef) { }
  ngAfterViewInit() {
    let that = this;
    let parent = this.element.nativeElement;
    let items = this.element.nativeElement.querySelectorAll(`.${this.classContainer}`);
    this.lengthItems = items.length;
    let currentGrag;

    this.dragStart = function dragStart(e) {
      var index = $(e.target).index();
      currentGrag = $(e.target);
      e.dataTransfer.setData('text/plain', index)
    }
    this.dropped = function dropped(e) {
      that.cancelDefault(e)
      // get new and old index
      let oldIndex = Number(e.dataTransfer.getData('text/plain'));
      let target = (e.target.classList.contains(`${that.classContainer}`)) ? $(e.target) : $(e.target).parents(`.${that.classContainer}`).eq(0)
      let newIndex = Number(target.index());

      if (newIndex == oldIndex || !currentGrag || $(this).parents(`.${that.classDropped}`).children().eq(oldIndex).length == 0 ||
        $(target).attr("category-id") != $(currentGrag).attr("category-id")) return;
      let dropped = $(this).parents(`.${that.classDropped}`).children().eq(oldIndex).remove();
      if (newIndex < oldIndex) {
        target.before(dropped)
      } else {
        target.after(dropped)
      }
      that.dropEnd.emit({
        id: $(dropped).attr("id"), index: $(dropped).index() + 1
      });
    }
    this.cancelDefault = function cancelDefault(e) {
      e.preventDefault()
      e.stopPropagation()
      return false
    }
    items.forEach(item => {
      $(item).prop('draggable', true)
      item.addEventListener('dragstart', this.dragStart)
      item.addEventListener('drop', this.dropped)
      item.addEventListener('dragenter', this.cancelDefault)
      item.addEventListener('dragover', this.cancelDefault)
    })
    this.isInit = true;
  }
  ngDoCheck() {
    let items = this.element.nativeElement.querySelectorAll(`.${this.classContainer}`);
    if (this.isInit && this.lengthItems !== items.length) {
      items.forEach(item => {
        $(item).prop('draggable', false)
        item.removeEventListener('dragstart', this.dragStart)
        item.removeEventListener('drop', this.dropped)
        item.removeEventListener('dragenter', this.cancelDefault)
        item.removeEventListener('dragover', this.cancelDefault)
      })
      this.ngAfterViewInit();
    }
  }
}
