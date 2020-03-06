'use strict';

(function () {

    angular.module('quicktech.core.services').controller('quicktech.core.services.userdeviceServiceCtrl',
        ['$scope', '$rootScope', 'CompaniesService', 'ServicesService',
            function ($scope, $rootScope, CompaniesService, ServicesService) {
                $scope.glNumbersList = [];
                $scope.currentUserDeviceContracts = null;
                $rootScope.$on('setRealTimeGLNumbers', function (event, newInvoice) {
                    console.log('newInvoice', newInvoice);
                    $scope.glNumbersList = newInvoice;
                });
                $scope.glNumbersList = CompaniesService.getGlNumbers();
                $scope.getContracts = function (field) {
                    var glNumber = null;
                    $scope.glNumbersList.forEach(element => {
                        if (element[field]) glNumber = element;

                    });
                    return glNumber;
                }
                $scope.currentUserDeviceContracts = $scope.getContracts('serviceContract');
                console.log("$scope.currentUserDeviceContracts", $scope.currentUserDeviceContracts);
                $scope.getGlNumberName = function (glNumber) {
                    console.log("glNumber", glNumber);
                    if (glNumber) {
                        var find = $scope.glNumbersList.find(function (c) {
                            return c.id === glNumber.id;
                        });
                        if (find) {
                            if (find && $scope.checkGlNumberValueMatched(find)) {
                                console.log("find", find);
                                console.log("$scope.currentUserDeviceContracts", $scope.currentUserDeviceContracts);
                                if ($scope.currentUserDeviceContracts == null || $scope.currentUserDeviceContracts.id !== find.id) {
                                    console.log(" no =");
                                    $scope.setGlNumberContract(find.id, 'serviceContract');
                                }
                            }
                        }
                        return find ? find.glNumber : '';
                    }
                };
                $scope.checkGlNumberValueMatched = function (inputValue) {
                    if (inputValue) {
                        return $scope.glNumbersList.some(function (item) {
                            return item.id === inputValue.id
                        })
                    } else {
                        return false
                    }
                };
                $scope.checkClearContract = function (contractType) {
                    var index = $scope.glNumbersList.findIndex(item => item[contractType] === true);
                    if (index > -1) return true;
                    return false;
                }
                $scope.resetContract = function (contractType) {
                    var id;
                    var index = $scope.glNumbersList.findIndex(item => item[contractType] === true);
                    if (index > -1) id = $scope.glNumbersList[index].id;
                    ServicesService.resetContractGlNumber(id, contractType, function (data) {
                        console.log("data", data);
                        if ($scope.glNumbersList[index][contractType])  $scope.glNumbersList[index][contractType] = false;
                   
                        $scope.currentUserDeviceContracts = null;
                    })
                }
                $scope.setGlNumberContract = function (id, contractType) {
                    ServicesService.setContractGlNumber(id, contractType, function (data) {
                        console.log("data", data);
                        updateGlNumberContract(data, contractType, true);
                    })
                }

                function updateGlNumberContract(data, contractType, value) {
                    $scope.glNumbersList.forEach(element => {
                        if (element.id === data.id) {
                            element[contractType] = true;
                        } else {
                            element[contractType] = false;
                        }
                    });
                }
            }]);

}());
