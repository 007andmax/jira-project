'use strict';

(function () {
  angular.module("quicktech.common.directives").directive('cropImage',
    ['$uibModal', 'Utils', 'UsersService', 'CompaniesService',
      function ($uibModal, Utils, UsersService, CompaniesService) {
        return {
          restrict: 'A',
          scope: {
            model: '=cropImage',
            isTechLogo: '@?'
          },
          link: function (scope, element, attrs) {
            var $body = angular.element(document.body), image;
            
            //delete image
            var restoreDefaultButton = element.find('[restore-default-button]');
            if (restoreDefaultButton.length) {
              restoreDefaultButton.on('click', function () {
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
                $body.click();
                
                var image = scope.model[attrs.modelImagePath];
                if (image) {
                  showCropper(image);
                }
              });
            }
            
            //load image and show crop modal
            element.find('[crop-image-button]').fileUploader({
              uploadUrl: '/file?isAvatar=true',
              uploadName: 'file',
              maxUploadSize: 2 * 1024 * 1024,
              accpetType: '.jpg,.png,.gif,.jpeg,.JPG,.PNG,.GIF,.JPEG',
              allowedExtensions: ['jpg', 'png', 'gif', 'jpeg', 'JPG', 'PNG', 'GIF', 'JPEG'],
              minImageWidth: 100,
              minImageHeight: 100,
              
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
            
            function showCropper(image) {
              $uibModal.open({
                animation: true,
                backdrop: 'static',
                windowClass: 'modal-customize-avatar',
                templateUrl: '/html/scripts/common/directives/crop-image/cropper-modal.tpl.html',
                controller: ['$scope', '$timeout', '$uibModalInstance', 'Cropper', 'source', 'isTechLogo', 'saveImage', cropperCtrl],
                resolve: {
                  source: image && function () {
                    return image;
                  },
                  isTechLogo: function () {
                    return scope.$eval(scope.isTechLogo);
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
              })
            }
            
            function cropperCtrl($scope, $timeout, $uibModalInstance, Cropper, source, isTechLogo, saveImage) {
              var blob, timeout;
  
              $scope.source = source ? angular.copy(source) : {};
              $scope.isTechLogo = isTechLogo;
              $scope.options = {
                maximize: true,
                aspectRatio: isTechLogo ? 450 / 200 : 1,
                rotatable: false,
                crop: getCroppedImage
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
                getBase64FromImageUrl('/file/' + source.origin.id, function (base64) {
                  $timeout(function () {
                    $scope.source.origin.base64 = base64;
                    blob = Cropper.decode($scope.source.origin.base64);
                    $timeout(function () { $scope.$broadcast('show.cropper');});
                  });
                });
              }
              
              $scope.crop = function () {
                $scope.source.origin.base64 = undefined;
                saveImage($scope.source, $scope.source.id, $scope.close);
              };
              
              $scope.close = function () {
                if (timeout) {
                  $timeout.cancel(timeout);
                }
                $scope.$broadcast('hide.cropper');
                $uibModalInstance.dismiss();
              };
              
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
                    timeout = undefined;
                  })
                }, 300);
              }
  
              function getBase64FromImageUrl(url, callback) {
                var img = new Image();
                img.setAttribute('crossOrigin', 'anonymous');
    
                img.onload = function () {
                  var canvas = document.createElement("canvas");
                  canvas.width =this.width;
                  canvas.height =this.height;
      
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
