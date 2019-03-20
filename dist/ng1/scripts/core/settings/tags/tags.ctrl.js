'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.tagsCtrl',
    ['$scope', 'TagsService', 'CompaniesService', '$rootScope','$state', function ($scope, TagsService, CompaniesService, $rootScope, $state) {

      $scope.orderTags = {
        field: 'word',
        reverse: false
      };
      $scope.tagColors = TagsService.getColors();
      $scope.replaceDropdown = {};
      $scope.allowCreateTags = CompaniesService.getCurrentCompany().allowCreateTags;
      $scope.removeAndReplace = TagsService.removeAndReplace;
      $scope.saveAllowingCreateCustomTags = CompaniesService.saveAllowingCreateCustomTags;

      TagsService.getAll($scope, function (resp) {
        $scope.tags = angular.copy(resp);
      });

      TagsService.getAllCompanies($scope, function(resp) {
        $scope.companyTags = resp.data || resp;
      });

      $rootScope.$on('$stateChangeStart', function(){setShown(true);});



      $scope.$watch(function() {
        return $rootScope.createdCompanyTag;
      }, function(val) {

        if (typeof val === 'string') {

          $scope.companyTags = $scope.companyTags.filter(function(el) {
            return el.id !== val;
          });
        } else if (val) {

          var index = $scope.companyTags.findIndex(function(el) {
            return el.id === val.id;
          });


          if (index !== -1) {
            $scope.companyTags[index] = val;
          } else {

            $scope.companyTags.push(val);
          }
        }
      });

      $scope.changeColor = function (open, tag) {
        if (!open) {
          TagsService.changeColor(tag.id, tag.colorCode);
        }
      };

      $scope.createOrEdit = function (tag) {
        if (tag) {
          $scope.editedTag = angular.copy(tag);
          $scope.editingId = tag.id;
        } else {
          $scope.editedTag = {
            colorCode: 0,
            usedCounter: 0
          };
          $scope.editingId = 'new';
        }
      };

      function setShown(reverse) {
        if (reverse) {
          return $scope.shownTags = (($state.params.type !== 'company') ? 'company' : 'ticket');
        } else {
          return $scope.shownTags = (($state.params.type === 'company') ? 'company' : 'ticket');
        }
      }

      setShown();

      $scope.saveOrUpdate = function (form) {
        if (form.$valid && !$scope.saveInProgress) {

          $scope.saveInProgress = true;

          if ($scope.editedTag.id) {

            if ($scope.shownTags === 'ticket') {
              TagsService.changeWord($scope.editedTag.id, $scope.editedTag.word, function (resp) {
                $scope.cancel();
              });
            } else {
              TagsService.changeWordCompany($scope.editedTag.id, $scope.editedTag.word, function (resp) {
                $scope.cancel();

                $scope.companyTags.find(function(el) {
                  return el.id === $scope.editedTag.id;
                }).word = $scope.editedTag.word;
              });
            }
          } else {
            if ($scope.shownTags === 'ticket') {
              TagsService.save($scope.editedTag, function (resp) {
                $scope.cancel();
              });
            } else {
              TagsService.saveForCompany($scope.editedTag, function (resp) {
                $scope.cancel();
                var tag = Object.assign({}, $scope.editedTag);
                tag.id = resp.data.id;

                // $scope.companyTags.push(tag);
              });
            }

          }
        } else {
          $scope.triedToSave = true;
        }
      };

      $scope.remove = function (tagId) {
        if (!$scope.removeInProgress) {
          $scope.removeInProgress = true;

          if ($scope.shownTags === 'ticket') {
            TagsService.remove(tagId, function () {
              $scope.removeInProgress = false;
            });
          } else {
            TagsService.removeCompany(tagId, function () {
              $scope.removeInProgress = false;

              $scope.companyTags = $scope.companyTags.filter(function(el) {
                return el.id !== tagId;
              })
            });
          }

        }
      };

      $scope.cancel = function () {
        $scope.triedToSave = false;
        $scope.saveInProgress = false;
        $scope.editingId = '';
      };

      $scope.setOrderForTags = function (option) {
        if (option === $scope.orderTags.field) {
          $scope.orderTags.reverse = !$scope.orderTags.reverse;
        } else {
          $scope.orderTags.field = option;
          $scope.orderTags.reverse = false;
        }
      };

      $scope.orderByForTags = function (item) {
        if ($scope.orderTags.field === 'word') {
          return item.word;
        } else if ($scope.orderTags.field === 'usedCounter') {
          return item.usedCounter;
        }
      };

      $scope.initReplace = function (open, tag, form) {
        if (!open) {
          $scope.replaceDropdown[tag.id].selectedTag = '';
          form.$setPristine();
        }
      };

    }]);

}());
