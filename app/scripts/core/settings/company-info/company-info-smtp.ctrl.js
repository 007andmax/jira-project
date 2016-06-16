'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.smtpCtrl',
    ['$scope', 'CompaniesService', '$timeout',
      function ($scope, CompaniesService, $timeout) {
        var promise;

        $scope.domainPattern = /^((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
        $scope.smtp = {};
        $scope.smtpHintMessage = 'You can use your custom SMTP server for sending email notifications.\n' +
          'Please, acknowledge, if you set invalid settings the system will use the Mandrill.\n' +
          'Also, if the message does not send through the custom server,\nit will be sent through the Mandrill.\n' +
          'If you use a third-party SMTP servers (like GMail, Outlook etc) make sure\n' +
          'that you have granted access for unverified applications in your account settings.';

        CompaniesService.getCompanySMTPSettings(function (resp) {
          $scope.smtp = resp;
        });

        $scope.checkSMTPLoginUnique = function (model) {
          $scope.checkLoginUniqueInProgress = true;
          CompaniesService.checkSMTPLoginUnique(model.$viewValue, function (resp) {
            $scope.smtpForm.login.$setValidity('unique', !!resp);
            $scope.checkLoginUniqueInProgress = false;
          })
        };

        $scope.saveSMTP = function (form) {
          if (form.$valid && $scope.smtp.useSMTP) {
            if (promise) {
              $timeout.cancel(promise);
            }
            $scope.testingConnection = true;

            promise = $timeout(function () {
              CompaniesService.saveForCompanyProfile($scope.smtp, 'SMTPSettings', function (resp) {
                $scope.smtp.isValid = resp.valid;
                $scope.smtp.exeption = resp.code >= 400;
                $scope.smtp.errorMessage = resp.errorMessage;
                $scope.testingConnection = false;
                if (resp.code < 400) {
                  form.$setPristine();
                }
              });
            }, 300);
          } else if (!$scope.smtp.useSMTP) {
            CompaniesService.saveForCompanyProfile($scope.smtp, 'SMTPSettings');
          }
        };

      }]);

}());
