'use strict';

(function () {

  angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.draftsCtrl',
    ['$scope', 'DraftsService', '$timeout', '$rootScope', function ($scope, DraftsService, $timeout, $rootScope) {

      $scope.loadingOrRendering = true;
      DraftsService.getSources(function (resp) {
        $scope.sources = resp;
        $scope.loadingOrRendering = false;
      });

      $scope.openSource = function (selectedSource) {
        if (selectedSource.amount) {
          if (selectedSource.source === $scope.openedSource) {
            $rootScope.$broadcast('toggleDrafts' + $scope.openedSource);
            $timeout(function () {
              selectedSource.drafts = [];
              $scope.openedSource = '';
              $scope.openedSourceCount = 0;
            });
          } else {
            $scope.openedSource = selectedSource.source;
            $scope.openedSourceCount = selectedSource.amount;
          }
        }
      };

      $scope.isAnyDraftsExist = function (sources) {
        return sources.some(function (source) {
          return source.amount;
        });
      };

      $scope.openDraft = function (draftId) {
        $scope.openedDraft = draftId;
      };

    }]);
}());
