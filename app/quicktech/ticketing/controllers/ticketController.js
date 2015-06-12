'use strict';

/* Controllers */
(function (window, $, undefined) {
  var app = angular.module('quicktech.core.ticketing');

  app.controller('CompaniesController', ['$scope', 'CompaniesService',
    function ($scope, CompaniesService) {
      $scope.companies = CompaniesService.getAllCompanies();
      $scope.currentCompany = CompaniesService.getCurrentCompany();

      $scope.getCompanyName = function (companyId) {
        var company = CompaniesService.getOneById(companyId);

        return company.legalName != undefined ? company.legalName : '';
      }

      $scope.getCompanyOwner = function (companyId) {
        if (companyId)
          var company = CompaniesService.getOneById(companyId);
        else
          return '';
        return company.primaryUser.id != undefined ? company.primaryUser.id : '';
      }

      $scope.filterUserByCompany = function (company) {
        $scope.companyUsers = CompaniesService.getAllByCompanyId(company.id);
      }
      $scope.selectUser = function (event, user) {
        $('input#ticketCreatedBy').val(user.firstName + " " + user.lastName);
        $('input#ticketCreatedById').val(user.id);
        $(event.target).parents('div.dropdown').removeClass('open');
      }

      $scope.selectPriority = function (event, priority) {
        $('input#createTicketPriority').val(priority);
        $(event.target).parents('div.dropdown').removeClass('open');
      }
    }]);

  app.controller('UserController', ['$scope', 'UsersService',
    function ($scope, UsersService) {

      $scope.companyUsers = [];
      $scope.currentUser = UsersService.getCurrentUser();
      $scope.currentCompanyUser = [];
      $scope.getFirstName = function (userId) {
        var user = UsersService.getOneById(userId);
        if (user)
          return user.firstName != undefined ? user.firstName : '';
      }
      $scope.getlastName = function (userId) {
        var user = UsersService.getOneById(userId);
        if (user)
          return user.lastName != undefined ? user.lastName : '';
      }
      $scope.currentUser = UsersService.getCurrentUser();
      $scope.selectCompany = function (event, company) {
        $scope.companyUsers = UsersService.getAllByCompanyId(company.id);
        $('input#ticketCompany').val(company.legalName);
        $('input#ticketCompanyId').val(company.id);
        $(event.target).parents('div.dropdown').removeClass('open');
      }
      $scope.getAssignToUsers = function (company) {
        $scope.currentCompanyUser = UsersService.getAllByCompanyId(company.id);
      }
      $scope.selectAssignTo = function (event, user) {
        $('input#ticketAssignTo').val(user.firstName + ' ' + user.lastName);
        $('input#ticketAssignToId').val(user.id);
        $(event.target).parents('div.dropdown').removeClass('open');
      }
      if ($scope.currentUser && $scope.currentUser.id)
        $scope.teamMembers = UsersService.getAllByCompanyId($scope.currentUser.id);
      $scope.clientUsers = UsersService.getClientUsers();
      $scope.getAllByCompanyId = function (company) {
        return UsersService.getAllByCompanyId(company.id);
      }
      $scope.selectUsers = function (event, user) {
        if (user) {
          if ($(event.target).parents('.checkbox').find('input[type=checkbox]').is('checked')) {
            $(event.target).parents('.checkbox').find('input[type=checkbox]').prop('checked', '')
          } else {
            $(event.target).parents('.checkbox').find('input[type=checkbox]').prop('checked', 'checked')
          }
          $(event.target).parents('.addUsersDropdown').addClass('open');
        } else {
          $(event.target).parents('.addUsersDropdown').addClass('open');
        }
        event.preventDefault();
        event.stopPropagation();
      }

      $scope.showMembers = function (event, panelId) {
        $(event.target).parents('ul').find('li').removeClass('active');
        $(event.target).parents('li').addClass('active');
        $(event.target).parents('div.addUsersDropdown').find('div.tab-content').find('div.tab-pane').removeClass('active');
        $(event.target).parents('div.addUsersDropdown').find('div.' + panelId).addClass('active');
      }
    }
  ]);

  app.controller('RightPanelController', ['$scope', 'RightPanelService',
    function ($scope, RightPanelService) {
      $scope.rightPanel = RightPanelService.getActivities($scope, null, function ($activities) {
      });

      $scope.getCompanyData = function (companyId) {
        $scope.groupData = RightPanelService.getOneCompanyGroupedData(companyId);
      }
      $scope.checkCheckBox = function (event) {
        debugger;
        $('#addUsersDropdown').addClass('open');
        if ($(event.target).is('checked')) {
          $(event.target).removeAttr('checked');
        } else {
          $(event.target).attr('checked', 'checked');

        }
        event.preventDefault();
        event.stopPropagation();
      }


    }]);

  app.controller('TagController', ['$scope', 'TicketTagsService',
    function ($scope, TicketTagsService) {
      $scope.getcreateTag = function (event, tag) {
        if (tag != null && tag != undefined) {
          $('input#ticketTagName').val(tag.name);
          $('a#color' + tag.color).addClass('is-selected');
          $('input#tagColorCode').val(tag.color);
          $('input#tagId').val(tag.id);
          $('div#deleteTagIcon').show();
        } else {
          $('div#deleteTagIcon').hide();
        }
        $('div#tagCreateModel').modal('show');
      };

      $scope.selectColor = function (event, code, color) {
        debugger;
        $(event.target).parents('ul.tag-list li a').addClass('open');
        event.preventDefault();
        event.stopPropagation();
        $('input#tagColorCode').val(code);
        if (event.target.localName === 'span') {
          $(event.target).parent().addClass('is-selected');
        } else if (event.target.localName === 'a') {
          $(event.target).addClass('is-selected');
        } else {
          $(event.target).find('a').addClass('is-selected');
        }

      };

      $scope.tags = TicketTagsService.getList($scope);

      TicketTagsService.getTicketsCounts($scope, function (arg) {
        $scope.tagsCount = arg;
      });

      $scope.colorCodes = [{"code": 0}, {"code": 1}, {"code": 2}, {"code": 3}, {"code": 4}, {"code": 5}, {"code": 6}, {"code": 7}, {"code": 8}, {"code": 9}];

      $scope.deleteTag = function () {

        var tagId = $('#tagId').val();
        var tagName = $('#ticketTagName').val();
        if (!tagId) {
          return;
        }
        TicketTagsService.deleteTag(tagId, function () {
          $('div#notificationContainer div.alert-yellow').text(tagName + ' deleted successfully.');
          $('div#notificationContainer').show();
          $('div#tagCreateModel').modal('hide');
          setTimeout(function () {
            $('div#notificationContainer').hide();
          }, 3000);
        });
      };

      $scope.postCreateTag = function () {
        var tag = {
          "name": $('input#ticketTagName').val(),
          "color": $('input#tagColorCode').val()
        };

        var tagId = $('#tagId').val();

        var message = ' created successfully';

        if (tagId) {
          tag.id = tagId;
          message = ' updated successfully';
        }

        TicketTagsService.save(tag, function () {
          $('div#tagCreateModel').modal('hide');
          $('div#notificationContainer div.alert-yellow').text(tag.name + message);
          $('div#notificationContainer').show();
          setTimeout(function () {
            $('div#notificationContainer').hide();
          }, 3000);
        });

      };

      $scope.postTagAsBulk = function (event) {
        if ($('div.ticketListClass').find('input.ticketBulkSelection[type=checkbox]:checked').length > 0) {
          var ticketsNum = $('div.ticketListClass').find('input.ticketBulkSelection[type=checkbox]:checked').length;
          var tickets = $('div.tickets-list').find('input.ticketBulkSelection[type=checkbox]:checked');
          var tags = $('ul#ticketAssignTags').find('input[type=checkbox]:checked');
          var ticketArr = [];
          var tagsArr = [];
          tickets.each(function (i, ticket) {
            ticketArr[i] = {};
            ticketArr[i].id = ticket.value;
          });
          tags.each(function (i, tag) {
            tagsArr[i] = {};
            tagsArr[i].id = tag.value;
          });
          var postData = {};
          for (var c = 0; c < ticketArr.length; c++) {
            postData[ticketArr[c].id] = [];
            for (var j = 0; j < tagsArr.length; j++) {


              postData[ticketArr[c].id][j] = tagsArr[j].id;
            }
          }

          TicketTagsService.link(postData, function () {
            $('div#labelAs').modal('hide');
            $('div#notificationContainer div.alert-yellow').text(ticketsNum + 'has been updated successfully.');
            $('div#notificationContainer').show();
            setTimeout(function () {
              $('div#notificationContainer').hide();
            }, 3000);
          });
        }
      };

      $scope.checkIntermediate = function (tag) {
        var tickets = $('div.tickets-list').find('input.ticketBulkSelection[type=checkbox]:checked');
        var classVal = '  ';
        tickets.each(function (i, ticket) {
          if (classVal === 'selected' && ticket.value != tag.id) {

          }
        });
        return ' intermediate ';
      }

    }]);

  app.controller('FilesController', ['$scope', 'FilesService',
    function ($scope, FilesService) {
      $scope.unlinkFile = function (event, elemId) {
        var fileId = $('input#' + elemId + '_val').val();
        FilesService.remove(fileId, function () {
          $('li#' + elemId + '_li').remove();
        })
      }
      $scope.selectFile = function (event, fieldId) {
        $('#' + fieldId).trigger('click');
        var chooseFile = document.getElementById(fieldId);
        chooseFile.addEventListener('change', function (e) {
          var self = e.currentTarget, file = self.files[0];
          if (file.name === $scope.oldFile) {
            return;
          }
          var id = Math.floor(Math.random() * (9999999 - 999 + 1) + 999);
          $scope.oldFile = file.name;
          var size = parseInt(file.size / 1024);
          var template = '<li id="' + id + '_li" ng-controller="FilesController">';
          template += '<input id="' + id + '_val" type="hidden" name="attachmentId" />';
          template += '<span class="filename">' + file.name + '</span>';
          template += '<span class="filesize">' + size + ' KB</span>';
          template += '<a href="javascript:{}" ng-click="unlinkFile($event, ' + id + ')" class="icn-remove-attachment pull-right"></a>';
          template += '<div class="progress progress-attachment pull-right">';
          template += '<div id="' + id + '_element" class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">';
          template += '<span class="sr-only" id="' + id + '_percentage">0% Complete</span>';
          template += '</div>';
          template += '</div>';
          template += '</li>';
          $(self).next('ul.note-attachments').append(template);
          FilesService.create(file,
            function (arg) {
              var uploadedPercentage = (arg.loaded / arg.total) * 100;
              $('#' + id + '_element').attr('aria-valuenow', uploadedPercentage);
              $('#' + id + '_element').attr('style', 'width:' + uploadedPercentage + '%;');
              $('#' + id + '_percentage').text(parseInt(uploadedPercentage) + ' Complete');
              //OnProgress
            }, function (arg) {
              $('input#' + id + '_val').val(arg.id);
              //OnFinish
            }, function (arg) {
              $('li#' + id + '_li').remove();
              //OnError
            }
          );
        }, false);
      }
    }]);


})(window, jQuery);
