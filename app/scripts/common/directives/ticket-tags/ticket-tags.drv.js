'use strict';

(function () {

  angular.module("quicktech.common.directives").directive("ticketTags",
    ['$document', 'TagsService', 'CompaniesService', 'UsersService',
      function ($document, TagsService, CompaniesService, UsersService) {
      return {
        restrict: 'E',
        templateUrl: '/html/scripts/common/directives/ticket-tags/ticket-tags.tpl.html',
        scope: {
          ticketId: '@',
          ticketTags: '=',
          readonlyTags: '@?'
        },
        link: function ($scope, $element) {
          $scope.currentCompany = CompaniesService.getCurrentCompany();
          $scope.currentUser = UsersService.getCurrentUser();
          $scope.tagColors = TagsService.getColors();
          $scope.savedTicketTags = angular.copy($scope.ticketTags);

          if (!$scope.readonlyTags) {
            var input = $element.find('input');
            input.on('keydown', function (e) {
              e.target.value.trim();
              if (e.keyCode === 13 && e.target.value) {
                $scope.addTag(e.target.value);
                e.target.value = '';
                $scope.$apply();
              }
            });

            $document.on('click', $scope.saveTags);
            $scope.$on('$destroy', function () {
              $document.off('click', $scope.saveTags);
            })
          }
        },
        controller: function ($scope) {
          if (!$scope.readonlyTags) {
            var lastQuery;

            $scope.$watch('newTag', searchTag);

            $scope.addTag = function (value) {
              if (typeof value === 'string') {
                if (!$scope.currentCompany.allowCreateTags && $scope.currentUser.role === 'USER') {
                  return;
                }

                $scope.ticketTags.push({
                  word: value,
                  colorCode: 0
                });
              } else {
                $scope.ticketTags.push(value);
              }

              $scope.newTag = '';
              lastQuery = '';
            };

            $scope.removeTag = function (index) {
              $scope.ticketTags.splice(index, 1);
            };

            $scope.saveTags = function () {
              if (!angular.equals($scope.savedTicketTags, $scope.ticketTags)) {
                $scope.saving = true;
                TagsService.setTagsInTicket($scope.ticketTags, $scope.ticketId, function () {
                  $scope.savedTicketTags = angular.copy($scope.ticketTags);
                  $scope.saving = false;
                });
              }
            };
          }

          function searchTag(query) {
            if (!query) {
              return $scope.result = [];
            }

            TagsService.search(query, function (resp) {
              $scope.result = resp;
            });
          }

        }
      }
    }]);

})();
