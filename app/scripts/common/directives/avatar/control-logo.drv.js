'use strict';
(function () {

  angular.module("quicktech.common.directives").directive('controlLogo',
    ['$modal', 'FilesService', '$rootScope', 'CompaniesService',
      function ($modal, FilesService, $rootScope, CompaniesService) {

        return {
          restrict: 'A',
          templateUrl: '/html/scripts/common/directives/avatar/control-logo.tpl.html',
          require: 'ngModel',
          scope: {
            model: '=ngModel'
          },
          link: function (scope, element, attrs, ctrl) {

            if(!attrs.modelId){
              throw 'control-logo must have model-id drv'
            }

            var wind = $(window),
              errorMessage = element.find('[error-message]'),
              windowScrollTop,
              avatar;

            scope.getUrl = $rootScope.getCompanyLogoUrl;

            scope.getError = function () {
              return ctrl.$error;
            };

            scope.restoreDefaultAvatar = function () {
              CompaniesService.deleteLogo(attrs.modelId);
            };

            element.on('click', '[change-position-button]', function (e) {

              avatar = {
                id: scope.model.id,
                origin: scope.model.origin,
                x: scope.model.x,
                y: scope.model.y,
                w: scope.model.w,
                h: scope.model.h
              };

              crop(avatar, true);
            });

            element.find('[change-avatar-button]').fileUploader({
              uploadUrl: '/file?isAvatar=true',
              uploadName: 'file',
              maxUploadSize: 2 * 1024 * 1024,
              accpetType: '.jpg,.png,.gif,.jpeg,.JPG,.PNG,.GIF,.JPEG',
              allowedExtensions: ['jpg', 'png', 'gif', 'jpeg', 'JPG', 'PNG', 'GIF', 'JPEG'],
              minImageWidth: 100,
              minImageHeight: 100,

              onStart: function () {
                avatar = {};

                if (scope.model) {
                  avatar.id = scope.model.id;
                }

                ctrl.$setValidity('loadingInProcess', false);

                scope.$apply();

                crop(avatar, false);
              },
              onProgress: function (progress) {
                $('.avatorCropProgressBar').removeClass('hide');
                $('.avatorCropProgressDone').width(progress + '%');
              },
              onSuccess: function (data) {
                $('.avatorCropProgressBar').hide();

                errorMessage.hide();

                avatar.origin = data;

                ctrl.$setValidity('loadingInProcess', true);
                scope.$apply();
              },
              onFailure: function (message) {
                ctrl.$setValidity('loadingInProcess', true);
                errorMessage.show();
                errorMessage.text(message);
              }
            });

            function crop(avatar, isReposition) {
              var modalInstance = openModalCropper(avatar, isReposition);

              modalInstance.result.then(function () {
                fixScroll();
                ctrl.$setValidity('loadingInProcess', false);

                FilesService.cropAvatar(avatar, function (cropped) {
                  avatar.cropped = cropped;

                  CompaniesService.saveLogo(avatar, attrs.modelId)

                });

              }, function () {
                fixScroll();
              });
            }

            function openModalCropper(avatar, isReposition) {

              windowScrollTop = wind.scrollTop();

              return $modal.open({
                animation: true,
                backdrop: 'static',
                windowClass: 'modal-customize-avatar',
                templateUrl: '/html/scripts/common/directives/avatar/crop.tpl.html',
                controller: 'quicktech.common.directives.avatar.cropCtrl',
                resolve: {
                  isReposition: function () {
                    return isReposition;
                  },
                  avatar: function () {
                    return avatar;
                  },
                  cropInfo: function () {
                    return {
                      type: 'logo-company-card',
                      companyId: attrs.modelId
                    };
                  }
                }
              });
            }

            function fixScroll() {
              setTimeout(function () {
                wind.scrollTop(windowScrollTop);
              }, 0);
            }

          }
        }
      }]);
})();
