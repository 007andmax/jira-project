'use strict';

(function () {
  angular.module("quicktech.core.companies").directive('scrollToProduct', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var categories;
        var wrapper;
        var category;
        // console.log(element, 'element');
        // element.bind('click', function (eventt) {
        //   console.log(event);
        //   wrapper = element[0].querySelector('.dropdown-menu.custom-product-list');
        //   console.log(wrapper, 'wrapper');
        //   categories = element[0].querySelectorAll('.category-conteiner');
        //   console.log(categories, 'categories');
        //   // document.getElementById('scrolling_div').scrollTop = 40;
        //   Array.from(categories).forEach(link => {
        //     link.addEventListener('click', function(event) {
        //       category = element[0].querySelector('.category-conteiner.active');
        //       console.log(categories, 'categories');
        //       console.log(categories.position(), 'position');
        //       console.log('test');
        //     });
        //   });
        // });

      }
    }
  });
})();
