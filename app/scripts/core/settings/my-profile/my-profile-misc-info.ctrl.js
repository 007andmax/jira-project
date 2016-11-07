'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.myProfileMiscInfoCtrl',
    ['$scope', '$state', '$stateParams', '$location', 'UsersService',
      function ($scope, $state, $stateParams, $location, UsersService) {

        $scope.pageMapping = {
          'UNASSIGNED': 'Unassigned',
          'MY_TICKETS': 'My Tickets',
          'SHARED': 'Shared',
          'OPEN': 'Open',
          'CLOSED': 'Closed',
          'TRASH': 'Trash',
          'SPAM': 'Spam'
        };

        $scope.patternShiftTiming = /^\s*([01]?\d|2[0-3]):?([0-5]\d)( +| to )([01]?\d|2[0-3]):?([0-5]\d)\s*$/;
        $scope.pageToOpen = $scope.userProfile.startPage;

        $scope.setPageToOpen = function (value) {
          $scope.pageToOpen = value;
          $scope.saveMiscInfo($scope.miscInfoForm);
        };

        $scope.saveMiscInfo = function (form) {
          if (form.$valid) {

            var miscInfo = {
              startPage: $scope.pageToOpen
            };

            UsersService.saveForUserProfile(miscInfo, 'misc', function () {
              form.$setPristine();
            })
          }
        };

        $scope.validShiftTiming = function (form) {
          if ($scope.shiftTiming) {
            var timeRange = getMinFromTime($scope.shiftTiming);

            form.shiftTiming.$setValidity('validShiftTiming', (+timeRange.from < +timeRange.to));
          }
        };

        function getMinFromTime(time) {
          var matchTime = time.match($scope.patternShiftTiming),
            fromMin = ((+matchTime[1] * 60) + (+matchTime[2])),
            toMin = ((+matchTime[4] * 60) + (+matchTime[5]));

          return {from: fromMin, to: toMin}
        }

        (function setShiftTiming() {

          var fromTimeHour = Math.floor($scope.userProfile.timeRange.from / 60);
          var fromTimeMin = ($scope.userProfile.timeRange.from % 60);

          var toTimeHour = Math.floor($scope.userProfile.timeRange.to / 60);
          var toTimeMin = ($scope.userProfile.timeRange.to % 60);

          var fromTime = fromTimeHour.toString() + ':' + (fromTimeMin < 10 ? '0' : '') + fromTimeMin.toString();
          var toTime = toTimeHour.toString() + ':' + (toTimeMin < 10 ? '0' : '') + toTimeMin.toString();

          $scope.shiftTiming = fromTime + ' to ' + toTime;

        })();

      }]);

}());
