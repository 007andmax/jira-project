'use strict';

(function () {

  angular.module("quicktech.core.users").directive('crop',
    ['$modal', function ($modal) {
      return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
          model: '=ngModel',
          isReposition: '='
        },
        link: function (scope, element, attrs, ctrl) {

          var unwatch = scope.$watch('model.origin', function (origin) {

            if (origin && origin.id) {
              unwatch();

              element.find('[crop-box]').jWindowCrop({
                cropBoxWidth: 244,
                cropBoxHeight: 244,
                maxZoom: 2,
                imageSource: '/file/' + scope.model.origin.id,
                loadingText: 'Loading ...',

                rangeSelectElement: element.find('[range-zoom]'),
                rangeIncreaseElement: element.find('[icn-zoom-plus]'),
                rangeDecreaseElement: element.find('[icn-zoom-minus]'),

                startWith: !scope.isReposition ? null : {
                  x: scope.model.x,
                  y: scope.model.y,
                  w: scope.model.w,
                  h: scope.model.h
                },

                onChange: function (e) {
                  scope.model.x = e.cropX;
                  scope.model.y = e.cropY;
                  scope.model.w = e.cropW;
                  scope.model.h = e.cropH;
                  scope.model.sizeW = e.sizeW;
                  scope.model.sizeH = e.sizeH;
                }
              });
            }
          });
        }
      }
    }]);

})();
