'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.smtpCtrl',
    ['$scope', 'CompaniesService', '$timeout',
      function ($scope, CompaniesService, $timeout) {
        var promise,
          savedSMTPSettings,
          initialized = false,
          portIsEmpty = false,
          portToTypes = {
            'NONE': 25,
            'TLS': 587,
            'SSL': 465
          },
          preinitializedDomains = {
            GMAIL: {
              domain: 'smtp.gmail.com'
            },
            YAHOO: {
              domain: 'smtp.mail.yahoo.com'
            },
            OUTLOOK: {
              domain: 'smtp-mail.outlook.com',
              port: 587,
              encryptionType: 'TLS'
            }
          };

        $scope.domainPattern = /^((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
        $scope.smtp = {};
        $scope.smtpHintMessage = 'You can use your custom SMTP server for sending email notifications.\n' +
          'Please, acknowledge, if you set invalid settings the system will use the Mandrill.\n' +
          'Also, if the message does not send through the custom server,\nit will be sent through the Mandrill.\n' +
          'If you use a third-party SMTP servers (like GMail, Outlook etc) make sure\n' +
          'that you have granted access for unverified applications in your account settings.';

        CompaniesService.getCompanySMTPSettings(function (resp) {
          $scope.smtp = resp;
          savedSMTPSettings = angular.copy(resp);
          portIsEmpty = !resp.port;
        });

        $scope.$watch('smtp.encryptionType', function (value) {
          if (value) {
            if (initialized || portIsEmpty) {
              var port = portToTypes[value];
              if (port) {
                $scope.smtp.port = port;
              }
            } else {
              initialized = true;
            }
          }
        });

        $scope.checkSMTPLoginUnique = function (model) {
          $scope.checkLoginUniqueInProgress = true;
          CompaniesService.checkSMTPLoginUnique(model.$viewValue, function (resp) {
            $scope.smtpForm.login.$setValidity('unique', !!resp);
            $scope.checkLoginUniqueInProgress = false;
          })
        };

        $scope.setDomain = function (value, form) {
          var domain = preinitializedDomains[value],
            port = portToTypes[$scope.smtp.encryptionType];

          if (domain) {
            for (var prop in domain) {
              $scope.smtp[prop] = domain[prop];
            }
          }

          if (port && !domain.port) {
            $scope.smtp.port = port;
          }

          $scope.saveSMTP(form);
        };

        $scope.saveSMTP = function (form, isTest) {
          if (form.$valid && (isTest || !angular.equals($scope.smtp, savedSMTPSettings)) && $scope.smtp.useSMTP) {
            if (promise) {
              $timeout.cancel(promise);
            }
            $scope.testingConnection = true;

            promise = $timeout(function () {
              CompaniesService.saveForCompanyProfile($scope.smtp, 'SMTPSettings', function (resp, oldSettings) {
                if (angular.equals($scope.smtp, oldSettings)) {
                  $scope.smtp.isValid = resp.valid;
                  $scope.smtp.exeption = resp.code >= 400;
                  $scope.smtp.errorMessage = resp.errorMessage;
                  savedSMTPSettings = angular.copy($scope.smtp);
                }
                $scope.testingConnection = false;
                if (resp.code < 400) {
                  form.$setPristine();
                }
                promise = undefined;
              });
            }, 500);
          } else if (!$scope.smtp.useSMTP) {
            CompaniesService.saveForCompanyProfile($scope.smtp, 'SMTPSettings');
          }
        };

      }]);

}());
