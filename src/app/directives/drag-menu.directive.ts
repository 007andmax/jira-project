import { Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';

@Directive({
  selector: '[appDragMenu]'
})
export class DragMenuDirective {
  @Output() dropEnd = new EventEmitter<any>();
  @Input() classDropped: string;
  lengthItems: number = 0;
  isInit = false;
  constructor(private element: ElementRef) { }
  ngAfterViewInit() {
    let that = this;
    let parent = this.element.nativeElement;
    let items = this.element.nativeElement.querySelectorAll('.category-item-category-body');
    this.lengthItems = items.length;
    console.log("items", items);
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
      let target = (e.target.classList.contains("category-item-category-body")) ? $(e.target) : $(e.target).parents(".category-item-category-body").eq(0)
      let newIndex = Number(target.index());
      console.log("target", target);
      console.log("newIndex", newIndex);
      console.log("oldIndex", oldIndex);
      if (newIndex == oldIndex) return;
      console.log($(this).parents(`.${that.classDropped}`));
      let dropped = $(this).parents(`.${that.classDropped}`).children().eq(oldIndex).remove();
      console.log("dropped", dropped);
      if (newIndex < oldIndex) {
        target.before(dropped)
      } else {
        target.after(dropped)
      }
      console.log("$(dropped).index()", $(dropped).index());

      that.dropEnd.emit({
        id: $(dropped).attr("id"), index: $(dropped).index() + 1
      });
    }
    function cancelDefault(e) {
      e.preventDefault()
      e.stopPropagation()
      return false
    }
    this.isInit = true;
  }
  ngDoCheck() {
    let items = this.element.nativeElement.querySelectorAll('.category-item-category-body');
    if (this.isInit && this.lengthItems !== items.length) {
      items.forEach(item => {
        $(item).prop('draggable', false)
        $(item).unbind('dragstart')
        $(item).unbind('drop')
        $(item).unbind('dragenter')
        $(item).unbind('dragover')
      })
      this.ngAfterViewInit();
    }
  }
}
