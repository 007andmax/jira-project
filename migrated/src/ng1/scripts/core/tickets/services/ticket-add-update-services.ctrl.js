'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketAddUpdateServicesCtrl',
      ['$scope','$rootScope',
        function ($scope,$rootScope) {
 
          $scope.isValidNewExpenseOrNote = false;
          if ($scope.serviceToEdit && $scope.serviceToEdit.length >= 1 && $scope.isMobileUpdateShown) {
            $scope.editService = $scope.serviceToEdit[0];
            var editDateStart = new Date($scope.editService.durationStart);
            var editDateEnd = new Date($scope.editService.durationEnd );
            $rootScope.saveForStartDate = new Date($scope.editService.durationStart);
            $rootScope.saveForEndDate =  new Date($scope.editService.durationEnd);
            $rootScope.quantityForSave = $scope.editService.quantity;
            $scope.editService.durationStart = {
                hour: getHourForAmPm(editDateStart),
                minute: editDateStart.getMinutes() > 9 ? editDateStart.getMinutes() :  editDateStart.getMinutes(),
                time: editDateStart.getHours() >= 12 ? 'PM' : 'AM'
              };
    
              $scope.editService.durationEnd = {
                hour: getHourForAmPm(editDateEnd),
                minute: editDateEnd.getMinutes() > 9 ? editDateEnd.getMinutes() :  editDateEnd.getMinutes(),
                time: editDateEnd.getHours() >= 12 ? 'PM' : 'AM'
              };
    
              $scope.saveStartDate =  $scope.editService.durationStart;
              $scope.saveEndDate =  $scope.editService.durationEnd;
        }
          if (!($scope.ticketUpdate && $scope.ticketUpdate.services && $scope.ticketUpdate.services.length)) {
            setTicketUpdateToDefault();
          }

          function setTicketUpdateToDefault() {
console.log('setTicketUpdateToDefault');
            $scope.setTicketUpdate({
              services: [{item:{}}]
            });

            $scope.setTriedToSaveUpdate(false);
          }

          $scope.resetDurationWhenTimePicker = function () {
            if (!$scope.editService) return;
            console.log('resetDurationWhenTimePicker');
            console.log('$scope.editService.quantity',$scope.editService.quantity);
            var timeInMinutes = $scope.editService.quantity * 60,
            hours = Math.floor(timeInMinutes / 60),
            minutes = Math.round(timeInMinutes - (hours * 60));
           

            var hourText = ((hours < 10) ? "0" + hours : hours);
            var minuteText = ((minutes < 10) ? "0" + minutes : minutes);
            $scope.durationText = hourText + ":" + minuteText;
            console.log('$scope.durationText',$scope.durationText);
          }
          $scope.resetDurationWhenTimePicker();
          $scope.isShowingErrors = function (form, fieldName) {
            if (!form) return;
            return form[fieldName] && !form[fieldName].$valid && (form[fieldName].$dirty || $scope.getTriedToSaveUpdate());
          };

          $scope.addService = function () {
            $scope.ticketUpdate.services.push({ item: {} });
          };

          $scope.$on('setCreateUpdateFormToDefault', setTicketUpdateToDefault)
          function getHourForAmPm(editDateStart) {
            if (editDateStart.getHours() >= 13) {
              return editDateStart.getHours() - 12
            } else if (editDateStart.getHours() == 0){
              return 12
            } else {
              return editDateStart.getHours();
            }
          }
        }]);
  }()
);
