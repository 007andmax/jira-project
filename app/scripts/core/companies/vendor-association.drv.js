'use strict';

(function () {

  angular.module("quicktech.core.companies").directive("vendorAssociation",
    [function () {
      return {
        restrict: 'A',
        link: function ($scope, element, attrs) {

          var input = element.find('[va-input]'),
            vendors = element.find('[va-vendors]'),
            tokenfield = element.find('[va-tokenfield]'),
            $wind = $(window),
            targetInputMinWidth = 60,
            padding = 20;

          if (input.length == 0 || vendors.length === 0) {
            throw 'cannot find input or vendors';
          }

          //tokenfield.bind('DOMNodeInserted DOMNodeRemoved', function () {
          //  var width = tokenfield.width(),
          //    tokens = tokenfield.find('.token');
          //
          //  for (var i = 0; i < tokens.length; i++) {
          //    width = width - $(tokens[i]).width() - padding;
          //  }
          //
          //  width = Math.max(width, targetInputMinWidth);
          //
          //  input.width(width);
          //});

          input.on('focus', function () {
            vendors.show();
          });

          $wind.on('click', function (e) {
            if (!e.originalEvent.itComesFromTarget) {
              vendors.hide();
            }
          });

          vendors.on('click', function (e) {
            e.originalEvent.itComesFromTarget = true;
          });

          input.on('click', function (e) {
            e.originalEvent.itComesFromTarget = true;
          });

          $scope.$on('$destroy', function () {
            $wind.off('click');
          })
        }
      }
    }]);

})();
