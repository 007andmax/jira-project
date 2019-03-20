'use strict';

(function () {

  angular.module('quicktech.core.tickets').directive('assignUser',
    [
      '$rootScope', '$compile', function ($rootScope, $compile) {
      return {
        restrict: 'A',
        link: function ($scope, element, attrs) {


          var users = $rootScope.usersToNotify || $scope.usersCurrentCompany;
          var getUserAvatarUrl = $rootScope.getUserAvatarUrl;

          var inputElement = element.find('input');
          var parentMenu = element.parents('ul.dropdown-menu');
          var actionElement = inputElement.parents('.form-group').find('div.label-add-btn > div');
          var mainDropdown = element.parents('div.dropdown');

          // var



          $scope.usersToAssign = [];


          $scope.$watch(function() {
            return $rootScope.ticketSharedList;
          }, function(val) {

            $scope.usersToAssign = val;
            var ids = $scope.usersToAssign.map(function(el) {
              return el.user.id;
            })

            var idArray = [];


            var links = element.find('a').map(function(el, i) {

              var index = ids.indexOf(this.id);

              if (~index) {

                this.parentNode.classList.add('active');
              } else {
                this.parentNode.classList.remove('active');
              }

            })

          })

          var refreshAssignTicket = function () {

            if (typeof(inputElement.data('bs.tokenfield')) != 'undefined') {
              inputElement.tokenfield('setTokens', []);
              inputElement.trigger('tokenfield:removedtoken');
            }
            inputElement.val('').autocomplete('onValueChange', true);

            inputElement.trigger('focus');
          };

          inputElement.parents('[dropdown]').on('shown.bs.dropdown', function () {
            refreshAssignTicket();
          });

          inputElement.parents('[dropdown]').on('hide.bs.dropdown', function () {
            parentMenu.find('li .dropdown-submenu-wrapper').removeClass('open');
          });

          $scope.autoComplete = function() {
            var items = 0;
            inputElement.autocomplete({
              appendTo: element.find('div.scroll-pane'),
              lookup: function (query, done) {
                if (query.indexOf('@') !== -1) {
                  query = '';
                }
                var data = {suggestions: []};
                var queryLowerCase = query.toLowerCase();
                for (var userIndex in users) {
                  if ($scope.filterAssignUser(users[userIndex])) {
                    var name = getUserName(users[userIndex]);

                    if (name.toLowerCase().indexOf(queryLowerCase) !== -1) {
                      data.suggestions.push({value: name, data: users[userIndex]})
                    }
                  }
                }
                done(data);

              },
              minChars: 0,
              maxHeight: 204,
              // maxWidth:          600,
              // minWidth:          100,
              // width:             maxProductWidth+40,
              forceFixPosition: false,
              useCustomScroller: false,
              //listMarginTop:      6,
              listPaddingTop: 10,
              listPaddingBottom: 10,
              //onSelect:           function(selection){},
              showNoSuggestionNotice: true,
              noSuggestionNotice: 'No results found',
              showNoDataNotice: true,
              noDataNotice: 'No results found',

              formatItem: function (result, suggestion) {
                var className = items % 2 === 0 ? 'avatar-background-color-even' : 'avatar-background-color-odd';
                var avatarUrl = getUserAvatarUrl(suggestion.data);
                var isAvatar = '<img src="' + avatarUrl + '" alt="..." class="img-circle avatar-26">';
                var noAvatar = [
                  '<div class="default-user-avatar ' + className +  '">',
                    '<span>' + suggestion.data.firstName[0].toUpperCase() + '</span>',
                    '<span>' + (suggestion.data.lastName.length > 1 ?  suggestion.data.lastName[0].toUpperCase() : '') + '</span>',
                  '</div>'
                ].join('');

                items++;

                noAvatar = $compile(angular.element(noAvatar))($scope)[0].outerHTML;

                var avatar = suggestion.data.avatar ? isAvatar : noAvatar;
                var image = new Image();
                var index = $scope.usersToAssign && $scope.usersToAssign.findIndex(function(el) {
                  var el = el.user ? el.user : el;

                  return el.id === suggestion.data.id
                });
                image.src = avatarUrl;
                return '<a href="javascript:void(0)" id="' + suggestion.data.id + '" class="dropdown-link"> \
                          ' + avatar + ' \
                          <span>\
                            <p>' + result + '</p> \
                            <p>' + suggestion.data.primaryEmail + '</p> \
                          </span>\
                        </a>';
              },
              calculateWidth: function (result, suggestion) {
                var avatarUrl = getUserAvatarUrl(suggestion.data);
                var width = $.Autocomplete.getHtmlWidth('<a href="#"><img src="' + avatarUrl + '" alt="..." class="img-circle avatar-26"><span>' + result + ' "' + suggestion.data.primaryEmail + '"</span></a>');
                return width + 65;
              },
              preserveLastSelected: true,
              //lastSelected:       selectedProduct?selectedProduct.name:'',
              alwaysShow: true,

              classes: {
                containerClass: 'users-list custom-scroll',
                suggestion: 'user-item',
                selected: 'hovered',
                lastSelected: 'active'
              },
              onSelect: function (selection) {

                if (typeof(inputElement.data('bs.tokenfield')) != 'undefined') {
                  inputElement.off('tokenfield:removedtoken');
                  inputElement.tokenfield('destroy');
                }

                var user = selection.data;

                inputElement.on('tokenfield:removedtoken', function (e) {
                  inputElement.off('tokenfield:removedtoken');
                  inputElement.tokenfield('destroy');
                  // inputElement.autocomplete('setOptions', {lastSelected: ''}).autocomplete('onValueChange');
                  inputElement.autocomplete('resetSelection');
                  actionElement.addClass('disabled').attr('disabled', 1);
                  inputElement.focus();


                  // $rootScope.$broadcast('userToAssignToTicket', {data: null})
                });



                inputElement.val('');
                inputElement.val('').autocomplete('onValueChange', true);

                actionElement.removeClass('disabled').removeAttr('disabled');

                inputElement.data('autocomplete').container.focus();
                $scope.setUserToAssign(selection.data);

                $rootScope.$broadcast('userToAssignToTicket', {data: selection.data})

                if (!$scope.createTicket) {
                  setTimeout(function () {
                    mainDropdown.removeClass('open');
                  }, 500)
                }

              },
              onDoubleEnter: function () {
                // Idea: use the callback return value to decide if the execution should continue or not
                actionElement.click();
              }
            });

            // $scope.$apply();

            actionElement.click(function () {
              $scope.assignUserToTicket();
              $('body').click();
            });

            inputElement.parents('.dropdown-submenu-wrapper').click(function (e) {
              e.stopPropagation()
            });

            inputElement.data('autocomplete').container.on('keyup', function (e) {
              if (e.keyCode == 8) {
                if (typeof(inputElement.data('bs.tokenfield')) != 'undefined') {
                  inputElement.tokenfield('setTokens', []);
                  inputElement.trigger('tokenfield:removedtoken');
                }
              }
              return false;
            });

            inputElement.val('d');
            inputElement.val('');

            parentMenu.find('li > a').on('mouseenter', function (e) {
              if (!$(this).parents('li').find('.dropdown-submenu-wrapper').hasClass('open')) {
                parentMenu.find('li .dropdown-submenu-wrapper').removeClass('open');
                $(this).parents('li').find('.dropdown-submenu-wrapper').addClass('open');

                if ($(this).parents('li').find('.assign-ticket-content').length) {
                  refreshAssignTicket();
                }
              }
            });

            parentMenu.find('li > a').on('mouseleave', function (e) {
              var closest = $(e.target).closest('.dropdown-submenu-wrapper');
              if (!closest || !closest.length) {
                parentMenu.find('li .dropdown-submenu-wrapper').removeClass('open');
              }
            });

            function getUserName(user) {
              return user.firstName + ' ' + user.lastName;
            }

            refreshAssignTicket();
          }

          $scope.autoComplete();


          $scope.$watch('usersCurrentCompany.length', function() {
            users = $rootScope.usersToNotify || $scope.usersCurrentCompany;

            $scope.autoComplete();
          })
        }
      }
    }
    ])
})();
