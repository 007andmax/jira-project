'use strict';

(function () {

  angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.draftsCtrl',
    ['$scope', 'DraftsService', '$timeout', '$rootScope', 'quicktech.common.services.SharedStateService', '$state',
      function ($scope, DraftsService, $timeout, $rootScope, SharedStateService, $state) {
        var selectedDraftsIds = SharedStateService.getSharedState('draftsHeader').selectedIds,
          globalSearch = SharedStateService.getSharedState('globalSearch');

        $scope.selectedDrafts = {};
        $scope.loadingOrRendering = true;

        DraftsService.getSources(function (resp) {
          $scope.sources = resp;
          $scope.loadingOrRendering = false;
        });

        $scope.openSource = function (selectedSource) {
          if (selectedSource.amount && !$scope.loadingOrRendering) {
            if (selectedSource.source === $scope.openedSource) {
              $rootScope.$broadcast('hideDrafts' + $scope.openedSource);
              $timeout(function () {
                selectedSource.drafts = [];
                $scope.openedSource = '';
              });
            } else {
              $scope.openedSource = selectedSource.source;
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

        $scope.toggleSelectedDrafts = function (source) {
          if (source.drafts && source.drafts.length) {
            for (var i = 0; i < source.drafts.length; i++) {
              var draft = source.drafts[i];
              $scope.selectedDrafts[draft.id] = !source.selected;
              $scope.toggleSelectedDraft(draft.id);
            }
          } else {
            $scope.openSource(source);
          }
        };

        $scope.toggleSelectedDraft = function (draftId, source) {
          if ($scope.selectedDrafts[draftId]) {
            if (selectedDraftsIds.indexOf(draftId) === -1) {
              selectedDraftsIds.push(draftId);
            }
          } else {
            var indexOfId = selectedDraftsIds.indexOf(draftId);
            if (indexOfId > -1) {
              selectedDraftsIds.splice(indexOfId, 1);
            }
          }
          globalSearch.selectedItemsCount = selectedDraftsIds.length;

          if ($state.includes('drafts.details') && !globalSearch.selectedItemsCount) {
            globalSearch.goBack.isEnabled = true;
            globalSearch.goBack.func = function () {
              $state.go('drafts');
              globalSearch.goBack.isEnabled = !!globalSearch.selectedItemsCount;
            };
            globalSearch.goBack.tooltip = 'collapse inbox';
          } else {
            globalSearch.goBack.isEnabled = !!globalSearch.selectedItemsCount;
            globalSearch.goBack.func = uncheckAllDrafts;
            globalSearch.goBack.tooltip = 'reset selected items';
          }

          if (source && source.drafts && source.drafts.length) {
            source.selected = source.drafts.every(function (draft) {
              return selectedDraftsIds.indexOf(draft.id) > -1;
            });
          }
        };

        $scope.$on('openDraftSource', function (event, source, draftId) {
          $scope.openedSource = source;
          $scope.openedDraft = draftId;
        });

        $scope.$on('uncheckAllDrafts', uncheckAllDrafts);
        $scope.$on('$destroy', uncheckAllDrafts);
        $scope.$on('uncheckIfSelectedDraft', function (event, draftId) {
          if ($scope.selectedDrafts[draftId]) {
            $scope.selectedDrafts[draftId] = false;
            $scope.toggleSelectedDraft(draftId);
          }
        });

        function uncheckAllDrafts(event, closeCurrentDraft) {
          if ($scope.selectedDrafts[$scope.openedDraft] && closeCurrentDraft) {
            $scope.openedDraft = '';
            $state.go('drafts');
          }
          $scope.selectedDrafts = {};
          selectedDraftsIds.splice(0, selectedDraftsIds.length);
          for (var i = 0; i < $scope.sources.length; i++) {
            var source = $scope.sources[i];
            source.selected = false;
          }

          globalSearch.selectedItemsCount = 0;
          globalSearch.goBack.isEnabled = $state.includes('drafts.details');
          if (globalSearch.goBack.isEnabled) {
            globalSearch.goBack.func = function () {
              $state.go('drafts');
              globalSearch.goBack.isEnabled = !!globalSearch.selectedItemsCount;
            };
            globalSearch.goBack.tooltip = 'collapse inbox';
          }
        }

      }]);
}());
