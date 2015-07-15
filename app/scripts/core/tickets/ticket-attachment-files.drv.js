'use strict';

(function () {

  angular.module("quicktech.common.directives").directive("ticketTextEditor", function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs, ctrl) {

        element.on('click', '[choose-attachment-files]', function () {
          var file = element.find('a[type=file]');
          file.replaceWith(file = file.clone(true));
          file.trigger('click');
          console.log('click');
        });

      }

    };
  });
})();
