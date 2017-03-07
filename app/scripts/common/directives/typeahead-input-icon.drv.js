'use strict';

(function () {

  angular.module("quicktech.common.directives").directive("typeaheadInputIcon",
    [function () {
      return {
        restrict: 'A',
        template: '<span class="x-mark" ng-click="clearInput($event)" ng-show="showClearIcon">' +
        '<i class="icn-sm icn-remove-old"' +
        ' ng-click="clearInput($event)"  tooltip="clear" tooltip-placement="top"></i>' +
        '</span>' +
        '<span class="x-mark" ng-hide="showClearIcon" style="pointer-events: none">' +
        '<i class="icn-sm icn-caret-gray" ></i>' +
        '</span>' +
        '',
        scope: true,
        link: function (scope, element, attrs) {

          var input = (element.parent()).find('input');

          if (!input || input.length === 0) {
            input = (element.parent().parent()).find('input');
          }

          scope.$watch(function () {
            return input.val();
          }, function () {
            scope.showClearIcon = !!input.val();
          });

          scope.clearInput = function (e) {
            e.stopPropagation();

            var deleteItems = attrs.typeaheadInputIcon.split(',');

            for (var i = 0; i < deleteItems.length; i++) {
              scope.$parent[deleteItems[i].trim()] = '';
            }

            input.val('');

            var model = input.controller('ngModel');
            if (model) {
              model.$setViewValue('');
            }

            input.click();
          }

        }
      }
    }]);
})();
