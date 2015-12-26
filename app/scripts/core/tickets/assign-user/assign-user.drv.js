'use strict';

(function () {

  angular.module('quicktech.core.tickets').directive('assignUser',
  	[function () {
    	return {
       	restrict: 'A',
        link: function ($scope, element, attrs) {



						//var users = [{"id":"609d8a77-c06b-4bfc-874f-145e826bbda3","company":{"id":"19df4e3e-cad7-480c-9f85-f82ccab752a6"},"firstName":"Rob","lastName":"Feeder","phoneNumbers":[{"id":"21d99e12-ea51-4bd3-ad9e-9613d17c7c78","number":"+69985448","typeNumber":"MOBILE","priority":0},{"id":"2422ce0f-4579-455a-bc6c-cbdcf1cbf767","number":"45687864","typeNumber":"MOBILE","priority":0}],"status":"Dolor sit amet, consectetuer elit adipiscing.","primaryEmail":"rfeeder@quicktech.com","role":"USER","croppedImage":null,"online":false,"designation":"COO","accountType":"CLIENT"},{"id":"ca613309-0483-4027-ac0f-bdc2c4695c81","company":{"id":"38ae44f0-0abb-4b01-a0d6-8660a56fe5de"},"firstName":"John","lastName":"Lennon","phoneNumbers":[{"id":"7ca3adb0-0e0f-480e-8bbb-1dd5fd1f07e4","number":"+69985448","typeNumber":"MOBILE","priority":0},{"id":"859c788c-ce64-49b5-a783-7505e67ca268","number":"45687864","typeNumber":"MOBILE","priority":0}],"status":"Dolor sit amet, consectetuer elit adipiscing.","primaryEmail":"jlennon@quicktech.com","role":"USER","croppedImage":null,"online":false,"designation":"COO","accountType":"CLIENT"},{"id":"6dc45b23-d8b2-48f0-abdf-8c72a346ccb9","company":{"id":"3bbc7737-5c4c-4c20-b5f4-5e97ea82488f"},"firstName":"Denis","lastName":"Michel","phoneNumbers":[{"id":"309f0cd5-d790-46ac-bb9f-ee8b226419e0","number":"45687864","typeNumber":"MOBILE","priority":0},{"id":"9f42655a-a6f9-4f69-b228-ef3c836eb0d0","number":"+69985448","typeNumber":"MOBILE","priority":0}],"status":"Dolor sit amet, consectetuer elit adipiscing.","primaryEmail":"dmichel@quicktech.com","role":"USER","croppedImage":{"id":"9803a759-166b-40ac-8864-f4ba8d3d63de","origin":{"id":"25325b4e-7ce1-4b35-a82c-9c92ea448e67"},"cropped":{"id":"25325b4e-7ce1-4b35-a82c-9c92ea448e67"},"x":0,"y":0,"w":0,"h":0,"sizeW":0,"sizeH":0,"updatedAt":1445009067495},"online":false,"designation":"COO","accountType":"CLIENT"},{"id":"be3ca10b-7639-4d2b-9f20-8bc6d6a4c221","company":{"id":"5e59817f-f5a3-4324-8802-ce08e3951be9"},"firstName":"Mike","lastName":"Milman","phoneNumbers":[{"id":"20dd7788-6846-4973-975c-4d8de59e1655","number":"45687864","typeNumber":"MOBILE","priority":0},{"id":"2bfb5209-b533-45ce-95ef-23fc5c6c9ff7","number":"+69985448","typeNumber":"MOBILE","priority":0}],"status":"Dolor sit amet, consectetuer elit adipiscing.","primaryEmail":"mmilman@quicktech.com","role":"USER","croppedImage":null,"online":false,"designation":"LFT","accountType":"CLIENT"},{"id":"f9a4f0a5-5649-4709-ac32-f9acee4b0955","company":{"id":"669510c7-928c-463d-9035-a09fda581188"},"firstName":"Choe","lastName":"Song","phoneNumbers":[{"id":"3bc2c812-50c6-4c77-80aa-1dc3f511d4e4","number":"45687864","typeNumber":"MOBILE","priority":0},{"id":"d475ae99-1929-466b-9738-886fc50a33f8","number":"+69985448","typeNumber":"MOBILE","priority":0}],"status":"Dolor sit amet, consectetuer elit adipiscing.","primaryEmail":"csong@quicktech.com","role":"USER","croppedImage":{"id":"10953425-fc52-4040-89d9-101d7d06a550","origin":{"id":"fa33b867-3d73-4b0b-aadf-fa40499e8be9"},"cropped":{"id":"fa33b867-3d73-4b0b-aadf-fa40499e8be9"},"x":0,"y":0,"w":0,"h":0,"sizeW":0,"sizeH":0,"updatedAt":1445009066743},"online":false,"designation":"COO","accountType":"CLIENT"},{"id":"c601c916-79eb-427f-89f4-3024ff4a4d4f","company":{"id":"6b0be42f-7352-4dc1-8d15-bcecb3f8a4fd"},"firstName":"Sam","lastName":"Soon","phoneNumbers":[{"id":"5f8f9aca-1820-4d72-a57d-57fa0c57e408","number":"+69985448","typeNumber":"MOBILE","priority":0},{"id":"7f8bcaa9-194a-4375-8f05-8ddd3bb76f2a","number":"45687864","typeNumber":"MOBILE","priority":0}],"status":"Dolor sit amet, consectetuer elit adipiscing.","primaryEmail":"ssoon@quicktech.com","role":"USER","croppedImage":null,"online":false,"designation":"COO","accountType":"CLIENT"},{"id":"0f2682c1-9867-41df-b498-db3f896dcc82","company":{"id":"904ee5d4-df47-4b93-8ec7-2b30ced70062"},"firstName":"Valery","lastName":"Johnson","phoneNumbers":[{"id":"553ed0ac-900a-4628-9901-7fdb41540852","number":"45687864","typeNumber":"MOBILE","priority":0},{"id":"7bf3f8a2-5dde-4bc5-9cc5-e0b769604a4a","number":"+69985448","typeNumber":"MOBILE","priority":0}],"status":"Dolor sit amet, consectetuer elit adipiscing.","primaryEmail":"vjonson@quicktech.com","role":"USER","croppedImage":null,"online":false,"designation":"COO","accountType":"CLIENT"},{"id":"ff69fe71-7f00-46c2-9231-4750a361b781","company":{"id":"9e46b4ff-e812-470e-9a79-7a9251399fd0"},"firstName":"Ray","lastName":"Ban","phoneNumbers":[{"id":"8e4df35e-5f1c-428e-8f16-f3162c4337e5","number":"45687864","typeNumber":"MOBILE","priority":0},{"id":"f8e08ce0-c934-4506-a94a-cca212e83acc","number":"+69985448","typeNumber":"MOBILE","priority":0}],"status":"Dolor sit amet, consectetuer elit adipiscing.","primaryEmail":"rban@quicktech.com","role":"USER","croppedImage":null,"online":false,"designation":"COO","accountType":"CLIENT"},{"id":"3a7ef54b-13cb-41f5-bf4f-1aeff7112bd5","company":{"id":"a8d503ac-52da-4fbb-8a30-69f2e153538c"},"firstName":"John","lastName":"Snow","phoneNumbers":[{"id":"004dc466-c185-4224-9622-7a2854dc9a59","number":"+98562348","typeNumber":"MOBILE","priority":0}],"status":"Dolor sit amet, consectetuer elit adipiscing.","primaryEmail":"jsnow@quicktech.com","role":"USER","croppedImage":{"id":"2da7e213-5290-4f77-a17e-2914934f35a1","origin":{"id":"71c26e69-7043-4575-8a5a-1c4d6d02fbb0"},"cropped":{"id":"71c26e69-7043-4575-8a5a-1c4d6d02fbb0"},"x":0,"y":0,"w":0,"h":0,"sizeW":0,"sizeH":0,"updatedAt":1445009065516},"online":false,"designation":"ACCOUNT MANAGER","accountType":"CLIENT"},{"id":"b63e0bb0-5828-42ae-a2a4-f739611d324c","company":{"id":"a8d503ac-52da-4fbb-8a30-69f2e153538c"},"firstName":"John","lastName":"Doe","phoneNumbers":[{"id":"c2f076eb-3d1e-46f6-941a-8b1027511ff6","number":"+65487895214","typeNumber":"MOBILE","priority":0}],"status":"Dolor sit amet, consectetuer elit adipiscing.","primaryEmail":"jdoe@quicktech.com","role":"USER","croppedImage":{"id":"ea8a4b22-dc69-4812-8812-150dd1cb6c40","origin":{"id":"09a76d2e-e5d3-4e36-a3c2-2b6ab79dfc2b"},"cropped":{"id":"09a76d2e-e5d3-4e36-a3c2-2b6ab79dfc2b"},"x":0,"y":0,"w":0,"h":0,"sizeW":0,"sizeH":0,"updatedAt":1445009065604},"online":false,"designation":"SUPPORT","accountType":"CLIENT"},{"id":"3fc37015-14ce-406a-91ce-1dc7c692258d","company":{"id":"b5394125-bbd6-4794-85f1-5c71783edabd"},"firstName":"Eric","lastName":"Hoffman","phoneNumbers":[{"id":"11a7d1f0-8e2c-49da-a94f-3d81f30003bf","number":"456984521","typeNumber":"MOBILE","priority":0},{"id":"6d96db6b-5ca7-4db0-aee4-99c546eaff6e","number":"+69885566451","typeNumber":"FAX","priority":0},{"id":"cbfde710-3402-45c5-b150-a1482bfe9769","number":"+659988532","typeNumber":"OFFICE","priority":0}],"status":"Dolor sit amet, consectetuer elit adipiscing.","primaryEmail":"erichoffman@quicktech.com","role":"ADMIN","croppedImage":null,"online":true,"designation":"COO","accountType":"TECH"},{"id":"6c1b42cf-49a6-4fad-a1d9-6d884f2827a5","company":{"id":"b5394125-bbd6-4794-85f1-5c71783edabd"},"firstName":"Super","lastName":"Admin","phoneNumbers":[{"id":"3e89caff-a05a-4247-8c04-6b3e2c291317","number":"+68005566451","typeNumber":"FAX","priority":0},{"id":"c8f280e2-19e9-40f0-811e-f067b0435494","number":"+659980442","typeNumber":"OFFICE","priority":0},{"id":"de2a9d1b-8b5a-4171-8d3a-9e956fee2685","number":"456992521","typeNumber":"MOBILE","priority":0}],"status":"Dolor sit amet, consectetuer elit adipiscing.","primaryEmail":"sa@quicktech.com","role":"SUPER_TECH_ADMIN","croppedImage":null,"online":true,"designation":"ROOM CLEANER","accountType":"TECH"},{"id":"a561de94-8d50-4e26-aefa-cb5bb15e6892","company":{"id":"b5394125-bbd6-4794-85f1-5c71783edabd"},"firstName":"Laurie","lastName":"Harding","phoneNumbers":[{"id":"252302c6-87ad-4639-a2c2-13ab21e46eaa","number":"+6985656475","typeNumber":"FAX","priority":0},{"id":"a4a54c9c-8f9e-48a5-bdd7-c36b5e16b531","number":"+6985565458","typeNumber":"OFFICE","priority":0},{"id":"ac731810-57ef-417b-892a-89d9ed2b29b9","number":"+69985566","typeNumber":"MOBILE","priority":0}],"status":"Dolor sit amet, consectetuer elit adipiscing.","primaryEmail":"lharding@quicktech.com","role":"USER","croppedImage":null,"online":true,"designation":"ACCOUNT MANAGER","accountType":"TECH"},{"id":"a72b3999-dc8f-4fac-8fb1-6a1015cb1815","company":{"id":"b5394125-bbd6-4794-85f1-5c71783edabd"},"firstName":"Eric2","lastName":"Hoffman2","phoneNumbers":[{"id":"443b05ce-0bd6-4d19-996c-b1a23e04ddea","number":"+659988532","typeNumber":"OFFICE","priority":0},{"id":"a4485a39-1dee-4bb8-8ab6-d0e442ef8058","number":"+69885566451","typeNumber":"FAX","priority":0},{"id":"e0627472-a5e8-49e7-b6be-0ecc74a1a7e3","number":"456984521","typeNumber":"MOBILE","priority":0}],"status":"Dolor sit amet, consectetuer elit adipiscing.","primaryEmail":"erichoffman2@quicktech.com","role":"ADMIN","croppedImage":null,"online":true,"designation":"COO","accountType":"TECH"},{"id":"ce1eeeea-3f02-48b6-9208-6daab1448462","company":{"id":"b5394125-bbd6-4794-85f1-5c71783edabd"},"firstName":"Super","lastName":"Admin 2","phoneNumbers":[{"id":"29c3b27c-123e-4128-81cf-44cbfa558cf2","number":"+659980442","typeNumber":"OFFICE","priority":0},{"id":"3d8c11fd-0700-42a2-b956-9b9e7a628e80","number":"+68005566451","typeNumber":"FAX","priority":0},{"id":"d3cafbf2-f4de-4167-98ae-9ebbb12dff0a","number":"456992521","typeNumber":"MOBILE","priority":0}],"status":"Dolor sit amet, consectetuer elit adipiscing.","primaryEmail":"sa2@quicktech.com","role":"SUPER_TECH_ADMIN","croppedImage":null,"online":true,"designation":"ROOM CLEANER","accountType":"TECH"},{"id":"ecf10e1d-55ce-40da-bd1a-72d002bd5e70","company":{"id":"b5394125-bbd6-4794-85f1-5c71783edabd"},"firstName":"Ryan","lastName":"Burns","phoneNumbers":[{"id":"c5fb4e46-5714-4a0a-a41c-75aaac46731f","number":"+66985122","typeNumber":"OFFICE","priority":0},{"id":"dec92c67-6576-478b-adc0-f4e2689e5d38","number":"45678975","typeNumber":"FAX","priority":0},{"id":"f64e6258-c0ab-48ae-af05-a8fbe9889f4b","number":"+231243422","typeNumber":"MOBILE","priority":0}],"status":"Dolor sit amet, consectetuer elit adipiscing.","primaryEmail":"ryanburns@quicktech.com","role":"USER","croppedImage":null,"online":true,"designation":"SUPPORT","accountType":"TECH"}];
						var users = $scope.usersCurrentCompany;

            var inputElement = element.find('input');
            var parentMenu = element.parents('ul.dropdown-menu');
            var actionElement = inputElement.parents('.form-group').find('div.label-add-btn > div');

            inputElement.on("focus", function(){
                console.log("focused");
            }).on("blur", function(){
                console.log("blurred");
            })

            inputElement.parents('.dropdown').on('shown.bs.dropdown', function () {
            	refreshAssignTicket();
            });


            inputElement.parents('.dropdown').on('hide.bs.dropdown', function () {
                parentMenu.find('li .dropdown-submenu-wrapper').removeClass('open');
            });

            // inputElement.parents('li').find('a').on('mouseenter', function(){
            //     refreshAssignTicket();
            // });

            function refreshAssignTicket() {
                console.log("refreshing");

                if( typeof( inputElement.data('bs.tokenfield')) != 'undefined' ) {
                    inputElement.tokenfield('setTokens', []);
                    inputElement.trigger('tokenfield:removedtoken');
                } else {
                    inputElement.val('').autocomplete('onValueChange', true);
                }

                inputElement.trigger('focus');
            }
            console.log('attached');
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
              inputElement.parents('.dropdown').removeClass('open').trigger('hide.bs.dropdown');

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
