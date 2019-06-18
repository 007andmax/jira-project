'use strict';

(function () {

  angular.module("quicktech").controller("createNewEntityCtrl",
    ['$scope', 'resolvedExistedItem', 'resolveExistingCategory', 'sessionId', 'sessionTime', 'resolvedDeviceId', 'resolvedCompanyId', 'resolvedUserId',
      'resolvedOpenedTab', 'resolvedAdvanced', 'isMobileEdit', '$uibModalInstance', 'quicktech.common.services.PermissionsService', '$timeout',
      'quicktech.common.services.UserConfirmationsService', '$rootScope',
      function ($scope, resolvedExistedItem, resolveExistingCategory, sessionId, sessionTime, resolvedDeviceId, resolvedCompanyId, resolvedUserId,
                resolvedOpenedTab, resolvedAdvanced, isMobileEdit, $uibModalInstance, PermissionsService, $timeout, UserConfirmationsService, $rootScope) {

        $scope.openedTab = resolvedOpenedTab || 'ticket';

        if (resolvedExistedItem) {
          $scope.savedState = {types: [$scope.openedTab], items: [angular.copy(resolvedExistedItem)]};
        } else {
          $scope.savedState = {types: [], items: []};
        }

        if(resolveExistingCategory) {
          $scope.savedCategory = angular.copy(resolveExistingCategory);
        } else {
          $scope.savedCategory = {types: [], items: []};
        }

        if ($scope.openedTab === 'category') {
          $scope.openedTab = 'product';
        } else if ($scope.openedTab === 'ticketFromDraft') {
          $scope.openedTab = 'ticket';
        }

        var alreadyPushCloseButton = false;

        $scope.longCreateCompany = false;

        $scope.switchCompanyModal = function(delay) {
          var modal = document.querySelector('.modal-dialog');
          modal.classList.add('xl');
          $scope.longCreateCompany = true;

          if (delay) {
            $scope.hideDiv = true;

            $timeout(function() {
              $scope.hideDiv = false;
            }, 400)
          }
        }

        $scope.switchCompanyModalBack = function(delay) {
          var modal = document.querySelector('.modal-dialog');
          modal.classList.remove('xl');
          $scope.longCreateCompany = false;



          if (delay) {
            $scope.hideDiv = true;

            $timeout(function() {
              $scope.hideDiv = false;
            }, 500)
          }
        }

        $scope.sessionId = sessionId;
        $scope.sessionTime = sessionTime;
        $scope.resolvedDeviceId = resolvedDeviceId;
        $scope.resolvedCompanyId = resolvedCompanyId;
        $scope.resolvedCreatedUserId = resolvedUserId;
        $scope.resolvedAdvanced = resolvedAdvanced;
        $scope.isMobileEdit = isMobileEdit;
        $scope.closeWindow = $uibModalInstance.dismiss;
        $scope.closeWindowWithoutConfirmation = function(){
          alreadyPushCloseButton = true;
          $scope.closeWindow();
          alreadyPushCloseButton = false;
        }


        $scope.closeWindowWithConfirm = function () {
          alreadyPushCloseButton = true;
          $scope.$broadcast('createNewWindowClosing');
          var message = 'Do you want to close this window? All entered information will be lost.';
          confirmation(message, $uibModalInstance.dismiss, function () {
            alreadyPushCloseButton = false;
          }, function () {
            var type = $scope.savedState.types.shift();
            var item = $scope.savedState.items.shift();
            return type && item;
          });
        };

        $scope.$on('modal.closing', function (event) {
          if (!alreadyPushCloseButton) {
            event.preventDefault();
            alreadyPushCloseButton = true;
            $scope.$broadcast('createNewWindowClosing');
            var message = 'Do you want to close this window? All entered information will be lost.';
            confirmation(message, $uibModalInstance.dismiss, function () {
              alreadyPushCloseButton = false;
            }, function () {
              var type = $scope.savedState.types.shift();
              var item = $scope.savedState.items.shift();
              return type && item;
            });
          }
        });

        $scope.setOpenedTab = function (tabName) {
          $scope.openedTab = tabName;
        };

        $scope.setOpenedTabWithConfirm = function (tabName) {
          $scope.$broadcast('createNewWindowClosing');
          var message = 'Do you want to leave this tab? All entered information will be lost.';
          confirmation(message, $scope.setOpenedTab.bind($scope, tabName), angular.noop, function () {
            var type = $scope.savedState.types[0];
            if (type === $scope.openedTab) {
              $scope.savedState.types.shift();
              $scope.savedState.items.shift();
              return true;                                                 //there is entered information in current tab
            }
            return type && type !== tabName;                                      //isn't going to the earlier saved tab
          });
        };

        $scope.getLastSavedState = function (type) {
          if (type !== $scope.savedState.types[0]) {
            return {};
          }

          return {
            type: $scope.savedState.types.length > 0 ? $scope.savedState.types.shift() : undefined,
            item: $scope.savedState.items.length > 0 ? $scope.savedState.items.shift() : undefined
          }
        };

        $scope.PermissionsService = PermissionsService;

        $scope.$on('createNewEntity', function (event, type) {
          console.log('type',type);
          var unsubscribe = $scope.$on('new' + type.charAt(0).toUpperCase() + type.slice(1) + 'HasBeenCreated',
            function (e, id) {
              var savedState = $scope.savedState;
              var savedItem = savedState.items[0];

              if (savedState.types[0] === 'ticket') {
                if (type === 'user') {
                  $scope.resolvedCreatedUserId = id;
                  $scope.resolvedDeviceId = undefined;
                  $scope.resolvedCompanyId = undefined;
                } else if (type === 'company') {
                  $scope.resolvedCompanyId = id;
                  $scope.resolvedCreatedUserId = undefined;
                  $scope.resolvedDeviceId = undefined;
                }
              } else if ((savedState.types[0] === 'user' || savedState.types[0] === 'product') && type === 'company') {
                savedItem.company = {id: id};
              }

              $scope.setOpenedTab(savedState.types[0]);

              unsubscribe();
            });
        });

        function confirmation(message, onSuccess, onReject, predicate) {
          $timeout(function () {
            if (predicate()) {
              UserConfirmationsService.show(message, 'Yes').then(onSuccess, onReject);
            } else {
              onSuccess();
            }
          }, 100);
        }

      }]);
})();
