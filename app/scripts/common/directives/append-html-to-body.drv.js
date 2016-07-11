'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('appendHtmlToBody',
    ['$templateRequest', '$compile', '$location', function ($templateRequest, $compile, $location) {
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
            $body.off('keydown', closeIfEscape);
            $element.off('click', showPreview);
            if (newScope) {
              newScope.$destroy();
            }
            unbind();
          });

          function showPreview() {
            if ($scope.$eval($attrs.workIf)) {
              if (template) {
                newScope = $scope.$new();
                $location.search('modal', 'true');
                $compile(template)(newScope, function (compiledHtml) {
                  templateContainer = $body.append(compiledHtml).find('.' + $scope.firstNodeClass);
                  $body.on('keydown', closeIfEscape);
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
