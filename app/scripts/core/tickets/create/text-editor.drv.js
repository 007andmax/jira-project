'use strict';

(function () {

  angular.module("quicktech.core.tickets").directive("textEditor",
    ['$state', '$modal',
      function ($state, $modal) {
        return {
          restrict: 'A',
          require: 'ngModel',
          link: function ($scope, element, attrs, ctrl) {

            // NOTE this is unidirectional implementation! All changes are aplying from editor to model

            var editor = element.find('[te-editor]'),
              wysiwyg = editor.wysiwyg();

            validateRequired();

            editor.on('DOMSubtreeModified', function () {
              var html = wysiwyg.html();
              ctrl.$setViewValue(html);

              if (attrs.teMaxlength) {
                ctrl.$setValidity('maxlength', html.length <= attrs.teMaxlength);
              }

              validateRequired();
            });

            element.on('click', "a[data-edit='cblock']", function () {
              document.execCommand('formatBlock', false, '<blockquote>');
            });

            element.on('click', "a[data-edit='removeformat']", function () {
              var cleanText = editor.text();
              editor.html(cleanText);
            });

            function validateRequired() {
              if (attrs.teRequired) {
                ctrl.$setValidity('required', wysiwyg.text().length > 0);
              }
            }
          }
        }
      }]);
})();
