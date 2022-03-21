import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appDragMenu]'
})
export class DragMenuDirective {

  constructor(private element: ElementRef) { }
  ngAfterViewInit() {

    console.log("this.element.nativeElement", this.element.nativeElement);
    let parent = this.element.nativeElement;
    let items = this.element.nativeElement.querySelectorAll('.category-item-category');
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
      console.log($(parent).parents(".category-item").attr("index"));
      console.log($(this).attr("index"));
      console.log($(e.target).attr("index"));
      // get new and old index
      let oldIndex = Number(e.dataTransfer.getData('text/plain'));
      let target = (e.target.classList.contains("category-item-category")) ? $(e.target) : $(e.target).parent(".category-item-category")
      let newIndex = Number(target.index());
      console.log("target", target);
      if ($(e.target).parents(".category-item").attr("index") != $(parent).parents(".category-item").attr("index")) console.log(1);
      if ($(e.target).parents(".category-item").attr("index") != $(this).parents(".category-item").attr("index")) console.log(2);
      // remove dropped items at old place
      //  console.log($(this).parents(".category-item-sub-category").children());
      if (newIndex == oldIndex) return;
      let dropped = $(this).parents(".category-item-sub-category").children().eq(oldIndex).remove();
      console.log("dropped", dropped);

      console.log("newIndex", newIndex);
      console.log("oldIndex", oldIndex);
      // insert the dropped items at new place

      if (newIndex < oldIndex) {
        target.before(dropped)
      } else {
        target.after(dropped)
      }
    }

    function cancelDefault(e) {
      e.preventDefault()
      e.stopPropagation()
      return false
    }
  }
}
