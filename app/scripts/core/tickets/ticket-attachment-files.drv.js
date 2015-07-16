'use strict';

(function () {

  angular.module("quicktech.common.directives").directive("ticketAttachmentFiles", function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, element, attrs, ctrl) {


        element.on('click', 'a', function () {
          var file = element.find('input[type=file]');
          file.replaceWith(file = file.clone(true));
          file.trigger('click');
        });

        // files selected
        element.on('change', 'input[type=file]', function (e) {
          console.log(this.files)
        })

      }

    };
  });
})();
