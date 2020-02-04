'use strict';

(function () {
  angular.module("quicktech.common.directives").directive('cropImage',
    ['$uibModal', 'Utils', 'UsersService', 'CompaniesService', '$rootScope',
      function ($uibModal, Utils, UsersService, CompaniesService, $rootScope) {
        return {
          restrict: 'A',
          scope: {
            model: '=cropImage',
            isTechLogo: '@?',
            isInvoice: '<isInvoice'
          },
          link: function (scope, element, attrs) {


            var $body = angular.element(document.body), image;
            var isTechLogo = scope.$eval(scope.isTechLogo);

            //delete image

            if (!scope.isInvoice) {
              var restoreDefaultButton = element.find('[restore-default-button]');
              if (restoreDefaultButton.length) {
                restoreDefaultButton.on('click', function () {
                  if (attrs.modelImagePath === 'avatar') {
                    if (scope.model.id) {
                      UsersService.deleteAvatar(scope.model.id, function () {
                        scope.model[attrs.modelImagePath] = null;
                      });
                    } else {
                      scope.model[attrs.modelImagePath] = null;
                    }
                  } else if (attrs.modelImagePath === 'logo') {
                    if (scope.model.id) {
                      CompaniesService.deleteLogo(scope.model.id, function () {
                        scope.model[attrs.modelImagePath] = null;
                      });
                    } else {
                      scope.model[attrs.modelImagePath] = null;
                    }
                  }

                  $body.click();
                  scope.$apply();
                });
              }

              //reposition
              var repositionButton = element.find('[reposition-button]');
              if (repositionButton.length) {
                repositionButton.on('click', function (e) {
                  $body.click();

                  var image = scope.model[attrs.modelImagePath];
                  if (image) {
                    image.id = scope.model.id;
                    showCropper(image);
                  }
                });
              }

              // load image and show crop modal
              element.find('[crop-image-button]').fileUploader({
                uploadUrl: '/file?isAvatar=true&ratio=' + (isTechLogo ? 2.25 : 1),
                uploadName: 'file',
                maxUploadSize: 5 * 1024 * 1024,

                accpetType: '.jpg,.png,.gif,.jpeg,.JPG,.PNG,.GIF,.JPEG',
                allowedExtensions: ['jpg', 'png', 'gif', 'jpeg', 'JPG', 'PNG', 'GIF', 'JPEG'],
                minImageWidth: 1,
                minImageHeight: 1,

                onStart: function () {
                  image = {};
                  if (scope.model) {
                    image.id = scope.model.id;
                  }
                  scope.$apply();
                },
                onProgress: function (progress) {
                  //loading
                },
                onSuccess: function (data) {
                  image.origin = data;
                  showCropper(image);
                  scope.$apply();
                },
                onFailure: function (message) {
                  console.error(message);
                }
              });
            }


            scope.$watch(function() {
              return $rootScope.draggedAvatar;
            }, function(val) {
              if (val) {
                showCropper($rootScope.draggedAvatar);
                $rootScope.draggedAvatar = null;



              }
            })


            function showCropper(image) {
              $uibModal.open({
                animation: true,
                backdrop: 'static',
                windowClass: 'modal-customize-avatar ' + (isTechLogo ? 'tech-logo' : ''),
                templateUrl: '/ng1/scripts/common/directives/crop-image/cropper-modal.tpl.html',
                controller: ['$scope', '$timeout', '$uibModalInstance', 'Cropper', 'source', 'isTechLogo', 'saveImage', cropperCtrl],
                resolve: {
                  source: image && function () {
                    return image;
                  },
                  isTechLogo: function () {
                    return isTechLogo;
                  },
                  saveImage: function () {
                    if (scope.model && scope.model.id) {
                      return attrs.modelImagePath === 'avatar' ? UsersService.saveAvatar : CompaniesService.saveLogo;
                    } else {
                      return function (model, id, callback) {
                        scope.model[attrs.modelImagePath] = model;
                        callback && callback();
                      }
                    }
                  }
                }
              }).result.then(function (resp) {
                if (resp) {
                  scope.model[attrs.modelImagePath] = resp;
                }
              })
            }

            function cropperCtrl($scope, $timeout, $uibModalInstance, Cropper, source, isTechLogo, saveImage) {
              var blob, timeout, preventZoom, zoomCounter = 20;

              $scope.cropper = {};
              $scope.cropperProxy = 'cropper.func';
              $scope.source = source ? angular.copy(source) : {};
              $scope.options = {
                maximize: true,
                aspectRatio: isTechLogo ? 450 / 200 : 1,
                crop: getCroppedImage,
                zoomin: function (e) {
                  if (preventZoom) {
                    preventZoom = false;
                  } else {
                    if (zoomCounter) {
                      preventZoom = true;
                      zoomCounter && zoomCounter--;
                      $scope.cropper.func('zoom', 0.1);
                    }
                    e.preventDefault();
                  }
                },
                zoomout: function (e) {
                  if (preventZoom) {
                    preventZoom = false;
                  } else {
                    preventZoom = true;
                    zoomCounter < 20 && zoomCounter++;
                    $scope.cropper.func('zoom', -0.1);
                    e.preventDefault();
                  }
                }
              };

              if (source.cropped) {
                $scope.options.data = {
                  x: source.x,
                  y: source.y,
                  width: source.w,
                  height: source.h
                };
              }

              if (source.origin.base64) {
                blob = Cropper.decode(source.origin.base64);
                $timeout(function () { $scope.$broadcast('show.cropper');});
              } else {
                getBase64FromImageUrl('/file/' + source.origin.id + '.jpg', function (base64) {
                  $timeout(function () {
                    $scope.source.origin.base64 = base64;
                    blob = Cropper.decode($scope.source.origin.base64);
                    $timeout(function () { $scope.$broadcast('show.cropper');});
                  });
                });
              }

              $scope.crop = function () {
                $scope.source.origin.base64 = undefined;
                $scope.source.base64 = $scope.preview;
                saveImage($scope.source, $scope.source.id, $scope.close);
              };

              $scope.close = function (resp) {
                if (timeout) {
                  $timeout.cancel(timeout);
                }
                $scope.$broadcast('hide.cropper');
                $uibModalInstance.close(resp);
              };

              $scope.$on('show.cropper', function () {
                $timeout(function () {
                  $scope.cropperReady = true;
                }, 50);
              });

              function getCroppedImage(dataNew) {
                if (timeout) {
                  $timeout.cancel(timeout);
                }

                timeout = $timeout(function () {
                  $scope.source.x = dataNew.x;
                  $scope.source.y = dataNew.y;
                  $scope.source.w = dataNew.width;
                  $scope.source.h = dataNew.height;

                  Cropper.crop(blob, dataNew).then(Cropper.encode).then(function (base64) {
                    $scope.preview = base64;
                  });
                }, 250);
              }

              function getBase64FromImageUrl(url, callback) {
                var img = new Image();

                img.onload = function () {
                  var canvas = document.createElement("canvas");
                  canvas.width = this.width;
                  canvas.height = this.height;

                  var ctx = canvas.getContext("2d");
                  ctx.drawImage(this, 0, 0);

                  var dataURL = canvas.toDataURL("image/png");
                  callback(dataURL);
                };

                img.src = url;
              }

            }

          }
        }
      }]);

})();
