'use strict';

(function () {

  var maxFileSize = 2 * 1024 * 1024; // 2 mb
  var allowedExtensions = [
    'jpg',
    'jpeg',
    'gif',
    'png'
  ];

  angular.module("quicktech.common.directives").directive('editAvatar',
    ['$modal', 'FilesService', '$rootScope',
      function ($modal, FilesService, $rootScope) {

        var urlGetters = {
          user: $rootScope.getUserAvatarUrl,
          contact: $rootScope.getContactAvatarUrl,
          company: $rootScope.getCompanyLogoUrl
        };

        return {
          restrict: 'A',
          templateUrl: '/html/scripts/common/directives/avatar/avatar.tpl.html',
          require: 'ngModel',
          scope: {
            model: '=ngModel'
          },
          link: function (scope, element, attrs, ctrl) {

            var wind = $(window),
              errorMessage = element.find('[error-message]'),
              windowScrollTop,
              avatar;

            if (!urlGetters[attrs.modelName]) {
              throw 'model-name must be specified! Available values - ["user", "contact"]';
            } else if (attrs.modelName === 'company') {
              scope.isLogo = true;
            }

            scope.getUrl = function () {
              return urlGetters[attrs.modelName]({id: attrs.modelId});
            };

            scope.getError = function () {
              return ctrl.$error;
            };

            scope.restoreDefaultAvatar = function () {
              ctrl.$setViewValue(null);
            };

            //reposition
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
              accpetType: '.jpg,.png,.gif',
              allowedExtensions: ['jpg', 'png', 'gif'],
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

                  ctrl.$setViewValue(avatar);
                  ctrl.$setValidity('loadingInProcess', true);
                });

              }, function () {
                fixScroll();
              });
            }

            function openModalCropper(avatar, isReposition) {

              windowScrollTop = wind.scrollTop();

              return $modal.open({
                animation: false,
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
                  cropInfo: function(){
                    return {type: scope.isLogo ? 'logo' : 'avatar'};
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

  function validate(file, ctrl, scope) {

    ctrl.$setValidity('maxsize', file.size <= maxFileSize);
    ctrl.$setValidity('filetype', allowedExtensions.indexOf(getExtension().toLowerCase()) >= 0);

    scope.$digest();

    return ctrl.$valid;

    function getExtension() {
      var arr = file.name.split('.');
      return arr[arr.length - 1];
    }
  }

})();
