'use strict';

(function () {

  angular.module("quicktech.common.directives").directive("textEditor",
    ['$timeout', function ($timeout) {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function ($scope, element, attrs, ctrl) {

          // NOTE this is unidirectional implementation! All changes are aplying from editor to model
          //URLs starting with http:// or https:// before it
          var urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/gi;
          //URLs starting with www. (without // before it
          var urlPattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

          var pressOnElement, inited = false;
          var editor = element.find('[te-editor]'),
            wysiwyg = editor.wysiwyg({
              hotKeys: {
                'ctrl+b meta+b': 'bold',
                'ctrl+i meta+i': 'italic',
                'ctrl+u meta+u': 'underline',
                'ctrl+z meta+z': 'undo',
                'ctrl+y meta+y meta+shift+z': 'redo',
                'ctrl+l meta+l': 'justifyleft',
                'ctrl+r meta+r': 'justifyright',
                'ctrl+e meta+e': 'justifycenter',
                'ctrl+j meta+j': 'justifyfull',
                'shift+tab': 'outdent'
              }
            });

         $scope.$watch(function () {
            return attrs.teInitialValue;
          }, function (value) {
            if (typeof attrs.teInitialValue === 'string' && (!inited || !value)) {
              wysiwyg.html(value);
              inited = true
            }
          });
          validateRequired();

          editor.on('DOMSubtreeModified', function () {
            var html = wysiwyg.html();

            ctrl.$setViewValue(html);

            $timeout(function () {
              if (attrs.teMaxlength) {
                ctrl.$setValidity('maxlength', html.length <= attrs.teMaxlength);
              }

              validateRequired();
            })
          });

          element.on('click', "a[data-edit='cblock']", function () {
            document.execCommand('formatBlock', false, '<blockquote>');
          });

          element.on('click', "a[data-edit='removeformat']", function () {
            var cleanText = editor.text();
            editor.html(cleanText);
          });

          element.on('keydown', function () {
            pressOnElement = true;
          });

          element.on('keyup', function (event) {

            if (pressOnElement) {

              pressOnElement = false;

              if (event.keyCode === 9) {

                var nextFocusInput = $('[next-after-text-editor]');

                if (nextFocusInput.length > 0) {

                  nextFocusInput.change(function (e) {
                    e.stopImmediatePropagation();
                    $(this).off("blur");
                  });

                  nextFocusInput.focus();
                  ctrl.$setDirty();

                }
              }
            }
          });

          element.on('paste', function (e) {
            e.preventDefault();
            var cleanText = e.originalEvent.clipboardData.getData("text/plain");
            var linkCreate = cleanText.replace(urlPattern, function(x){
              return '<a target="' + x + '" href="'+x+'">'+x+'</a>';
            }).replace(urlPattern2, function(x){
                return '<a target="' + x + '" href="'+x+'">'+x+'</a>';
              });
            document.execCommand('insertHTML', false, linkCreate);
            $timeout(validateRequired);
          });

          function validateRequired() {
            if (attrs.teRequired) {
              ctrl.$setValidity('required', wysiwyg.text().length > 0);
            }
          }
        }
      }
    }]
  )

})();
