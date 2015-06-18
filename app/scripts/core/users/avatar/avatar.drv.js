'use strict';

(function () {

  var maxFileSize = 2 * 1024 * 1024; // 2 mb
  var allowedExtensions = [
    'jpg',
    'jpeg',
    'gif',
    'png'
  ];

  angular.module("quicktech.core.users").directive('editAvatar',
    ['$modal', 'FilesService', function ($modal, FilesService) {
      return {
        restrict: 'A',
        templateUrl: '/html/scripts/core/users/avatar/avatar.tpl.html',
        scope: {
          user: '=user',
          loadingInProcess: '=loadingInProcess'
        },
        link: function (scope, element, attrs) {

          element.on('click', '[change-avatar-button]', function () {
            var file = element.find('input[type=file]');
            file.replaceWith(file = file.clone(true));
            file.trigger('click');
          });

          //reposition
          element.on('click', '[change-position-button]', function (e) {

            var avatar = {
              scale: scope.user.avatar.scale,
              x: scope.user.avatar.x,
              y: scope.user.avatar.y
            };

            var img = new Image;

            img.onload = function () {
              var modalInstance = openModalCropper(img, avatar);

              modalInstance.result.then(function (cropped) {

                if (avatar.scale != scope.user.avatar.scale
                  || avatar.x != scope.user.avatar.x
                  || avatar.y != scope.user.avatar.y) {

                  scope.loadingInProcess = true;

                  FilesService.createImageFromBase64Url(cropped, function (cropped) {
                    avatar.cropped = cropped;
                    scope.user.avatar = avatar;
                    scope.loadingInProcess = false;
                  });
                }
              }, function () {
                console.log('cancel')
              });
            };

            img.src = '/file/' + scope.user.avatar.origin.id;

          });

          //change avatar
          element.on('change', 'input[type=file]', function (e) {
            var file = this.files[0];

            if (validate(file, element)) {

              var avatar = {
                scale: 50
              };

              var img = new Image;

              img.onload = function () {
                var modalInstance = openModalCropper(img, avatar);

                modalInstance.result.then(function (cropped) {

                  scope.loadingInProcess = true;

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
                      scope.user.avatar = avatar;
                      scope.loadingInProcess = false;
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
            return $modal.open({
              animation: true,
              backdrop: 'static',
              templateUrl: '/html/scripts/core/users/avatar/crop.tpl.html',
              controller: 'quicktech.core.users.avatar.cropCtrl',
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

        }
      }
    }]);

  function validate(file, element) {

    var isValid = true;

    if (file.size > maxFileSize) {
      element.find('[too-large-file-msg]').show();
      isValid = false;
    } else {
      element.find('[too-large-file-msg]').hide();
    }

    var extension = getExtension();

    if (allowedExtensions.indexOf(extension.toLowerCase()) < 0) {
      element.find('[illegal-file-type-msg]').show();
      isValid = false;
    } else {
      element.find('[illegal-file-type-msg]').hide();
    }

    return isValid;

    function getExtension() {
      var arr = file.name.split('.');
      return arr[arr.length - 1];
    }
  }

})();
