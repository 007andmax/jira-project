'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.editServiceCtrl',
    ['$scope', '$rootScope', 'ServicesService', 'TaxesService', '$timeout',
      function ($scope, $rootScope, ServicesService, TaxesService, $timeout) {

        var savedState = $scope.getLastSavedState('service');
        $scope.glNumbersList = [];
        $scope.isChangeGlNumber = false;
        $scope.taxes = TaxesService.getAll();
        ServicesService.getGlNumbers(function (data) {
          $scope.glNumbersList = data;
        })
        $scope.showModal = false;

        $timeout(function() {
          $scope.showModal = true;
        }, 50)

        var origin = savedState.item;
        if (savedState.type === 'service' && origin) {
          $scope.editService = angular.copy(origin);
        } else {

          $scope.editService = {
            billable: true,
            isDefault: true,
            taxes: []
          };

          var length = $scope.taxes.length;
          for (var i = 0; i < length; i++) {
            var tax = $scope.taxes[i];
            if (tax.isDefault) {
              $scope.editService.taxes.push(tax);
            }
          }
        }

        $scope.stopPropagation = function(e) {
          e.stopPropagation();
        }
        $scope.createGlNumber = function () {
          var data = {
            glNumber: $scope.editService.glNumber,
            description: ""
          };
          ServicesService.createGlNumber(data, function (res) {
            console.log("res", res);
            $scope.glNumbersList.push(res);
            $scope.isChangeGlNumber = false;
          })
        }

        $scope.saveEditService = function (form, isModal) {
          if (form.$valid || isModal && form.editServiceName.$valid && form.editServiceRate.$valid) {
            $scope.disabledSaveButton = true;
            var saveService = angular.copy($scope.editService);
            if (saveService.glNumber) {
              var index = $scope.glNumbersList.findIndex(item => item.glNumber === saveService.glNumber);
            
              saveService.glNumber = (index > -1) ? { id: $scope.glNumbersList[index].id } : null
            } else {
              saveService.glNumber = null;
            }
         
          
            console.log("saveService",saveService);
            
            saveService.taxIds = saveService.taxes.map(function (tax) {
              return tax.id;
            });
            saveService.taxes = undefined;

            ServicesService.save(saveService, function (resp) {
              $scope.disabledSaveButton = false;

              $rootScope.$broadcast('newServiceHasBeenCreated', resp.id);
              if (!$scope.savedState.items.length) {
                $scope.closeWindow();
              }
            });
            unsubscribeClosingEvent();
          } else {
            $scope.triedToSaveService = true;
          }
        };

        $scope.isShowingErrors = function (form, fieldName) {
          return $scope.triedToSaveService && form[fieldName] && ($scope.triedToSaveService || form[fieldName].$dirty) && form[fieldName].$invalid;
        };

        $scope.validateServiceName = function (ngModelCtrl, modelId, afterValidationCallback) {
          ServicesService.isNameUnique($scope.editService.name, modelId, function (resp) {
            ngModelCtrl.$setValidity('unique', resp.valid);
            afterValidationCallback();
          });
        };

        $scope.changeGlNumber = function () {
          console.log("editService.glNumber",$scope.editService.glNumber);
          if ($scope.editService.glNumber) {
            var index = $scope.glNumbersList.findIndex(item => item.glNumber === $scope.editService.glNumber);
            $scope.isChangeGlNumber = (index > -1) ? false : true;
          } else {
            $scope.isChangeGlNumber = false;
          }
         
        }

        $scope.getValidationMessage = function (form) {

          if (form.$error.required) {
            for (var i = 0; i < form.$error.required.length; i++) {
              if ($scope.isShowingErrors(form, form.$error.required[i].$name)) {
                return 'Please fill in the required field(s).';
              }
            }
          }

          if (form.editServiceName && form.editServiceName.$error) {

            if (form.discountAmount && form.discountAmount.$error && form.discountAmount.$error.required) {
              return "Please select a Discount Amount!";
            }

            if (form.discountAmount && form.discountAmount.$error && form.discountAmount.$error.min) {
              return "Discount amount mustn't be less then 0!";
            }

            if (form.discountAmount && form.discountAmount.$error && form.discountAmount.$error.max) {
              return "Percent amount mustn't be greater then 100!";
            }

            if (form.discountAmount && form.discountAmount.$error && form.discountAmount.$error.pattern) {
              return "Only numbers allowed in Discount Amount!";
            }

            if (form.editServiceName.$error.maxlength) {
              return 'Service name exceeds maximum length.';
            }

            if (form.editServiceName.$error.minlength) {
              return 'Service name is too short!';
            }

            if (form.editServiceName.$error.unique) {
              return 'Service name already exists!';
            }
          }

          if (form.timeBlock && form.timeBlock.$dirty && form.timeBlock.$error && form.timeBlock.$error.invalidwhen) {
            return 'Minimal Time Slice should be greater than 0.';
          }
        };

        var unsubscribeClosingEvent = $scope.$on('createNewWindowClosing', createNewWindowClosing);

        function createNewWindowClosing() {
          var service = $scope.editService;
          var isServiceChanged;

          if (origin) {
            isServiceChanged = service.name !== origin.name || service.rate !== origin.rate;
          } else {
            isServiceChanged = service.name || service.rate;
          }

          if (isServiceChanged) {
            $scope.savedState.types.unshift('service');
            $scope.savedState.items.unshift($scope.editService);
          }
        }

      }]);

}());
