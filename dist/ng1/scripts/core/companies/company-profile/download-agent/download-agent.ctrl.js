'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.downloadAgent',
    ['$scope', 'EmailSettingsService', 'DevicesService', '$timeout', 'UsersService', '$rootScope',
      function ($scope, EmailSettingsService, DevicesService, $timeout, UsersService, $rootScope) {
        var savedTemplate,
          templateKey = 'DOWNLOAD_AGENT',
          timeout = $timeout(angular.noop);

        if (!$scope.company) {
          $scope.company = $rootScope.companyForDownload;
        }

        $scope.usersWithEmails = UsersService.getAllByCompanyId($scope.company.id).filter(function (user) {
          return !!user.primaryEmail;
        });

        $scope.downloadAgentUser = {
          agentName: '',
          agentPassword: '',
          userName: '',
          email: '',
          companyId: $scope.company.id
        };
        $scope.downloadLink = '';

        //EmailSettingsService.getTemplate(templateKey, function (data) {
        //
        //  $scope.emailTemplate = {
        //    subject: data.subject,
        //    body: data.body
        //  };
        //
        //  savedTemplate = angular.copy($scope.emailTemplate);
        //  $scope.keywords = data.keywords;
        //});

        // console.log($scope.company.id, 'COMPANYID ID ID')

        $scope.$watch(function () {
          return $scope.downloadAgentUser.agentName + ' ' + $scope.downloadAgentUser.agentPassword;
        }, function () {
          $timeout.cancel(timeout);
          $scope.gettingLink = true;
          timeout = $timeout(copyLinkToClipboard, 500);
        });

        $scope.isShowingErrors = function (form, fieldName) {
          return form && form[fieldName] && ($scope.triedToSaveTemplate || $scope.triedToDownload || form[fieldName].$dirty) && form[fieldName].$invalid;
        };

        $scope.filterUserFullName = function (value) {

          return function (item) {
            if (value && value !== '[$empty$]') {
              return $scope.getUserName(item).toLowerCase().indexOf(value.toLowerCase()) !== -1;
            }
            return true;
          };

        };

        $scope.setUserEmail = function (userName) {
          var selectedUser = $scope.usersWithEmails.find(function (item) {
            return item.firstName === userName;
          });
          $scope.downloadAgentUser.email = selectedUser.primaryEmail;
          $scope.downloadAgentUser.userName = $scope.getUserName(selectedUser);
        };

        $scope.setUserName = function (email) {
          $scope.downloadAgentUser.userName = $scope.getUserName($scope.usersWithEmails.find(function (item) {
            return item.primaryEmail === email;
          }));
        };

        $scope.setAgentDownloadType = function (type) {
          $scope.currentType = type;
        };

        $scope.restoreDefault = function (form) {
          EmailSettingsService.setToDefaultTemplate(templateKey, function (defaultTemplate) {
            $scope.emailTemplate = {
              subject: defaultTemplate.subject,
              body: defaultTemplate.body
            };
            $scope.triedToSaveTemplate = true;
            form.$setPristine();
          });
        };

        $scope.cancelEdit = function (form) {
          $scope.emailTemplate = angular.copy(savedTemplate);
          $scope.triedToSaveTemplate = true;
          form.$setPristine();
        };

        $scope.saveEmailTemplate = function (form) {
          if (form.$valid) {
            $scope.savingInProcess = true;
            $scope.triedToSaveTemplate = false;

            EmailSettingsService.saveEmailTemplate($scope.emailTemplate, templateKey, function () {
              $scope.openEmailTemplate('CLOSE');
              $scope.savingInProcess = false;
              form.$setPristine();
            })
          } else {
            $scope.triedToSaveTemplate = true;
          }
        };

        $scope.downloadAgent = function (form) {
          if (form.$valid) {
            $scope.triedToDownload = false;
            $scope.savingInProcess = true;
            DevicesService.downloadAgent($scope.downloadAgentUser.companyId, $scope.downloadAgentUser.agentName,
              $scope.downloadAgentUser.agentPassword, false, function () {
                if ($scope.hidePopover) $scope.hidePopover();
                $scope.savingInProcess = false;
                form.$setPristine();
              });
          } else {
            $scope.triedToDownload = true;
          }
        };

        $scope.sendEmailWithAgent = function (form) {
          if (form.$valid) {
            $scope.triedToDownload = false;
            $scope.savingInProcess = true;
            DevicesService.sendDownloadAgentLink($scope.downloadAgentUser, function () {
              if ($scope.hidePopover) $scope.hidePopover();
              $scope.savingInProcess = false;
              form.$setPristine();
            });
          } else {
            $scope.triedToDownload = true;
          }
        };

        function copyLinkToClipboard() {
          var agentName = $scope.downloadAgentUser.agentName;
          var agentPassword = $scope.downloadAgentUser.agentPassword;

          if (agentName && agentPassword || !agentName && !agentPassword) {
            DevicesService.getDownloadAgentLink($scope.downloadAgentUser, function (resp) {
              $scope.gettingLink = false;
              $scope.downloadLink = resp.downloadLink;
            });
          }
        }

      }]);

}());
