'use strict';

(function () {

  angular.module('quicktech').directive('feedbackForm',
    ['$document', '$state', '$http', '$timeout', 'FilesService', 'quicktech.common.services.SharedStateService',
      function ($document, $state, $http, $timeout, FilesService, SharedStateService) {
        return {
          restrict: 'A',
          templateUrl: '/ng1/scripts/common/directives/feedback-form/feedback-form.tpl.html',
          link: function (scope, element) {
            element.addClass('feed-back-btn');

            element.on('click', function (e) {
              if (e.target === element[0]) {
                element.toggleClass('close');
                scope.formShown = !scope.formShown;
                init(scope, scope.feedbackForm);
                scope.$apply();
              }
            });

            $document.on('click', closeIfClickOutside);
            $document.on('keydown', closeIfEscape);

            scope.$on('$destroy', function () {
              $document.off('click', closeIfClickOutside);
              $document.off('keydown', closeIfEscape);
            });

            function closeIfEscape(e) {
              if ((e.which === 27 || e.keyCode === 27) && scope.formShown) {
                closeForm(scope, element);
              }
            }

            function closeIfClickOutside(e) {
              var isInside = angular.element(e.target).closest(element);

              if (scope.formShown && !isInside.length) {
                closeForm(scope, element);
              }
            }
          },
          controller: function ($scope) {
            var deleteErrorFile, maxAttachments;
            $scope.types = {
              BUG: 'Bug',
              FEATURE: 'Feature',
              USABILITY: 'Usability Problem',
              PERFORMANCE: 'Performance',
              COSMETICS: 'Cosmetics',
              OTHER: 'Other'
            };
            $scope.priorities = {
              LOW: 'Low',
              MEDIUM: 'Medium',
              HIGH: 'High'
            };

            $scope.isShowingErrors = function (form, fieldName) {
              return form && form[fieldName] && ($scope.triedToSave || form[fieldName].$dirty) && form[fieldName].$invalid;
            };

            $scope.addAttachmentFiles = function (file) {
              $timeout(function () {
                if ($scope.feedbackDto.attachments.length > 2) {
                  $scope.erorrFileMessage = 'Max 3 attachments';
                  if (maxAttachments) {
                    $timeout.cancel(maxAttachments);
                  }
                  maxAttachments = $timeout(function () {
                    $scope.erorrFileMessage = '';
                  }, 3000);
                  return;
                }

                $scope.feedbackDto.attachments.push(file);
                if (file.size < 4194304) {

                  FilesService.create(file,
                    function (progress) {
                      $scope.fileLoadOrError = true;
                      file.progress = 100 * (progress.loaded / progress.total);
                      $scope.$apply();
                    }, function (finish) {

                      $scope.fileLoadOrError = false;

                      if (finish.code === 400 || finish.code === 500) {
                        onFileError(finish.message.split(';')[0], file);
                      } else {
                        $timeout(function () {
                          file.shown = true;
                        });
                      }

                      file.id = finish.id;
                      $scope.$apply();
                    }, function (error) {
                      console.error(error);
                    });
                } else {
                  onFileError('Too large file (max 4 mb)', file);
                }
              });
            };

            $scope.removeAttachment = function (index) {
              $scope.feedbackDto.attachments.splice(index, 1);
            };

            $scope.submit = function (form) {
              if (form.$valid) {
                var feedbackDto = angular.copy($scope.feedbackDto);
                $scope.triedToSave = false;
                if ($scope.erorrFileMessage) {
                  $scope.erorrFileMessage = '';
                  $timeout.cancel(deleteErrorFile);
                }

                if (feedbackDto.attachments.length) {
                  feedbackDto.attachments = feedbackDto.attachments.filter(function (file) {
                    return !file.error;
                  }).map(function (file) {
                    return file.id;
                  })
                }

                $http.post('/feedback', feedbackDto).then(function () {
                  $scope.submitSuccsesfull = true;
                  $timeout(function () {
                    closeForm($scope);
                  }, 3000)
                })
              } else {
                $scope.triedToSave = true;
              }
            };

            $scope.saveForm = function (form) {
              $scope.feedbackForm = form;
            };

            function onFileError(message, file) {
              var attachments = $scope.feedbackDto.attachments;

              $scope.fileLoadOrError = true;
              $scope.erorrFileMessage = message;

              file.error = true;
              if (deleteErrorFile) {
                $timeout.cancel(deleteErrorFile);
                var indexOfError = attachments.indexOf(file);
                if (indexOfError > -1) {
                  attachments.splice(indexOfError, 1);
                }
              }

              deleteErrorFile = $timeout(function () {
                $scope.erorrFileMessage = '';
                var indexOfError = attachments.indexOf(file);
                if (indexOfError > -1) {
                  attachments.splice(indexOfError, 1);
                }
              }, 3000);
            }
          }
        };

        function init($scope) {
          $scope.submitSuccsesfull = false;
          $scope.triedToSave = false;
          if ($scope.feedbackForm) {
            $scope.feedbackForm.$setPristine();
          }
          $scope.erorrFileMessage = '';
          $scope.feedbackDto = {
            type: 'FEATURE',
            priority: 'MEDIUM',
            subject: '',
            message: '',
            page: getProblematicPage(),
            os: getOSName(),
            browserName: getBrowserVersion(),
            attachments: []
          };
        }

        function closeForm(scope, element) {
          if (element) {
            element.removeClass('close');
          } else {
            $document.find('.feed-back-btn').removeClass('close');
          }
          scope.formShown = false;
          scope.$apply();
        }

        function getProblematicPage() {
          if ($state.includes("tickets")) {
            return 'Tickets';
          } else if ($state.includes("users")) {
            return 'Users';
          } else if ($state.includes("companies")) {
            return 'Companies';
          } else if ($state.includes("companyProfile")) {
            return 'Company Profile';
          } else if ($state.includes("products")) {
            return 'Products';
          } else if ($state.includes("services")) {
            return 'Services';
          } else if ($state.includes("accounting.billable") || $state.includes("new-billable")) {
            return 'Billable';
          } else if ($state.includes("receivable")) {
            return 'Receivable';
          } else if ($state.includes("receipt-archive")) {
            return 'Receipt Archive';
          } else if ($state.includes("settings")) {
            if ($state.is("settings")) {
              return 'Account Settings';
            } else {
              return $state.current.name.split('.').pop()
                .replace(/([A-Z])/g, ' $1')
                .replace(/\b\w/g, function (letter) {
                  return letter.toUpperCase();
                });
            }
          } else if ($state.includes("quickSupport")) {
            return 'Quick Support';
          }
        }

        function getOSName() {
          var OSName = '';

          if (navigator.appVersion.indexOf('Windows') != -1) {
            OSName = 'Windows';
          }
          if (navigator.appVersion.indexOf('Windows NT 10') != -1) {
            OSName = 'Windows 10';
          }
          if (navigator.appVersion.indexOf('Windows NT 6.3') != -1) {
            OSName = 'Windows 8.1';
          }
          if (navigator.appVersion.indexOf('Windows NT 6.2') != -1) {
            OSName = 'Windows 8';
          }
          if (navigator.appVersion.indexOf('Windows NT 6.1') != -1) {
            OSName = 'Windows 7';
          }
          if (navigator.appVersion.indexOf('Windows NT 6.0') != -1) {
            OSName = 'Windows Vista';
          }
          if (navigator.appVersion.indexOf('Windows NT 5.1') != -1) {
            OSName = 'Windows XP';
          }
          if (navigator.appVersion.indexOf('Windows NT 5.0') != -1) {
            OSName = 'Windows 2000';
          }
          if (navigator.appVersion.indexOf('Mac') != -1) {
            OSName = 'Mac/iOS';
          }
          if (navigator.appVersion.indexOf('X11') != -1) {
            OSName = 'UNIX';
          }
          if (navigator.appVersion.indexOf('Linux') != -1) {
            OSName = 'Linux';
          }

          return OSName;
        }

        function getBrowserVersion() {
          var nAgt = navigator.userAgent;
          var browserName = navigator.appName;
          var fullVersion = '' + parseFloat(navigator.appVersion);
          var nameOffset, verOffset, ix;

          // In Opera 15+, the true version is after 'OPR/'
          if ((verOffset = nAgt.indexOf('OPR/')) != -1) {
            browserName = 'Opera';
            fullVersion = nAgt.substring(verOffset + 4);
          }
          // In older Opera, the true version is after 'Opera' or after 'Version'
          else if ((verOffset = nAgt.indexOf('Opera')) != -1) {
            browserName = 'Opera';
            fullVersion = nAgt.substring(verOffset + 6);
            if ((verOffset = nAgt.indexOf('Version')) != -1) {
              fullVersion = nAgt.substring(verOffset + 8);
            }
          }
          // In MSIE, the true version is after 'MSIE' in userAgent
          else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
            browserName = 'Microsoft Internet Explorer';
            fullVersion = nAgt.substring(verOffset + 5);
          }
          // In Chrome, the true version is after 'Chrome'
          else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
            browserName = 'Chrome';
            fullVersion = nAgt.substring(verOffset + 7);
          }
          // In Safari, the true version is after 'Safari' or after 'Version'
          else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
            browserName = 'Safari';
            fullVersion = nAgt.substring(verOffset + 7);
            if ((verOffset = nAgt.indexOf('Version')) != -1) {
              fullVersion = nAgt.substring(verOffset + 8);
            }
          }
          // In Firefox, the true version is after 'Firefox'
          else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
            browserName = 'Firefox';
            fullVersion = nAgt.substring(verOffset + 8);
          }
          // In most other browsers, 'name/version' is at the end of userAgent
          else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
            (verOffset = nAgt.lastIndexOf('/'))) {
            browserName = nAgt.substring(nameOffset, verOffset);
            fullVersion = nAgt.substring(verOffset + 1);
            if (browserName.toLowerCase() == browserName.toUpperCase()) {
              browserName = navigator.appName;
            }
          }
          // trim the fullVersion string at semicolon/space if present
          if ((ix = fullVersion.indexOf(';')) != -1) {
            fullVersion = fullVersion.substring(0, ix);
          }
          if ((ix = fullVersion.indexOf(' ')) != -1) {
            fullVersion = fullVersion.substring(0, ix);
          }

          return browserName + ' ' + fullVersion;
        }
      }]);
})();
