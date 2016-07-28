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
            $scope.tagColors = TagsService.getColors();

            if (!$scope.readonlyTags) {
              var input = $element.find('input');

              input.on('keydown', function (e) {
                $scope.dropdownOpened = true;

                var word = input.val().trim();
                if (e.keyCode === 13 && word && !input.parent().find('.dropdown-menu-child-focused').length) {
                  $scope.addTag(word);
                  input.val('');
                }

                $scope.$apply();
              });

              TagsService.search('', function (resp) {
                $scope.result = resp;
              });

              $document.on('click', $scope.saveTags);
              $scope.$on('$destroy', function () {
                $document.off('click', $scope.saveTags);
              });
            }
          },
          controller: function ($scope) {
            if (!$scope.readonlyTags) {
              var lastQuery = '',
                tagsChanged = false;

              $scope.$watch('newTag', searchTag);

              $scope.addTag = function (value) {
                if (typeof value === 'string') {
                  if (!$scope.currentCompany.allowCreateTags) {
                    return;
                  }

                  $scope.ticketTags.push({
                    word: value,
                    colorCode: 0
                  });
                } else {
                  $scope.ticketTags.push(value);
                  $scope.dropdownOpened = false;
                }

                tagsChanged = true;
                $scope.newTag = '';
                lastQuery = '';
              };

              $scope.removeTag = function (index) {
                $scope.ticketTags.splice(index, 1);
                tagsChanged = true;
              };

              $scope.saveTags = function () {
                if (tagsChanged) {
                  $scope.saving = true;
                  TagsService.setTagsInTicket($scope.ticketTags, $scope.ticketId, function () {
                    $scope.savedTicketTags = angular.copy($scope.ticketTags);
                    $scope.saving = false;
                    tagsChanged = false;

                    var searchQuery = lastQuery;
                    lastQuery = undefined;
                    searchTag(searchQuery);
                  });
                }
              };

              $scope.setFocus = function (event) {
                $scope.focusInput = !$scope.focusInput;
                $scope.dropdownOpened = true;
                event.stopPropagation();
              };

              $scope.setDropdownOpened = function (open) {
                if (!open) {
                  $scope.dropdownOpened = false;
                }
              };
            }

            function searchTag(query) {
              if (query !== undefined && lastQuery !== query) {
                TagsService.search(query, function (resp) {
                  $scope.result = resp;
                  lastQuery = query;
                });
              }
            }

          }
        }
      }]);

})();
