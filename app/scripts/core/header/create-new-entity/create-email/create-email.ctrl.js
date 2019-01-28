'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.createEmailCtrl',
    ['$scope', 'ProductsService', 'CompaniesService', '$rootScope', 'quicktech.common.services.PermissionsService',
      'TaxesService', '$timeout', 'FilesService', '$uibModalInstance', 'UsersService',
    function ($scope, ProductsService, CompaniesService, $rootScope, PermissionsService, TaxesService, $timeout, FilesService, $uibModalInstance, UsersService) {

      console.log('create email template', $scope.selectedUsers)

      $scope.emails = [];
      $scope.close = $uibModalInstance.dismiss;
      $scope.selectedCompany = $scope.$parent.reportSetting.company;
      $scope.removeEmail = function(index) {
        $scope.emails.splice(index, 1);
      };

      var uploadingAttachmentsCount = 0;

      $scope.attachments = [];

      const getCompanyAndTechUsers = (users) =>
        users.filter((user) => (user.accountType ==='TECH' || user.company.id ===  $scope.selectedCompany.id));
      $scope.users = $scope.selectedCompany ? getCompanyAndTechUsers(UsersService.getAllUsers()) : UsersService.getAllUsers();

      $scope.users = getCompanyAndTechUsers($scope.users);

      function keypressHandle(evt) {
        if (evt.keyCode === 13) {
          $scope.addEmail($scope.newEmail);
          $scope.newEmail = null;

          $scope.$digest();
        }
      }

      $scope.tab = 'plain';

      $scope.setTab = function(tab) {
        $scope.tab = tab;
      }



      window.addEventListener('keyup', keypressHandle);

      $scope.$on('destroy', function() {
        window.removeEventListener('keyup', keypressHandle);
      });

      $scope.setFocus = function (event) {
        $scope.focusInput = !$scope.focusInput;
        $scope.dropdownOpened = true;
        event.stopPropagation();
      };

      $scope.addEmail = function(email) {

        $scope.newEmail = '';
        if (email && !~$scope.emails.indexOf(email)) {
          $scope.emails.push(email);
        }

      }

      $scope.setDropdownOpened = function (isOpen, keyboard) {
        $scope.dropdownOpened = isOpen;

        if (keyboard) {
          setTimeout(function() {
            $scope.clickImitation();

          })
        }

      };

      $scope.setInputFocus = function(isFocused) {
        $scope.isEmailInputFocused = isFocused;
      }

      $scope.clickImitation = function() {
        var wrapper = document.getElementById('tags-wrapper');
        var elem = document.getElementById('email-input');

        if (!wrapper.classList.contains('open')) {
          elem.click();
        }

      }

      $scope.addWrittenEmail = function() {
        if ($scope.newEmail) {
          $scope.emails.push($scope.newEmail);
        }
      }

      $scope.sendEmail = function() {
        var plainText = document.getElementById('editors') && document.getElementById('editors').getAttribute('te-initial-value');

        $scope.addWrittenEmail();


        if ($scope.isReportEmail) {
          $scope.$parent.$ctrl.sendToMail({
            emails: $scope.emails,
            note: plainText
          }, $scope.close);
          console.log('im heree')
          return;
        }


        var content = plainText || $scope.plainHTML.replace(/(\r\n|\n|\r)/gm,"");
        var isCustomHTML = ($scope.tab === 'html' ? true : false);



        var data = {
          recipients: $scope.emails,
          attachments: $scope.attachments.map(function(el) { return el.id }),
          content: content,
          subject: $scope.subject,
          customHtml: isCustomHTML
        };


        CompaniesService.sendEmail(data, function() {
          $scope.close();
        });
      };



      $scope.removeAttachment = function (index, isErrorFile) {
        if (isErrorFile) {

          $scope.fileInfo.quantityErrorFiles--;
        }

        $scope.attachments.splice(index, 1);
      };

      $scope.addAttachmentFiles = function (file) {
        $scope.attachments.push(file);
        $scope.disabledWhenLoadAttachment = true;

        uploadingAttachmentsCount++;
        if (file.size < 4194304) {
          file.xhr = FilesService.create(file,
            function (progress) {
              file.progress = 100 * (progress.loaded / progress.total);
              $scope.$apply();
            },
            function (finish) {

              if (finish.code === 400 || finish.code === 500) {

                var message = finish.code === 500 ? 'Maximum upload size of 4 MB' : finish.message;

                $scope.fileInfo[file.name] = {
                  error: true,
                  message: message,
                  code: finish.code
                };

                $scope.fileInfo.quantityErrorFiles++;
              }

              if (--uploadingAttachmentsCount === 0) {
                $scope.disabledWhenLoadAttachment = false;
              }

              file.xhr = null;
              file.id = finish.id;
              $scope.$apply();
            }, function (error) {
            });
        } else {
          $scope.fileLoadOrError = true;

          $scope.fileInfo[file.name] = {
            error: true,
            message: 'File must be less then 4 MB'
          };

          $scope.fileInfo.quantityErrorFiles++;
        }

        $scope.$apply();


      };

      if ($scope.selectedUsers) {
        $scope.allUsersEmails = $scope.usersCtrl.shownUsers.map(function(el) {
          return el.primaryEmail;
        })
        $scope.selectedUsersCopy = Object.assign({}, $scope.selectedUsers);
        delete $scope.selectedUsersCopy.all;

        $scope.emails = $scope.usersCtrl.shownUsers.reduce(function(acc, el) {
          if ($scope.selectedUsersCopy[el.id]) {
            acc.push(el.primaryEmail);
          }

          return acc;
        }, [])

      } else if ($scope.selectedCompanies) {

        $scope.allUsersEmails = $scope.companiesCtrl.shownCompanies.map(function(el) {

          return el.companyInfo.contacts[0].primaryEmail;
        })

        $scope.selectedCompaniesCopy = Object.assign({}, $scope.selectedCompanies);
        delete $scope.selectedCompaniesCopy.all;

        $scope.emails = $scope.companiesCtrl.shownCompanies.reduce(function(acc, el) {
          if ($scope.selectedCompaniesCopy[el.id]) {
            acc.push(el.companyInfo.contacts[0].primaryEmail);
          }

          return acc;
        }, [])

      }

      if ($scope.allUsersEmails) {
        $scope.filteredUsersEmails = $scope.allUsersEmails.filter(function(el) {
          return el;
        });

        $scope.$watch('newEmail', function(val) {
          if (val === undefined) return;
          $scope.filteredUsersEmails = $scope.allUsersEmails.filter(function(el) {
            return el && el.includes(val);
          })
        })
      } else {
        $scope.isReportEmail = true;
        $scope.filteredUsersEmails = $scope.$parent.$ctrl.tempUsers.concat($scope.users)
          .map(function(el) {
            return el.primaryEmail;
          })
          .filter(function(el) {
            return el;
          })

        $scope.$watch('newEmail', function(val) {
          if (val === undefined) return;
          $scope.filteredUsersEmails = $scope.$parent.$ctrl.tempUsers.concat($scope.users)
            .map(function(el) {
              return el.primaryEmail;
            })
            .filter(function(el) {
              return el && el.includes(val);
            })
        })
        console.log($scope.$parent.$ctrl, 'CTRL')
      }


    }]);

}());
