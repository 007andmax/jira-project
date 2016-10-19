'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.emailCtrl',
    ['$scope', 'CompaniesService', '$timeout', 'ConstantsService',
      function ($scope, CompaniesService, $timeout, ConstantsService) {
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

        $scope.emailVia = [{
          value: true,
          label: 'your own SMTP server'
        }, {
          value: false,
          label: 'Quicktech mail server'
        }];

        $scope.currentHost = ConstantsService.getConstant('mandrill.domain.suffix');
        $scope.domainPattern = /^(((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?))|((?:[0-9]{1,3}\.){3}[0-9]{1,3})$/;
        $scope.smtp = {};
        $scope.smtpHintMessage = 'This section allows you to choose server for sending email notifications.\n' +
          'Please, acknowledge, if you set invalid settings the system will use Mandrill.\n' +
          'Also, if the message does not send through the custom server,\nit will be sent through Mandrill.\n' +
          'If you use a third-party SMTP servers (like GMail, Outlook etc) make sure\n' +
          'that you have granted access for unverified applications in your account settings.';

        CompaniesService.getCompanySMTPSettings(function (resp) {
          $scope.smtp = resp.smtpSettings;
          $scope.supportMailBox = resp.supportMailBox;
          $scope.smtp.testEmail = resp.login;
          savedSMTPSettings = angular.copy(resp);
          portIsEmpty = !resp.port;
          $scope.usedEmailVia = $scope.smtp.useSMTP ? $scope.emailVia[0] : $scope.emailVia[1];
        });

        CompaniesService.getEmailAlias(function (resp) {
          $scope.emailAlias = resp.emailAlias;
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

        $scope.changeEmailVia = function (form) {
          $scope.smtp.useSMTP = $scope.usedEmailVia.value;
          $scope.saveSMTP(form);
        };

        $scope.setDomain = function (value, form) {
          if (!$scope.disableFields) {
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

            $timeout(function () {
              $scope.saveSMTP(form);
            });
          }
        };

        $scope.sendTestEmail = function (formForSave, formForTest, isTest, hideFunc) {
          $scope.showError = formForTest.$invalid;
          if (formForTest.$valid) {
            hideFunc();
            $scope.saveSMTP(formForSave, isTest);
          }
        };

        $scope.saveSMTP = function (form, isTest) {
          if (form.$valid && (isTest || !angular.equals($scope.smtp, savedSMTPSettings)) && $scope.smtp.useSMTP) {
            if (promise) {
              $timeout.cancel(promise);
            }
            $scope.testingConnection = true;
            $scope.smtp.exeption = false;
            $scope.disableFields = !!isTest;

            promise = $timeout(function () {
              $scope.smtp.sendTestEmail = !!isTest;
              CompaniesService.saveForCompanyProfile($scope.smtp, 'SMTPSettings', function (resp, oldSettings) {
                if (angular.equals($scope.smtp, oldSettings)) {
                  $scope.smtp.isValid = resp.valid;
                  $scope.smtp.exeption = resp.code >= 400;
                  $scope.smtp.errorMessage = resp.validationResults ? resp.validationResults.SMTPSettings : resp.errorMessage;
                  savedSMTPSettings = angular.copy($scope.smtp);
                  $scope.smtp.testEmail = savedSMTPSettings.login;
                }
                $scope.testingConnection = false;
                $scope.disableFields = false;
                if (resp.code < 400) {
                  form.$setPristine();
                } else {
                  form.$setDirty();
                  for (var prop in form) {
                    var field = form[prop];

                    if (field && field.$dirty !== undefined) {
                      field.$setDirty();
                    }
                  }
                }
                promise = undefined;
              });
            }, 500);
          } else if (!$scope.smtp.useSMTP) {
            CompaniesService.saveForCompanyProfile($scope.smtp, 'SMTPSettings');
          }
        };

        $scope.saveEmailAlias = function (emailAlias, formField) {
          if (formField.$valid) {
            CompaniesService.saveEmailAlias(emailAlias);
          }
        };

      }]);

}());
