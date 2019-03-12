'use strict';

(function () {

  angular.module("quicktech.common.directives").directive("ticketAttachmentFiles", function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        attachmentFunc: '=attachmentFunc'
      },
      link: function (scope, element) {


        element.on('click', 'a', function (e) {
          if (!angular.element(e.target).hasClass('disabled')) {
            var file = element.find('input[type=file]');
            file.replaceWith(file = file.clone(true));
            file.trigger('click');
          }
        });

        element.on('change', 'input[type=file]', function () {
          for (var i = 0; i < this.files.length; i++) {
            scope.attachmentFunc(this.files[i]);
          }
        })

      }

    };
  });
})();
