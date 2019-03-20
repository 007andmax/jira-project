'use strict';

(function () {

  angular.module("quicktech.common.directives").directive("textEditor",
    [
      '$timeout', '$sce', function ($timeout, $sce) {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function ($scope, element, attrs, ctrl) {

          // NOTE this is unidirectional implementation! All changes are aplying from editor to model
          var urlPattern = /(\b(www\.\S+\b))|(\b(http|ftp|https):\/\/(www\.)?[\w-]+(\.[\w-]+)+\b([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?)/gim;
          var htmlTagsWhitelist = new RegExp('\(\?:<' +
            'head\(\?:\.\*\?\\s\*\?\)\+\?<\/head>\)\|\(\?:<\\s\*\(\?!b\(\?:>\|\\s\)\|blockquote\|br\|caption\|cite\|' +
            'code\|col\|colgroup\|dd\|div\|dl\|dt\|em\(\?:>\|\\s\)\|h1\|h2\|h3\|h4\|h5\|h6\|i\(\?:>\|\\s\)\|li\|ol\|p' +
            '\(\?:>\|\\s\)\|pre\|q\(\?:>\|\\s\)\|small\|strike\|strong\|sub\|sup\|table\|tbody\|td\|tfoot\|th\|thead' +
            '\|tr\|u\(\?:>\|\\s\)\|ul\|span\|\/b\(\?:>\|\\s\)\|\/blockquote\|\/br\|\/caption\|\/cite\|\/code\|\/col\|' +
            '\/colgroup\|\/dd\|\/div\|\/dl\|\/dt\|\/em\(\?:>\|\\s\)\|\/h1\|\/h2\|\/h3\|\/h4\|\/h5\|\/h6\|\/i\(\?:>\|' +
            '\\s\)\|\/li\|\/ol\|\/p\(\?:>\|\\s\)\|\/pre\|\/\/q\(\?:>\|\\s\)\|\/small\|\/strike\|\/strong\|\/sub\|\/' +
            'sup\|\/table\|\/tbody\|\/td\|\/tfoot\|\/th\|thead\|\/tr\|\/u\(\?:>\|\\s\)\|\/ul\|\/span\)\(\?:\.\*\?\\s' +
            '\*\?\)\*\?>\)', 'gm');
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
            var text = wysiwyg.text();

            ctrl.$setViewValue(html);

            $timeout(function () {
              var valid = html.length <= attrs.teHtmlMaxlength;
              if (attrs.teHtmlMaxlength) {
                ctrl.$setValidity('maxlength', valid);
              }
              if (attrs.teTextMaxlength) {
                ctrl.$setValidity('maxlength', valid && text.length <= attrs.teTextMaxlength);
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
            var clipboardData = e.originalEvent.clipboardData,
              html = '';

            if (clipboardData.types.indexOf('text/html') > -1) {
              html = clipboardData.getData("text/html");
              html = html.replace(htmlTagsWhitelist, '').trim();
            } else {
              html = clipboardData.getData('text/plain');
              html = html.replace(urlPattern, function (url) {
                var trimmedUrl = url.replace(/\s+/g, '');
                return '<a target="_blank" href="' + trimmedUrl + '">' + trimmedUrl + '</a>';
              });
            }

            document.execCommand('insertHTML', false, html);
            $timeout(validateRequired);
          });

          function validateRequired() {
            if (attrs.teRequired) {
              ctrl.$setValidity('required', wysiwyg.text().length > 0);
            }
          }
        }
      }
    }
    ]);

})();
