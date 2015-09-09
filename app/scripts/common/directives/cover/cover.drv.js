'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('editCover',
    ['$modal', 'FilesService', '$rootScope',
      function ($modal, FilesService, $rootScope) {

        var urlGetters = {
          company: $rootScope.getCompanyCoverUrl
        };

        return {
          restrict: 'A',
          templateUrl: '/html/scripts/common/directives/cover/cover.tpl.html',
          require: 'ngModel',
          scope: {
            model: '=ngModel',
            restoreDefaultCover: '=ecResetToDefault',
            cancelEditCover: '=ecCancelEditCover',
            saveEditCover: '=ecSaveEditCover'
          },
          link: function (scope, element, attrs, ctrl) {

            var progressBar = element.find('[avator-crop-progress-bar]'),
              progressDone = element.find('[avator-crop-progress-done]'),
              errorMessage = element.find('[error-message]'),
              cropBox = element.find('[crop-box]'),
              cropBoxClone = cropBox.clone(),
              rangeZoom = element.find('[range-zoom]'),
              icnZoomPlus = element.find('[icn-zoom-plus]'),
              icnZoomMinus = element.find('[icn-zoom-minus]'),
              fileUploader = element.find('[file-uploader]'),
              instructionWrap = element.find('[instruction-wrap]');

            if (!urlGetters[attrs.modelName]) {
              throw 'model-name must be specified! Available values - ["company"]';
            }

            setupUploading();

            if (scope.model.origin && scope.model.origin.id) {
              scope.$emit('showEditCover');
              cropBoxModel(true);
            } else {
              $(fileUploader).trigger('click');
            }

            scope.getUrl = function () {
              return urlGetters[attrs.modelName]({id: attrs.modelId});
            };

            scope.getError = function () {
              return ctrl.$error;
            };

            var cropBoxModel = function (isReposition) {

              cropBox.jWindowCrop({
                cropBoxWidth: cropBox.width(),
                cropBoxHeight: cropBox.height(),
                maxZoom: 2,
                imageSource: '/file/' + scope.model.origin.id,
                loadingText: 'Loading ...',

                rangeSelectElement: rangeZoom,
                rangeIncreaseElement: icnZoomPlus,
                rangeDecreaseElement: icnZoomMinus,

                startWith: !isReposition ? null : {
                  x: scope.model.x,
                  y: scope.model.y,
                  w: scope.model.w,
                  h: scope.model.h
                },
                onImageLoad: function () {

                  progressBar.hide();

                  cropBox.show();

                  instructionWrap.fadeOut(1000);

                  scope.$apply('disabledCoverControl = false');

                  icnZoomPlus.removeClass('disabled');
                  icnZoomMinus.removeClass('disabled');
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
            };

            function setupUploading() {

              $(fileUploader).fileUploader({
                uploadUrl: '/file?isAvatar=true',
                uploadName: 'file',
                maxUploadSize: 4 * 1024 * 1024,
                accpetType: '.jpg,.png,.gif',
                allowedExtensions: ['jpg', 'png', 'gif'],
                minImageWidth: 326,
                minImageHeight: 163,


                onStart: function () {
                  scope.$emit('showEditCover');
                  progressBar.removeClass('hide');
                  progressBar.show();
                  scope.$apply('disabledCoverControl = true');
                  errorMessage.hide();

                  cropBox.replaceWith(cropBoxClone);
                  cropBox = cropBoxClone;
                  cropBoxClone = cropBox.clone();

                },
                onProgress: function (progress) {
                  progressDone.width(progress + '%');
                },
                onSuccess: function (data) {
                  ctrl.$setViewValue({
                    origin: {
                      id: data.id
                    }
                  });

                  cropBoxModel(false);
                },
                onFailure: function (message) {
                  ctrl.$setValidity('loadingInProcess', true);
                  errorMessage.show();
                  errorMessage.text(message);
                }
              });
            }
          }
        };
      }]);

})();
