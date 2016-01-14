'use strict';

(function () {

  angular.module('quicktech.core.tickets').directive('assignUser',
  	[function () {
    	return {
       	restrict: 'A',
        link: function ($scope, element, attrs) {

						var users = $scope.usersCurrentCompany;

            var inputElement = element.find('input');
            var parentMenu = element.parents('ul.dropdown-menu');
            var actionElement = inputElement.parents('.form-group').find('div.label-add-btn > div');

            var refreshAssignTicket = function() {

                if( typeof( inputElement.data('bs.tokenfield')) != 'undefined' ) {
                    inputElement.tokenfield('setTokens', []);
                    inputElement.trigger('tokenfield:removedtoken');
                } else {
                    inputElement.val('').autocomplete('onValueChange', true);
                }

                inputElement.trigger('focus');
            }

            inputElement.parents('[dropdown]').on('shown.bs.dropdown', function () {
              refreshAssignTicket();
            });

            inputElement.parents('[dropdown]').on('hide.bs.dropdown', function () {
                parentMenu.find('li .dropdown-submenu-wrapper').removeClass('open');
            });
            
            inputElement.autocomplete({
                  appendTo:             element.find('div.scroll-pane'),
                  lookup: function(query, done) {
                    if( query.indexOf('@') !== -1 ) {
                      query = '';
                    }
                    var data = {suggestions: []};
                    var queryLowerCase = query.toLowerCase();
                    for(var userIndex in users) {
                      if( $scope.filterAssignUser(users[userIndex]) ) {
                        var name = $scope.getUserName(users[userIndex]);

                        if( name.toLowerCase().indexOf(queryLowerCase) !== -1) {
                          data.suggestions.push({value: name, data: users[userIndex]})
                        }
                      }
                    }
                    done(data);

                  },
                  minChars:             0,
                  maxHeight:            204,
                  // maxWidth:          600,
                  // minWidth:          100,
                  // width:             maxProductWidth+40,
                  forceFixPosition:     false,
                  //listMarginTop:      6,
                  listPaddingTop:       10,
                  listPaddingBottom:    10,
                  //onSelect:           function(selection){},
                  showNoSuggestionNotice:true,
                  noSuggestionNotice:   'No results found',
                  showNoDataNotice:     true,
                  noDataNotice:         'No results found',
                  formatItem:         function(result, suggestion) {
                  	var avatarUrl = $scope.getUserAvatarUrl(suggestion.data);
                  	var image = new Image();
                  	image.src = avatarUrl;
                    return '<a href="javascript:void(0)" class=""> \
                        <img src="'+avatarUrl+'" alt="..." class="img-circle avatar-26"> \
                        <span>'+result + ' “'+suggestion.data.primaryEmail+'”</span> \
                      </a>';
                  },
                  calculateWidth: function(result, suggestion){
                    var width = $.Autocomplete.getHtmlWidth('<a href="#"><img src="assets/images/avatars/a4.jpg" alt="..." class="img-circle avatar-26"><span>'+result + ' "'+suggestion.data.primaryEmail+'"</span></a>');
                    return width+60;
                  },
                  preserveLastSelected: true,
                  //lastSelected:       selectedProduct?selectedProduct.name:'',
                  alwaysShow:           true,

                  classes:              {
                                          containerClass: 'users-list',
                                          suggestion:     'user-item',
                                          selected:       'hovered',
                                          lastSelected:   'active'
                                        },
                  onSelect: function(selection){

                    if( typeof( inputElement.data('bs.tokenfield')) != 'undefined' ) {
                      inputElement.off('tokenfield:removedtoken');
                      inputElement.tokenfield('destroy');
                    }

                    inputElement.on('tokenfield:removedtoken', function (e) {
                      inputElement.off('tokenfield:removedtoken');
                      inputElement.tokenfield('destroy');
                      // inputElement.autocomplete('setOptions', {lastSelected: ''}).autocomplete('onValueChange');
                      inputElement.autocomplete('resetSelection');
                      actionElement.addClass('disabled').attr('disabled', 1);
                      inputElement.focus();
                    });

                    inputElement.val('').tokenfield({limit: 1, autocomplete: null}).tokenfield('createToken', selection.data.primaryEmail);
                    inputElement.data('bs.tokenfield').$input.remove();

                    inputElement.val('').autocomplete('onValueChange', true);

                    actionElement.removeClass('disabled').removeAttr('disabled');

                    inputElement.data('autocomplete').container.focus();
                    $scope.setUserToAssign(selection.data);
                  },
                  onDoubleEnter: function() {
                    // Idea: use the callback return value to decide if the execution should continue or not
                    actionElement.click();
                  }
              });

            actionElement.click(function(){
              inputElement.parents('[dropdown]').removeClass('open').trigger('hide.bs.dropdown');
              $scope.assignUserToTicket();
            });

            inputElement.parents('.dropdown-submenu-wrapper').click(function(e){e.stopPropagation()});

            inputElement.data('autocomplete').container.on('keyup', function(e){
                if( e.keyCode == 8) {
                    if( typeof( inputElement.data('bs.tokenfield')) != 'undefined' ) {
                        inputElement.tokenfield('setTokens', []);
                        inputElement.trigger('tokenfield:removedtoken');
                    }
                }
                return false;
            });

            parentMenu.find('li > a').on('mouseenter', function(e){
                if( !$(this).parents('li').find('.dropdown-submenu-wrapper').hasClass('open')) {
                    parentMenu.find('li .dropdown-submenu-wrapper').removeClass('open');
                    $(this).parents('li').find('.dropdown-submenu-wrapper').addClass('open');

                    if( $(this).parents('li').find('.assign-ticket-content').length ) {
                        refreshAssignTicket();
                    }
                }
            });
        }
      }
  }])
})();
