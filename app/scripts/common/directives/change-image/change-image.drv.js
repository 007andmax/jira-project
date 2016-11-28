'use strict';

(function () {
  angular.module("quicktech.common.directives").directive('changeImage',
    ['$uibModal', 'FilesService', 'Utils', 'UsersService', 'CompaniesService',
      function ($uibModal, FilesService, Utils, UsersService, CompaniesService) {

      return {
        restrict: 'A',
        scope: {
          model: '=changeImage'
        },
        link: function (scope, element, attrs) {

          var wind = $(window), image, windowScrollTop;
          var $body = angular.element(document.body);

          var restoreDefaultButton = element.find('[restore-default-button]');
          if (restoreDefaultButton.length) {
            restoreDefaultButton.on('click', function () {
              image = null;
              Utils.defineReadOnlyProperty(scope.model, attrs.modelImagePath, image);

              if (attrs.modelImagePath === 'avatar') {
                UsersService.deleteAvatar(scope.model.id);
              } else if (attrs.modelImagePath === 'logo') {
                CompaniesService.deleteLogo(scope.model.id);
              }

              $body.click();
              scope.$apply();
            });
          }

          //reposition
          var repositionButton = element.find('[reposition-button]');
          if (repositionButton.length) {
            repositionButton.on('click', function (e) {

              image = {
                id: scope.model[attrs.modelImagePath].id,
                origin: scope.model[attrs.modelImagePath].origin,
                x: scope.model[attrs.modelImagePath].x,
                y: scope.model[attrs.modelImagePath].y,
                w: scope.model[attrs.modelImagePath].w,
                h: scope.model[attrs.modelImagePath].h
              };

              $body.click();
              crop(image, true);
            });
          }

          element.find('[change-image-button]').fileUploader({
            uploadUrl: '/file?isAvatar=true',
            uploadName: 'file',
            maxUploadSize: 2 * 1024 * 1024,
            accpetType: '.jpg,.png,.gif,.jpeg,.JPG,.PNG,.GIF,.JPEG',
            allowedExtensions: ['jpg', 'png', 'gif', 'jpeg', 'JPG', 'PNG', 'GIF', 'JPEG'],
            minImageWidth: 283,
            minImageHeight: 200,

            onStart: function () {
              image = {};

              if (scope.model[attrs.modelImagePath]) {
                image.id = scope.model[attrs.modelImagePath].id;
              }
              scope.$apply();
              crop(image, false);
            },
            onSuccess: function (data) {
              image.origin = data;
              $body.click();
              scope.$apply();
            },
            onFailure: function (message) {
              //todo: handle error
              $body.click();
              console.error(message);
            }
          });

          function crop(image, isReposition) {
            var modalInstance = openModalCropper(image, isReposition);

            modalInstance.result.then(function () {
              fixScroll();
              FilesService.cropAvatar(image, function (cropped) {
                image.cropped = cropped;
                var model = angular.copy(scope.model);
                Utils.defineReadOnlyProperty(model, attrs.modelImagePath, image);

                if (attrs.modelImagePath === 'avatar') {
                  model.companyId = model.company.id;
                  UsersService.save(model);
                } else if (attrs.modelImagePath === 'logo') {
                  CompaniesService.saveLogo(image, model.id);
                }
              });
            }, function () {
              fixScroll();
            });
          }

          function openModalCropper(image, isReposition) {

            windowScrollTop = wind.scrollTop();

            return $uibModal.open({
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
                  return image;
                },
                cropInfo: function () {
                  return { type: attrs.modelImagePath };
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
