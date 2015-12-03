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
            saveEditCover: '=ecSaveEditCover',
            isShowLoaderOnCover: '=ecIsShowLoaderOnCover'
          },
          link: function (scope, element, attrs, ctrl) {

            var cropBox = element.find('[crop-box]'),
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
            initialize();

            scope.$on('initializeCoverCropper', initialize);

            scope.getUrl = function () {
              return urlGetters[attrs.modelName]({id: attrs.modelId});
            };

            scope.getError = function () {
              return ctrl.$error;
            };

            scope.callRestoreDefaultCover = function () {
              scope.disabledCoverControl = true;
              scope.restoreDefaultCover();
            };

            scope.callSaveEditCover = function (cover) {
              scope.disabledCoverControl = true;
              scope.saveEditCover(cover);
            };

            function setupCropBoxModel(isReposition) {

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

                  scope.isShowLoaderOnCover = false;

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
            }

            function setupUploading() {

              $(fileUploader).fileUploader({
                uploadUrl: '/file?isAvatar=true',
                uploadName: 'file',
                maxUploadSize: 4194304,
                accpetType: '.jpg,.png,.gif',
                allowedExtensions: ['jpg', 'png', 'gif'],
                minImageWidth: 326,
                minImageHeight: 163,


                onStart: function () {

                  scope.$emit('showEditCover');
                  scope.isShowLoaderOnCover = false;
                  scope.$apply('disabledCoverControl = true');

                  cropBox.replaceWith(cropBoxClone);
                  cropBox = cropBoxClone;
                  cropBoxClone = cropBox.clone();

                },
                onProgress: function (progress) {
                },
                onSuccess: function (data) {
                  ctrl.$setViewValue({
                    origin: {
                      id: data.id
                    }
                  });

                  setupCropBoxModel(false);
                },
                onFailure: function (message) {
                  scope.$emit('showErrorCover', message);
                }
              });
            }

            function initialize() {
              if (scope.model.origin && scope.model.origin.id) {
                scope.$emit('showEditCover');
                setupCropBoxModel(true);
              } else {
                $(fileUploader).trigger('click');
              }
            }

          }
        };
      }]);

})();
