'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.recurring.editProductCtrl',
    ['$scope', 'RecurringService', 'ProductsService',
      function ($scope, RecurringService, ProductsService) {

        $scope.editProduct = {};

        $scope.productCategories = ProductsService.getCategories($scope);
        //$scope.autocompleteData = ProductsService.getFullListForAutocomplete();
        $scope.autocompleteData = getFullListForAutocomplete();


        if ($scope.product !== undefined) {

          $scope.editProduct = {
            id: $scope.product.id,
            description: $scope.product.description,
            quantity: $scope.product.quantity,
            serialNumber: $scope.product.serialNumber,
            sum: $scope.product.sum,
            item: {
              versionedId: $scope.product.item.versionedId,
              name: $scope.product.item.name,
              cost: $scope.product.item.cost
            }
          };
        }

        $scope.loadProductByCategory = function (categoryId) {
          $scope.productsByCategory = ProductsService.getAllByCategory($scope, categoryId)
        };

        $scope.selectProduct = function (product) {
          $scope.editProduct.item = product;
        };

        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && ($scope.triedToSaveProduct || form[fieldName].$dirty) && !form[fieldName].$valid;
        };

        $scope.cancelEditProduct = function () {
          $scope.$emit('cancelEditForm');
        };

        $scope.isProductNameCorrect = function(){
          if(!$scope.editProduct.item.name || !$scope.productsByCategory){
            return;
          }

          for(var i = 0; i < $scope.productsByCategory.length; i++){
            if($scope.editProduct.item.name === $scope.productsByCategory[i].name){
              $scope.editProduct.item = $scope.productsByCategory[i].staticCopy();
              return;
            } else {
              if($scope.editProduct.item.versionedId){
                $scope.editProduct.item.versionedId.id = '';
              }
            }
          }
        };

        $scope.saveProduct = function (form) {
          if (form.$valid) {
            $scope.disabledCreateProductButton = true;
            RecurringService.saveRecInvProductExpense($scope.invoice.id, $scope.editProduct, function () {
              $scope.disabledCreateProductButton = true;
              $scope.$emit('cancelEditForm');
            });
          } else {
            $scope.triedToSaveProduct = true;
          }
        };

        $scope.getValidationMessage = function (form) {
          if (form.$error.required) {
            for (var i = 0; i < form.$error.required.length; i++) {
              if ($scope.isShowingErrors(form, form.$error.required[i].$name)) {
                return 'Please fill in the required field(s).';
              }
            }
          }

          if (form.editProductName && form.editProductName.$error && form.editProductName.$error.parse) {
            return 'Please select product from dropdown.';
          }

          if (form.editProductDescription && form.editProductDescription.$error && form.editProductDescription.$error.maxlength) {
            return 'Description exceeds maximum length.';
          }

          if (form.amount && form.amount.$error && form.amount.$error.lowprice) {
            return 'Sale price must be higher than total cost price.';
          }

        };

      function getFullListForAutocomplete() {
            return [{
              "id": "f9f808cf-d0c2-4978-846b-168e3c3ea7f2",
              "name": "Other",
              "deletedAt": null,
              "products": [{
                "versionedId": {"id": "195a38b0-b572-4b2e-a22b-2aa1f8ae4351", "version": 0},
                "createdAt": 1449795006286,
                "updatedAt": null,
                "deletedAt": null,
                "code": 3,
                "name": "Scanner",
                "sale": 120
              }, {
                "versionedId": {"id": "dde2bc9e-b521-46ee-80f9-d9992a174d43", "version": 0},
                "createdAt": 1449795006894,
                "updatedAt": null,
                "deletedAt": null,
                "code": 4,
                "name": "keyboard",
                "sale": 45
              }, {
                "versionedId": {"id": "f6307ff3-9427-49f6-9519-bd20253ab240", "version": 0},
                "createdAt": 1449795007374,
                "updatedAt": null,
                "deletedAt": null,
                "code": 5,
                "name": "Xerox",
                "sale": 300
              }]
            }, {
              "id": "e9ff9971-4e7e-43af-881a-e49b10aad247",
              "name": "SSD",
              "deletedAt": null,
              "products": [{
                "versionedId": {"id": "6a89cab0-2368-4229-97fe-0d5365423708", "version": 0},
                "createdAt": 1449795005285,
                "updatedAt": null,
                "deletedAt": null,
                "code": 2,
                "name": "A-Data XPG SX900 256GB 2.5 SATAIII MLC",
                "sale": 120
              }, {
                "versionedId": {"id": "ab305f40-0239-4b73-a951-c95929fe51e5", "version": 0},
                "createdAt": 1449795010363,
                "updatedAt": null,
                "deletedAt": null,
                "code": 10,
                "name": "Crucial MX200 500GB 2.5SATAIII MLC",
                "sale": 250
              }, {
                "versionedId": {"id": "e26cd29c-1fd5-4775-a0b9-ea6364321182", "version": 0},
                "createdAt": 1449795010101,
                "updatedAt": null,
                "deletedAt": null,
                "code": 9,
                "name": "Intel 730 480GB 2.5 SATAIII MLC ",
                "sale": 450
              }]
            }, {
              "id": "5ec1e5b8-9161-428e-a774-0b2d30ac6cf4",
              "name": "Printers",
              "deletedAt": null,
              "products": [{
                "versionedId": {"id": "dec0776a-4ec8-480a-b2c6-a135f0902d2f", "version": 0},
                "createdAt": 1449795004265,
                "updatedAt": null,
                "deletedAt": null,
                "code": 1,
                "name": "Printer",
                "sale": 150
              }]
            }, {
              "id": "84f06a4e-6591-4d18-847d-4d73c538cfaa",
              "name": "Memory Cards",
              "deletedAt": null,
              "products": [{
                "versionedId": {"id": "022baa8b-aed7-4c2b-a539-fe4eb6f73826", "version": 0},
                "createdAt": 1449795009350,
                "updatedAt": null,
                "deletedAt": null,
                "code": 8,
                "name": "Silicon Power Touch 830 32GB",
                "sale": 59
              }, {
                "versionedId": {"id": "4d1b331a-7e2e-4ea9-9d41-b7f53e14b29f", "version": 0},
                "createdAt": 1449795008840,
                "updatedAt": null,
                "deletedAt": null,
                "code": 7,
                "name": "Kingston DataTraveler SE9 16GB",
                "sale": 84
              }, {
                "versionedId": {"id": "dc56fffe-30b1-4337-b002-a5bf6e786969", "version": 0},
                "createdAt": 1449795008293,
                "updatedAt": null,
                "deletedAt": null,
                "code": 6,
                "name": "Transcend JetFlash 330 16GB",
                "sale": 80
              }]
            }]
          }

      }]);

}());
