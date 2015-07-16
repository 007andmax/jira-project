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

              editor.on('DOMSubtreeModified', function () {
                var html = wysiwyg.html();
                  ctrl.$setViewValue(html);

                if(attrs.teMaxlength){
                  ctrl.$setValidity('maxlength', html.length <= attrs.teMaxlength);
                }

                if(attrs.teRequired){
                  ctrl.$setValidity('required', wysiwyg.text().length > 0);
                }
              });

              element.on('click', "a[data-edit='cblock']", function () {
                document.execCommand('formatBlock', false, '<blockquote>');
              });

              element.on('click', "a[data-edit='removeformat']", function () {
                var cleanText = editor.text();
                editor.html(cleanText);
              });
            });
          }
        }
      }]);
})();
