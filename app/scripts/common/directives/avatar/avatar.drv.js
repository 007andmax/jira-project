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
            var file = element.find('input[type=file]');
            file.replaceWith(file = file.clone(true));
            file.trigger('click');
          });

          //reposition
          element.on('click', '[change-position-button]', function (e) {

            var avatar = {
              scale: scope.model.scale,
              origin: scope.model.origin,
              x: scope.model.x,
              y: scope.model.y
            };

            var img = new Image;

            img.onload = function () {
              var modalInstance = openModalCropper(img, avatar);

              modalInstance.result.then(function (cropped) {
                fixScroll();
                if (avatar.scale != scope.model.scale
                  || avatar.x != scope.model.x
                  || avatar.y != scope.model.y) {

                  ctrl.$setValidity('loadingInProcess', false);

                  FilesService.createImageFromBase64Url(cropped, function (cropped) {
                    avatar.cropped = cropped;
                    ctrl.$setViewValue(avatar);
                    ctrl.$setValidity('loadingInProcess', true);
                  });
                }
              }, function () {
                fixScroll();
                console.log('cancel')
              });
            };

            img.src = '/file/' + scope.model.origin.id;

          });

          //change avatar
          element.on('change', 'input[type=file]', function (e) {
            var file = this.files[0];

            if (validate(file, ctrl, scope)) {

              var avatar = {
                scale: 50
              };

              var img = new Image;

              img.onload = function () {
                var modalInstance = openModalCropper(img, avatar);

                modalInstance.result.then(function (cropped) {

                  ctrl.$setValidity('loadingInProcess', false);

                  FilesService.create(file, undefined, function (origin) {
                    avatar.origin = origin;
                    finish();
                  }, undefined, true);

                  FilesService.createImageFromBase64Url(cropped, function (cropped) {
                    avatar.cropped = cropped;
                    finish();
                  });

                  var finished = 0;

                  function finish() {

                    finished++;

                    if (finished >= 2) {
                      ctrl.$setViewValue(avatar);
                      ctrl.$setValidity('loadingInProcess', true);
                    }
                  }
                }, function () {
                  console.log('cancel')
                });
              };

              img.src = URL.createObjectURL(file);

            }
          });

          function openModalCropper(img, avatar) {

            windowScrollTop = wind.scrollTop();

            return $modal.open({
              animation: false,
              backdrop: 'static',
              templateUrl: '/html/scripts/common/directives/avatar/crop.tpl.html',
              controller: 'quicktech.common.directives.avatar.cropCtrl',
              resolve: {
                image: function () {
                  return img;
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
