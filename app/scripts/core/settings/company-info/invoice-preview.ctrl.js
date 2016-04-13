'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.invoicePreviewCtrl',
    ['$scope', '$modalInstance', function ($scope, $modalInstance) {
      $scope.locksInitialized = true;
      $scope.invoicePreview = true;

      var test = {
        "billTo": [{
          "id": "a5f1427f-be24-40a9-8bee-9c496e362daf",
          "address": "Winipeg Street, Manitou Beach, SK, Canada",
          "country": null,
          "postalCode": null,
          "suiteNumber": "44R",
          "countryCode": "Code7",
          "locationLat": 51.7197046,
          "locationLng": -105.4472744,
          "isPrimary": true,
          "locale": "America/Edmonton",
          "phoneNumbers": [{
            "id": "41435059-8a98-44c7-82f7-007815212f79",
            "number": "+9874802243",
            "typeNumber": "MOBILE",
            "priority": 1
          }],
          "timeZone": { "displayName": "Mountain Standard Time", "name": "America/Edmonton", "timeOffset": -21600000 },
          "addressWithSuitNumberAndPostalCode": "44R, Winipeg Street, Manitou Beach, SK, Canada"
        }],
        "shipTo": [{
          "id": "a5f1427f-be24-40a9-8bee-9c496e362daf",
          "address": "Winipeg Street, Manitou Beach, SK, Canada",
          "country": null,
          "postalCode": null,
          "suiteNumber": "44R",
          "countryCode": "Code7",
          "locationLat": 51.7197046,
          "locationLng": -105.4472744,
          "isPrimary": true,
          "locale": "America/Edmonton",
          "phoneNumbers": [{
            "id": "41435059-8a98-44c7-82f7-007815212f79",
            "number": "+9874802243",
            "typeNumber": "MOBILE",
            "priority": 1
          }],
          "timeZone": { "displayName": "Mountain Standard Time", "name": "America/Edmonton", "timeOffset": -21600000 },
          "addressWithSuitNumberAndPostalCode": "44R, Winipeg Street, Manitou Beach, SK, Canada"
        }],
        "company": {
          "id": "f51563d9-adb0-4d35-ad18-f6789c7a67f4",
          "parent": {
            "id": "61d0ad5b-8911-4ae2-abd8-37bdfafbd608",
            "parent": { "id": "e189bb02-c1b9-466e-8247-d9dc53f4bf81", "parent": null, "default": false },
            "default": false
          },
          "default": false,
          "companyInfo": {
            "id": "f51563d9-adb0-4d35-ad18-f6789c7a67f4",
            "name": "Apple",
            "domain": "apple.com",
            "accountType": "CLIENT",
            "status": "ACTIVE",
            "description": "This company was created only for testing purposes",
            "createdAt": 1457184574839,
            "deletedAt": null,
            "type": null,
            "logo": {
              "id": "29e7261e-afce-4431-a72a-ed9ea685f805",
              "origin": { "id": "69ef28f4-4a24-4bdb-a74e-cc92384a67ef" },
              "cropped": { "id": "69ef28f4-4a24-4bdb-a74e-cc92384a67ef" },
              "x": 0,
              "y": 0,
              "w": 0,
              "h": 0,
              "sizeW": 0,
              "sizeH": 0,
              "updatedAt": null
            },
            "cover": {
              "id": "8f13b59f-2dfe-470d-9ba1-d76d87da4612",
              "origin": { "id": "28f9104e-d729-40b0-8b37-d967dadd9ed1" },
              "cropped": { "id": "28f9104e-d729-40b0-8b37-d967dadd9ed1" },
              "x": 0,
              "y": 0,
              "w": 0,
              "h": 0,
              "sizeW": 0,
              "sizeH": 0,
              "updatedAt": null
            },
            "isDefault": false,
            "default": false,
            "$$hashKey": "object:4381"
          }
        },
        "companyName": "Apple",
        "defaultShipTo": null,
        "defaultBillTo": null,
        "techCompanyName": "Tech",
        "billingAddress": "44R, Winipeg Street, Manitou Beach, SK, Canada",
        "shippingAddress": "44R, Winipeg Street, Manitou Beach, SK, Canada",
        "senderAddress": "112, Calgary Trail NW, Edmonton, AB, Canada",
        "senderUser": {
          "id": "9c9ff037-ccd4-4c2b-8656-9c8f079e203c",
          "company": {
            "id": "61d0ad5b-8911-4ae2-abd8-37bdfafbd608",
            "parent": { "id": "e189bb02-c1b9-466e-8247-d9dc53f4bf81", "parent": null, "default": false },
            "default": false
          },
          "firstName": "Super",
          "lastName": "Admin",
          "phoneNumbers": [],
          "status": "Dolor sit amet, consectetuer elit adipiscing. Hui",
          "primaryEmail": "sa@quicktech.com",
          "secondaryEmail": "secondary_superadmin@quicktech.com",
          "deletedAt": null,
          "role": "SUPER_TECH_ADMIN",
          "startPage": "TRASH",
          "userStatistic": {
            "id": "8d8bdf6c-7ef9-41ba-bc50-d0709da65691",
            "ticketsSubmitted": 0,
            "ticketsResolved": 13
          },
          "avatar": null,
          "online": true,
          "isEmailVerified": true,
          "isContact": true,
          "userEnabled": true,
          "isDefault": false,
          "priority": 0,
          "designation": "Account Owner",
          "subscription": null,
          "default": false,
          "emailVerified": true,
          "contact": true,
          "accountType": "TECH"
        },
        "number": "0238",
        "date": 1460558267135,
        "dueDate": 1461767867135,
        "taxRates": [{
          "versionedId": { "id": "8e2b600d-9ded-4413-9145-8d658a05fc93", "version": 0 },
          "createdAt": 1460558110201,
          "updatedAt": 1460558168025,
          "deletedAt": null,
          "rate": 10,
          "description": null,
          "company": {
            "id": "f51563d9-adb0-4d35-ad18-f6789c7a67f4",
            "parent": {
              "id": "61d0ad5b-8911-4ae2-abd8-37bdfafbd608",
              "parent": { "id": "e189bb02-c1b9-466e-8247-d9dc53f4bf81", "parent": null, "default": false },
              "default": false
            },
            "default": false
          },
          "originalTaxRate": { "versionedId": { "id": "1ce972f3-babd-4e11-9b18-e424a27f1f58", "version": 0 } },
          "code": "Preview tax 1",
          "sum": 13.75,
          "$$hashKey": "object:11528"
        }, {
          "versionedId": { "id": "683558c7-2852-43c2-8932-09f136e71529", "version": 0 },
          "createdAt": 1460558110202,
          "updatedAt": 1460558168034,
          "deletedAt": null,
          "rate": 20,
          "description": null,
          "company": {
            "id": "f51563d9-adb0-4d35-ad18-f6789c7a67f4",
            "parent": {
              "id": "61d0ad5b-8911-4ae2-abd8-37bdfafbd608",
              "parent": { "id": "e189bb02-c1b9-466e-8247-d9dc53f4bf81", "parent": null, "default": false },
              "default": false
            },
            "default": false
          },
          "originalTaxRate": { "versionedId": { "id": "32c8e2de-ea35-42cf-a4e4-3613b23b537e", "version": 0 } },
          "code": "Preview tax 2",
          "sum": 27.5,
          "$$hashKey": "object:11529"
        }],
        "taxRatesSum": 41.25,
        "sum": 178.75,
        "productsSum": 0,
        "servicesSum": 137.5,
        "sumWithoutTaxRates": 137.5,
        "hasTaxRates": true,
        "termsAndConditions": "asdfgdafgsdfg",
        "tickets": [{
          "number": "0265",
          "subject": "dsrgdsfg",
          "closedAt": 1460558248202,
          "productExpenses": [],
          "serviceExpenses": [{
            "id": "ffff5ffd-65c4-4214-bb94-e99285d011f4",
            "sum": 137.5,
            "quantity": 2.5,
            "billableQuantity": 2.5,
            "createdAt": 1460558204608,
            "updatedAt": null,
            "description": "preview service 1",
            "itemOrder": 0,
            "isServiceExpense": true,
            "item": {
              "versionedId": { "id": "aa86838b-b2be-47a5-a06f-e113f32b289a", "version": 0 },
              "createdAt": 1460558168333,
              "updatedAt": null,
              "deletedAt": null,
              "name": "Onsite Consulting",
              "timeBlock": 2.5,
              "rate": 55,
              "taxable": true,
              "billable": true,
              "isDefault": false,
              "company": {
                "id": "f51563d9-adb0-4d35-ad18-f6789c7a67f4",
                "parent": {
                  "id": "61d0ad5b-8911-4ae2-abd8-37bdfafbd608",
                  "parent": { "id": "e189bb02-c1b9-466e-8247-d9dc53f4bf81", "parent": null, "default": false },
                  "default": false
                },
                "default": false
              },
              "originService": { "versionedId": { "id": "d6ae1879-505d-4743-92ea-252c9e6cc94f", "version": 0 } }
            },
            "date": 1460494800000,
            "billable": true,
            "price": 55,
            "serviceExpense": true,
            "editedExpense": false,
            "$$hashKey": "object:11539"
          }],
          "productsSum": 0,
          "servicesSum": 137.5,
          "totalSum": 137.5,
          "$$hashKey": "object:11536"
        }]
      }

      $scope.currentInvoice = {
        billTo: {
          address: 'Winipeg Street, Manitou Beach, SK, Canada',
          suiteNumber: '44R',
          addressWithSuitNumberAndPostalCode: '44R, Winipeg Street, Manitou Beach, SK, Canada'
        },
        shipTo: {
          address: 'Winipeg Street, Manitou Beach, SK, Canada',
          suiteNumber: '44R',
          addressWithSuitNumberAndPostalCode: '44R, Winipeg Street, Manitou Beach, SK, Canada'
        },
        company: {
          parent: {
            id: $scope.currentUser.company.id
          },
          default: false,
          companyInfo: {
            name: 'Client Company',
            description: 'This company was created only for testing purposes'
          }
        },
        companyName: 'Client Company',
        techCompanyName: $scope.editCompany.name || 'Teh Company',
        billingAddress: '44R, Winipeg Street, Manitou Beach, SK, Canada',
        shippingAddress: '44R, Winipeg Street, Manitou Beach, SK, Canada',
        senderAddress: $scope.companyForSettingPage.addresses[0].addressWithSuitNumberAndPostalCode || 'Tech Company Address',
        number: $scope.invoiceConfig ? $scope.invoiceConfig.count || '0001' : '0001',
        date: 1460552903659,
        dueDate: 1461762503659,
        "taxRates": [{
          "rate": 10,
          "code": "Preview tax 1",
          "sum": 13.75
        }, {
          "rate": 20,
          "code": "Preview tax 2",
          "sum": 27.5
        }],
        "taxRatesSum": 41.25,
        sum: 1162.75,
        productsSum: 984,
        servicesSum: 137.5,
        sumWithoutTaxRates: 1121.5,
        hasTaxRates: false,
        termsAndConditions: $scope.invoiceConfig ? $scope.invoiceConfig.termsAndConditions : '',
        tickets: [{
          number: '0000',
          subject: 'Ticket subject',
          closedAt: 1460552886511,
          productExpenses: [{
            sum: 900,
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
              description: 'Samsung 850 EVO MZ-75E250B',
              taxable: true
            },
            billable: true,
            price: 450,
            editedExpense: false,
            serviceExpense: false
          }, {
            sum: 84,
            quantity: 1,
            billableQuantity: 1,
            itemOrder: 1,
            isServiceExpense: false,
            item: {
              cost: 55,
              sale: 84,
              ilc: '1225-8u54445-0',
              manufacture: 'SP064GBSTXBU1V20-SP',
              description: 'Silicon Power 64 GB microSDXC Class 10 UHS-I Elite Color + SD adapter',
              taxable: false
            },
            serialNumber: 'serial_number',
            billable: true,
            price: 84,
            editedExpense: false,
            serviceExpense: false
          }],
          "serviceExpenses": [{
            "sum": 137.5,
            "quantity": 2.5,
            "billableQuantity": 2.5,
            "description": "service description",
            "itemOrder": 0,
            "isServiceExpense": true,
            "item": {
              "name": "Onsite Consulting",
              "timeBlock": 2.5,
              "rate": 55,
              "taxable": true,
              "billable": true,
              "isDefault": false
            },
            "date": 1460494800000,
            "billable": true,
            "price": 55,
            "serviceExpense": true,
            "editedExpense": false
          }],
          productsSum: 984,
          servicesSum: 137.5,
          totalSum: 1121.5
        }]
      };

      $scope.currentBillTo = {
        addressWithSuitNumberAndPostalCode: $scope.currentInvoice.billTo.addressWithSuitNumberAndPostalCode
      };

      $scope.currentShipTo = {
        addressWithSuitNumberAndPostalCode: $scope.currentInvoice.shipTo.addressWithSuitNumberAndPostalCode
      };

      $scope.close = function () {
        $modalInstance.dismiss();
      };

    }]);

}());
