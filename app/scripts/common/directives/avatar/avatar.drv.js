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
    ['$modal', 'FilesService', '$rootScope', function ($modal, FilesService, $rootScope) {

      var urlGetters = {
        user: $rootScope.getUserAvatarUrl,
        contact: $rootScope.getContactAvatarUrl
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
            windowScrollTop;

          if (!urlGetters[attrs.modelName]) {
            throw 'model-name must be specified! Available values - ["user", "contact"]';
          }

          scope.getUrl = urlGetters[attrs.modelName];

          scope.getError = function () {
            return ctrl.$error;
          };

          element.on('click', '[change-avatar-button]', function () {
            if (ctrl.$error.loadingInProcess) {
              return;
            }
            var file = element.find('input[type=file]');
            file.replaceWith(file = file.clone(true));
            file.trigger('click');
          });

          //reposition
          element.on('click', '[change-position-button]', function (e) {

            var avatar = {
              id: scope.model.id,
              origin: scope.model.origin,
              x: scope.model.x,
              y: scope.model.y,
              w: scope.model.w,
              h: scope.model.h
            };

            crop(avatar, true);
          });

          //change avatar
          element.on('change', 'input[type=file]', function (e) {
            var file = this.files[0];

            if (validate(file, ctrl, scope)) {

              var avatar = {};

              if (scope.model) {
                avatar.id = scope.model.id;
              }

              ctrl.$setValidity('loadingInProcess', false);
              scope.$apply();

              FilesService.create(file, undefined, function (origin) {
                ctrl.$setValidity('loadingInProcess', true);
                avatar.origin = origin;

                crop(avatar, false);
              }, undefined, true);

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
              console.log('cancel')
            });
          }

          function openModalCropper(avatar, isReposition) {

            windowScrollTop = wind.scrollTop();

            return $modal.open({
              animation: false,
              backdrop: 'static',
              templateUrl: '/html/scripts/common/directives/avatar/crop.tpl.html',
              controller: 'quicktech.common.directives.avatar.cropCtrl',
              resolve: {
                isReposition: function () {
                  return isReposition;
                },
                avatar: function () {
                  return avatar;
                }
              }
            });
          }

          function fixScroll() {
            setTimeout(function () {
              wind.scrollTop(windowScrollTop)
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
