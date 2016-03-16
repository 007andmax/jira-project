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

              var rangeIncreaseElement = element.find('[icn-zoom-plus]'),
                rangeDecreaseElement = element.find('[icn-zoom-minus]'),
                rangeSelectElement = element.find('[range-zoom]'),
                continueButton = element.find('[continue-button]'),
                cropBox = element.find('[crop-box]');

              cropBox.jWindowCrop({
                customTypeCrop: 'avatar',
                cropBoxWidth: 244,
                cropBoxHeight: 244,
                maxZoom: 2,
                imageSource: '/file/' + scope.model.origin.id,
                loadingText: '  ',

                rangeSelectElement: rangeSelectElement,
                rangeIncreaseElement: rangeIncreaseElement,
                rangeDecreaseElement: rangeDecreaseElement,

                startWith: !scope.isReposition ? null : {
                  x: scope.model.x,
                  y: scope.model.y,
                  w: scope.model.w,
                  h: scope.model.h
                },

                onImageLoad: function () {
                  cropBox.show();

                  rangeIncreaseElement.removeClass('disabled');
                  rangeSelectElement.prop('disabled', false);
                  rangeDecreaseElement.removeClass('disabled');
                  continueButton.removeClass('disabled');
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
