import { Directive, ElementRef, EventEmitter, Output } from '@angular/core';

@Directive({
  selector: '[appDragMenu]'
})
export class DragMenuDirective {
  @Output() dropEnd = new EventEmitter<any>();
  constructor(private element: ElementRef) { }
  ngAfterViewInit() {
    let that = this;
    let parent = this.element.nativeElement;
    let items = this.element.nativeElement.querySelectorAll('.category-item-category-body');
    items.forEach(item => {
      $(item).prop('draggable', true)
      item.addEventListener('dragstart', dragStart)
      item.addEventListener('drop', dropped)
      item.addEventListener('dragenter', cancelDefault)
      item.addEventListener('dragover', cancelDefault)
    })
    function dragStart(e) {
      var index = $(e.target).index()
      e.dataTransfer.setData('text/plain', index)
    }
    function dropped(e) {
      cancelDefault(e)
      // get new and old index
      let oldIndex = Number(e.dataTransfer.getData('text/plain'));
      let target = (e.target.classList.contains("category-item-category-body")) ? $(e.target) : $(e.target).parents(".category-item-category-body")
      let newIndex = Number(target.index());
      if (newIndex == oldIndex) return;
      let dropped = $(this).parents(".category-item-sub-category").children().eq(oldIndex).remove();
      if (newIndex < oldIndex) {
        target.before(dropped)
      } else {
        target.after(dropped)
      }
      that.dropEnd.emit({
        id: $(dropped).attr("id"), index: $(dropped).index()
      });
    }
    function cancelDefault(e) {
      e.preventDefault()
      e.stopPropagation()
      return false
    }
  }
}
