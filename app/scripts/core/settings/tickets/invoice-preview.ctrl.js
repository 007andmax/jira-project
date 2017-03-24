'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.invoicePreviewCtrl',
    ['$scope', '$uibModalInstance', '$rootScope', 'CompaniesService', function ($scope, $uibModalInstance, $rootScope, CompaniesService) {

      $scope.locksInitialized = true;
      $scope.invoicePreview = true;

      $scope.currentInvoice = {
        billTo: {
          addressWithSuitNumberAndPostalCode: '67,  Cartage Systems Ltd, 69 Avenue Southeast\nCalgary, AB\nT2C 4Y7'
        },
        shipTo: {
          addressWithSuitNumberAndPostalCode: '67,  Cartage Systems Ltd, 69 Avenue Southeast\nCalgary, AB\nT2C 4Y7'
        },
        company: {
          parent: {
            logo: $rootScope.getCompanyLogoUrl(CompaniesService.getCurrentCompany())
          },
          default: false,
          companyInfo: {
            name: 'Client Company',
            description: 'This company was created only for testing purposes'
          }
        },
        companyName: 'Client Company',
        techCompanyName: $scope.companyForSettingPage.name,
        senderAddress: $scope.companyForSettingPage.addresses[0].addressWithSuitNumberAndPostalCode,
        number: $scope.invoiceConfig ? $scope.invoiceConfig.count : '0001',
        date: 1460552903659,
        dueDate: 1461762503659,
        productsSum: 984,
        servicesSum: 137.5,
        discountSum: 0,
        taxSum: 0,
        totalSum: 1162.75,
        termsAndConditions: $scope.invoiceConfig ? $scope.invoiceConfig.termsAndConditions : '',
        tickets: [{
          number: '0000',
          subject: 'Ticket subject',
          closedAt: 1460552886511,
          productExpenses: [{
            totalSum: 900,
            discountSum: 0,
            taxSum: 0,
            quantity: 2,
            billableQuantity: 2,
            createdAt: 1460552783790,
            itemOrder: 0,
            isServiceExpense: false,
            item: {
              cost: 350,
              sale: 450,
              ilc: '66613-21-0',
              manufacture: 'MZ-75E250B',
              description: 'Samsung 850 EVO MZ-75E250B'
            },
            billable: true,
            price: 450,
            editedExpense: false,
            serviceExpense: false
          }, {
            totalSum: 84,
            discountSum: 0,
            taxSum: 0,
            quantity: 1,
            billableQuantity: 1,
            itemOrder: 1,
            isServiceExpense: false,
            item: {
              cost: 55,
              sale: 84,
              ilc: '1225-8u54445-0',
              manufacture: 'SP064GBSTXBU1V20-SP',
              description: 'Silicon Power 64 GB microSDXC Class 10 UHS-I Elite Color + SD adapter'
            },
            serialNumber: 'serial_number',
            billable: true,
            price: 84,
            editedExpense: false,
            serviceExpense: false
          }],
          serviceExpenses: [{
            totalSum: 137.5,
            discountSum: 0,
            taxSum: 0,
            quantity: 2.5,
            billableQuantity: 2.5,
            description: 'service description',
            itemOrder: 0,
            isServiceExpense: true,
            item: {
              name: 'Onsite Consulting',
              timeBlock: 2.5,
              rate: 55,
              billable: true,
              isDefault: false
            },
            date: 1460494800000,
            billable: true,
            price: 55,
            serviceExpense: true,
            editedExpense: false
          }],
          productsSum: 984,
          servicesSum: 137.5,
          discountSum: 0,
          taxSum: 0,
          totalSum: 1121.5
        }]
      };

      $scope.currentInvoice.techCompanyName = $scope.currentInvoice.techCompanyName || 'Tech Company';
      $scope.currentInvoice.senderAddress = $scope.currentInvoice.senderAddress || 'Tech Company Address';
      $scope.currentInvoice.number = $scope.currentInvoice.number || '0001';

      $scope.currentBillTo = {
        addressWithSuitNumberAndPostalCode: $scope.currentInvoice.billTo.addressWithSuitNumberAndPostalCode
      };

      $scope.currentShipTo = {
        addressWithSuitNumberAndPostalCode: $scope.currentInvoice.shipTo.addressWithSuitNumberAndPostalCode
      };

      $scope.close = function () {
        $uibModalInstance.dismiss();
      };

    }]);

}());
