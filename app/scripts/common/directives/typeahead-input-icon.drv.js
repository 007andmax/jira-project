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
        '<span class="x-mark" ng-hide="showClearIcon" >' +
        '<i class="icn-sm icn-caret-gray" ng-click="setDropdown($event)" ></i>' +
        '</span>' +
        '',
        scope: true,
        link: function (scope, element, attrs) {

          var input = (element.parent()).find('input');
          var ariaExpanded = input.attr('aria-expanded');
          //var ul = (element.parent()).find('dropdown-menu');

          if (!input || input.length === 0) {
            input = (element.parent().parent()).find('input');
          }

          scope.$watch(function () {
            return input.val();
          }, function () {
            scope.showClearIcon = !!input.val();
          });


          /*scope.$watch(function(){
            return ul.getAttribute("aria-hidden");
          }, function(){
            scope.ulAttr = !!ul.getAttribute("hidden");
            console.log("changed");
          });*/

          scope.setDropdown = function(e) {
            console.log(ariaExpanded);
            if(ariaExpanded === false) {
              $('dropdown-menu').removeClass("ng-hide");
              console.log("removed");
              //ul.setAttribute('aria-hidden', 'false');
              //input.setAttribute('aria-expanded', 'true');
            } else {
              $('dropdown-menu').addClass('ng-hide');
              //console.log(ul);
            }
          };

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
