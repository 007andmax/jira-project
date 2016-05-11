'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.companyInfoTagsManageCtrl',
    ['$scope', 'TagsService', 'CompaniesService', function ($scope, TagsService, CompaniesService) {

      $scope.orderTags = {
        field: 'word',
        reverse: false
      };
      $scope.replaceDropdown = {};
      $scope.allowCreateTags = CompaniesService.getCurrentCompany().allowCreateTags;
      $scope.remove = TagsService.remove;
      $scope.removeAndReplace = TagsService.removeAndReplace;
      $scope.saveAllowingCreateCustomTags = CompaniesService.saveAllowingCreateCustomTags;

      TagsService.getAll($scope, function (resp) {
        $scope.tags = resp;
      });

      $scope.$on('colorpicker-closed', function (event, data) {
        if (event.targetScope && event.targetScope.tag && event.targetScope.tag.id) {
          TagsService.changeColor(event.targetScope.tag.id, event.targetScope.tag.color);
        }
      });

      $scope.createOrEdit = function (tag) {
        if (tag) {
          $scope.editedTag = angular.copy(tag);
          $scope.editingId = tag.id;
        } else {
          $scope.editedTag = {
            color: '#C5CFDB',
            usedCounter: 0
          };
          $scope.editingId = 'new';
        }
      };

      $scope.saveOrUpdate = function (form) {
        if (form.$valid) {

          if ($scope.editedTag.id) {
            TagsService.changeWord($scope.editedTag.id, $scope.editedTag.word, function (resp) {
              $scope.cancel();
            });
          } else {
            TagsService.save($scope.editedTag, function (resp) {
              $scope.cancel();
            });
          }

          $scope.triedToSave = false;
        } else {
          $scope.triedToSave = true;
        }
      };

      $scope.cancel = function () {
        $scope.triedToSave = false;
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
