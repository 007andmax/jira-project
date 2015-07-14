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
            element.click(function () {

              var editor = element.find('[te-editor]'),
                wysiwyg = editor.wysiwyg();

              wysiwyg.on('change', function () {
                ctrl.$setViewValue(wysiwyg.html());
                console.log(ctrl.$viewValue)
              });

              element.on('click', "a[data-edit='cblock']", function () {
                document.execCommand('formatBlock', false, '<blockquote>');
              });

              element.on('click', "a[data-edit='cremoveformat']", function () {
                var cleanText = editor.text();
                editor.html(cleanText);
              });
            });
          }
        }
      }]);
})();
