'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('appendHtmlToBody',
    ['$templateRequest', '$compile', '$location', '$document', function ($templateRequest, $compile, $location, $document) {
      return {
        restrict: 'A',
        scope: {
          url: '@',
          data: '=',
          func: '=?',
          firstNodeClass: '@?'
        },
        link: function ($scope, $element, $attrs) {
          var template,
            templateContainer,
            waitForTplLoaded = false,
            $body = angular.element(document.body),
            newScope;

          $templateRequest($scope.url).then(function (resp) {
            template = angular.copy(resp);

            if (waitForTplLoaded) {
              waitForTplLoaded = false;
              showPreview();
            }
          });

          $element.on('click', showPreview);

          $scope.close = function () {
            templateContainer.remove();
            newScope.$destroy();
            $location.search('modal', undefined);
            $body.removeClass('non-body-scroll');
          };

          var unbind = $scope.$on('$destroy', function () {
            $document.off('keydown', closeIfEscape);
            $element.off('click', showPreview);
            if (newScope) {
              newScope.$destroy();
            }
            unbind();
          });

          function showPreview() {
            if (!($element.hasClass('disabled') || typeof $element.attr('disabled') === 'string')) {
              if (template) {
                newScope = $scope.$new();
                $compile(template)(newScope, function (compiledHtml) {
                  $location.search('modal', 'true');
                  $body.append(compiledHtml);
                  templateContainer = compiledHtml;
                  $document.on('keydown', closeIfEscape);
                  $body.addClass('non-body-scroll');
                });
              } else {
                waitForTplLoaded = true;
              }
            }
          }

          function closeIfEscape(e) {
            if (e.which === 27 || e.keyCode === 27) {
              $scope.close();
            }
          }

        }
      };
    }]);

})();
