'use strict';

(function () {

  angular.module("quicktech.common.directives").directive("typeaheadInputIcon",
    ['$rootScope', '$timeout', function ($rootScope, $timeout) {
      return {
        restrict: 'A',
        template: '<span class="x-mark" ng-click="clearInput($event)" ng-show="showClearIcon">' +
        '<i class="icn-sm icn-remove-old"' +
        ' ng-click="clearInput($event)"  tooltip="clear" tooltip-placement="top"></i>' +
        '</span>' +
        '<span class="x-mark" ng-hide="showClearIcon" ng-click="toggleDropdown($event)">' +
        '<i class="icn-sm report-caret-icon" style="pointer-events: none;"></i>' +
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
            model.testVar = true;
            if (model) {
              model.$setViewValue(undefined);
            }

            input.click();

            $rootScope.clearButtonPressed = true;
          };

          scope.toggleDropdown = function (e) {
            var dm = input.parent().find('.dropdown-menu,.uib-dropdown-menu')
            if (dm.hasClass('ng-hide')) {
              if(e) {
                e.stopPropagation();
              }

              input.focus();
            }
          };

        }
      }
    }]);
})();
