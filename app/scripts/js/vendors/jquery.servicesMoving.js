// Expose plugin as an AMD module if AMD loader is present:
var scroll;
(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object' && typeof require === 'function') {
        // Browserify
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    'use strict';

    var
        utils = (function () {
            return {
                escapeRegExChars: function (value) {
                    return value.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
                },
                createNode: function (containerClass) {
                    var div = document.createElement('div');
                    div.className = containerClass;
                    div.style.position = 'absolute';
                    div.style.display = 'none';
                    return div;
                },
                arrayUnique : function (array) {
                    var a = array.concat();
                    for(var i=0; i<a.length; ++i) {
                        for(var j=i+1; j<a.length; ++j) {
                            if(a[i] === a[j])
                                a.splice(j--, 1);
                        }
                    }
                    return a;
                }
            };
        }()),

        keys = {
            ESC: 27,
            TAB: 9,
            RETURN: 13,
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40
        };

    function ServicesMoving(el, options) {
        var that = this;
        var defaults = {
            companies: [],
            companyServices: {},
            selectedServices: [],
            onMoveService: function(){},
            formatResult: ServicesMoving.formatResult,
            maxHeight: 164,
            minWidth: 226,
            maxWidth: 300,
            listPaddingTop: 10,
            listPaddingBottom: 10,
            showNoSuggestionNotice: true,
            noSuggestionNotice: 'No results'
        };
        that.options = $.extend({}, defaults, options);

        that.base = el;
        that.buttonElement = $(el);
        that.buttonElementParent = that.buttonElement.parent();
        that.suggestions = [];
        that.classes = {
            suggestion: 'checkbox-dd-item',
            selected: 'selected'
        };
        that.selectedIndex = -1;
        that.noSuggestionsContainer = null;
        that.listWidth = 0;
        that.listWidthCalculated = false;

        that.newCompanyServices = {};
        that.newCompanyServiceStatus = {};

        that.checkedCount = 0;

        that.initialize();
    }

    ServicesMoving.utils = utils;

    $.ServicesMoving = ServicesMoving;

    ServicesMoving.formatResult = function(suggestion, currentValue) {
        var flipHighlighting = true;
        var pattern = '(' + utils.escapeRegExChars(currentValue) + ')';
        var center = '<strong>$1<\/strong>';
        if(flipHighlighting && pattern != '()') {
            center = '<\/strong>$1<strong>';
        }

        var formattedSuggestion =  suggestion
            .replace(new RegExp(pattern, 'gi'), center)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/&lt;(\/?strong)&gt;/g, '<$1>');
        if( flipHighlighting && pattern != '()' ) {
            return '<strong>'+formattedSuggestion+'<\/strong>';
        }
        return formattedSuggestion;
    }

    ServicesMoving.getHtmlWidth = function(html, appendTo) {
        var o = $(html+'<br />')
            .css({'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden'})
            .appendTo(appendTo),
        w = o.outerWidth();
        o.remove();
        return w;
    };

    ServicesMoving.prototype = {
        initialize: function() {
            var that = this;

            that.container      = that.buttonElement.next('div.checkbox-dropdown');
            that.searchElement  = that.container.find('input');
            that.moveElement    = that.container.find('div.btn');
            that.currentSearch  = that.searchElement.val();
            that.listContainer  = that.container.find('.list-container');
            that.countElement   = that.container.find('.number-selected strong');

            that.noSuggestionsContainer = $('<div class="autocomplete-no-suggestion"></div>')
                                          .html(this.options.noSuggestionNotice).get(0);

            that.refresh();

            that.listContainer.on('mousemove.servicesmoving', '.'+that.classes.suggestion, function () {
                // if( that.disableMouseHover ) {
                //     that.disableMouseHover = false;
                //     clearTimeout(that.disableMouseHoverTimeout);
                //     return;
                // }
                that.activate($(this).data('index'));
            });
            
            that.container.on('click.servicesmoving', '.'+that.classes.suggestion, function(e){ that.onClick(e) });
            that.searchElement.on('keyup.servicesmoving', function (e) { that.onKeyUp(e); });
            that.searchElement.on('keydown.servicesmoving', function (e) { that.onKeyPress(e); });
            that.moveElement.on('click.servicesmoving', function(e){ that.onMove(e)});

            that.suggest();
        },

        updateServices: function(existingServices){
            return $.ServicesMoving.utils.arrayUnique(existingServices.concat(this.options.selectedServices));
        },

        updateCheckedCount: function(difference) {
            var that = this;
            that.checkedCount = that.checkedCount + difference;
            that.countElement.html(that.checkedCount);
        },

        onKeyUp: function (e) {
            var that = this;

            switch (e.which) {
                case keys.UP:
                case keys.DOWN:
                    return;
            }

            if (that.currentSearch !== that.searchElement.val()) {
                that.currentSearch = that.searchElement.val();
                that.getSuggestions()
                that.suggest();
            }
        },

        onKeyPress: function (e) {
            var that = this;
            // clearTimeout(that.disableMouseHoverTimeout);
            // that.disableMouseHover = true;
            // that.disableMouseHoverTimeout = setTimeout(function(){
            //     that.disableMouseHover = false;
            // }, 200);

            switch (e.which) {
                case keys.RETURN:
                    if (that.selectedIndex !== -1) {
                        that.activate(that.selectedIndex).click();
                        return;
                    }
                    break;
                case keys.UP:
                    that.moveUp();
                    break;
                case keys.DOWN:
                    that.moveDown();
                    break;
                default:
                    return;
            }

            // Cancel event if function did not return:
            e.stopImmediatePropagation();
            e.preventDefault();
        },

        onClick: function (e) {
            var that = this;
            var listElement = $(e.currentTarget);
            var company_id = listElement.data('company-id');
            var newState = listElement.data('state');
            var moveElementDisabled = 1;

            that.adjustScroll($(e.currentTarget).data('index'), true);

            // partial => full
            if(listElement.find('.control-indicator').hasClass('alternate')) {
                listElement.find('.control-indicator').removeClass('alternate');
                that.newCompanyServices[company_id] = that.updateServices(that.options.companyServices[company_id] || [])
                that.updateCheckedCount(+1)
                newState = 'full';

            } else {
                // full => empty
                if( listElement.find('input[type="checkbox"]')[0].checked ) {
                    listElement.find('input[type="checkbox"]')[0].checked = false;
                    that.updateCheckedCount(-1)
                    delete that.newCompanyServices[company_id];
                    //newState = 'empty'; // hack as per requirement

                // empty => partial | full
                } else {
                    listElement.find('input[type="checkbox"]')[0].checked = true;

                    if( listElement.data('state') == 'partial' ) {
                        listElement.find('.control-indicator').addClass('alternate');
                        delete that.newCompanyServices[company_id];
                        //that.newCompanyServices[company_id] = that.options.companyServices[company_id];  // hack as per requirement
                        //newState = 'partial';  // hack as per requirement
                    } else {
                        that.newCompanyServices[company_id] = that.updateServices(that.options.companyServices[company_id] || []);
                        that.updateCheckedCount(+1)
                        newState = 'full';
                    }
                }
            }

            // record change
            that.newCompanyServiceStatus[company_id] = ( listElement.data('state') != newState );

            // detect overall change
            $.each(that.newCompanyServiceStatus, function(key, value){
                if(value) {
                    moveElementDisabled = 0;
                    return false;
                }
            });

            if( moveElementDisabled ) {
                that.moveElement.addClass('disabled');
            } else {
                that.moveElement.removeClass('disabled');
            }

            e.stopPropagation();
            e.preventDefault();
        },

        onMove: function() {
            var that = this;
            that.moveElement.addClass('disabled');
            that.options.onMoveService.call(that.base, that.newCompanyServices);
        },

        moveUp: function () {
            var that = this;

            if (that.selectedIndex === -1) {
                return;
            }

            if (that.selectedIndex === 0) {
                return;
            }

            that.adjustScroll(that.selectedIndex - 1);
        },

        moveDown: function () {
            var that = this;

            if (that.selectedIndex === (that.suggestions.length - 1)) {
                return;
            }

            that.adjustScroll(that.selectedIndex + 1);
        },

        adjustScroll: function (index, animate) {
            var that = this,
                activeItem;

            activeItem = that.activate(index);

            if (!activeItem) {
                return;
            }

            var offsetTop,
                upperBound,
                lowerBound,
                heightDelta = $(activeItem).outerHeight();

            offsetTop = activeItem.offsetTop;

            upperBound = that.container.find('.nano-content').scrollTop();
            lowerBound = upperBound + that.options.maxHeight - heightDelta;

            if ((offsetTop+that.options.listPaddingTop) < (upperBound+20)) {
                offsetTop -= that.options.listPaddingTop;

                if( animate ) {
                    that.scrollElement.find('.nano-content').stop().animate({
                        'scrollTop': offsetTop
                    }, 100, 'swing');
                } else {
                    that.scrollElement.nanoScroller({ scrollTop: offsetTop, flash: true});
                }

                that.scrollElement.nanoScroller({flash: true});

            } else if ((offsetTop+that.options.listPaddingBottom) > lowerBound) {
                offsetTop += that.options.listPaddingTop;

                if(animate) {
                    that.scrollElement.find('.nano-content').stop().animate({
                        'scrollTop': offsetTop - that.options.maxHeight + heightDelta
                    }, 100, 'swing');
                } else {
                    that.scrollElement.nanoScroller({ scrollTop: offsetTop - that.options.maxHeight + heightDelta,flash: true});
                }

                that.scrollElement.nanoScroller({flash: true});
           
            }
        },

        activate: function (index) {
            var that = this,
                activeItem,
                selected = that.classes.selected,
                container = that.container.find('.checkbox-dd-list'),
                children = container.find('.' + that.classes.suggestion);

            container.find('.' + selected).removeClass(selected);

            that.selectedIndex = index;

            if (that.selectedIndex !== -1 && children.length > that.selectedIndex) {
                activeItem = children.get(that.selectedIndex);
                $(activeItem).addClass(selected);
                return activeItem;
            }

            return null;
        },

        refresh: function() {
            var that = this;
            if(that.options.selectedServices.length == 0) {
                that.buttonElement.addClass('disabled');
            } else {
                that.buttonElement.removeClass('disabled');
                that.moveElement.addClass('disabled');
                that.searchElement.val('');
                that.currentSearch = '';
                that.newCompanyServices = {};
                that.newCompanyServiceStatus = {};
                that.checkedCount = 0;
                this.getSuggestions();
            }
        },

        suggest: function() {

            if (this.suggestions.length === 0) {
                if (this.options.showNoSuggestionNotice) {
                    this.noSuggestions();
                } else {
                    this.hide();
                }
                return;
            }

            var that = this,
                suggestionsHTML = '',
                listItemHTML = '',
                listItemHTMLforWidth = '',
                listWidth = 0,
                listItemWidth = 0,
                listPaddingStyle = '',
                contentHeight = 0,
                checkedCount = 0,
                suggestionsCount = that.suggestions.length;
            
            if( that.options.maxWidth ) {
                that.listContainer.css('width', that.options.maxWidth);
            }

            $.each(that.suggestions, function(index, company){
                var associationCount = 0,
                checkboxState = 'empty',
                checkboxCheckedHtml = '',
                checkboxIntermediateHtml = '';

                if( company.id in that.options.companyServices ) {
                    $.each(that.options.companyServices[company.id], function(index, companyService){
                        if( that.options.selectedServices.indexOf( companyService ) != -1 ) {
                            associationCount++;
                        }
                    });
                }

                if( associationCount > 0 && associationCount < that.options.selectedServices.length ) {
                    checkboxState = 'partial';
                } else if( associationCount == that.options.selectedServices.length ) {
                    checkboxState = 'full';
                    checkedCount += 1;
                }

                if( checkboxState != 'empty') {
                    checkboxCheckedHtml = 'checked';
                }

                if( checkboxState == 'partial' ) {
                    checkboxIntermediateHtml = 'alternate';
                }

                listPaddingStyle = "";
                if(index == 0 && that.options.listPaddingTop) {
                    listPaddingStyle = 'style="margin-top:'+that.options.listPaddingTop+'px"'
                } else if( index == suggestionsCount-1 && that.options.listPaddingBottom ) {
                    listPaddingStyle = 'style="margin-bottom:'+that.options.listPaddingBottom+'px"'
                }

                listItemHTML = '<div '+listPaddingStyle+' class="'+that.classes.suggestion+'" data-company-id="'+company.id+'" data-state="'+checkboxState+'" data-index="' + index + '"> \
                    <label class="control checkbox"> \
                        <input type="checkbox" '+checkboxCheckedHtml+'> \
                        <span class="control-indicator pull-left '+checkboxIntermediateHtml+'"></span>'+
                        that.options.formatResult(company.name, that.currentSearch)+
                    '</label> \
                </div>';



                if( !that.listWidthCalculated ){
                    listItemWidth = $.ServicesMoving.getHtmlWidth(listItemHTML, $('body'));
                
                    if (listItemWidth > that.listWidth ) {
                        that.listWidth = listItemWidth;
                    }
                }

                suggestionsHTML += listItemHTML;
                that.searchElement.focus();
            });

            that.updateCheckedCount(checkedCount);

            that.listWidthCalculated = true;
            // Catter extra required when results are bold on search
            that.listWidth += 10;

            that.listContainer.find('.checkbox-dd-list').html(suggestionsHTML)

            contentHeight = that.options.listPaddingTop+that.options.listPaddingBottom;

            that.listContainer.find('.'+that.classes.suggestion).each(function(){
                contentHeight += $(this).outerHeight();
            });

            if( contentHeight < that.options.maxHeight ) {
                that.listContainer.css('height', contentHeight);
            } else {
                that.listContainer.css('height', that.options.maxHeight);
            }

            if( that.options.minWidth && that.listWidth < that.options.minWidth) {
                that.listContainer.css('width',that.options.minWidth);
            } else if( that.options.maxWidth && that.listWidth > that.options.maxWidth) {
                that.listContainer.css('width',that.options.maxWidth);
            } else {
                that.listContainer.css('width',that.listWidth);
            }


            that.scrollElement = that.container.find('.nano').nanoScroller();
            scroll = that.scrollElement;
        },

        getSuggestions: function() {
            var that = this;
            var query = that.currentSearch;

            that.selectedIndex = -1;

            if(query != '') {
                var queryLowerCase = query.toLowerCase();

                that.suggestions = $.grep(that.options.companies, function (suggestion) {
                    return suggestion.name.toLowerCase().indexOf(queryLowerCase) !== -1
                })

                that.suggestions.sort(function(x,y){
                    var xIndex = x.name.toLowerCase().indexOf(queryLowerCase);
                    var yIndex = y.name.toLowerCase().indexOf(queryLowerCase);

                    // sort for search index: case 1
                    if(xIndex > yIndex) {
                        return 1;

                    // sort for search index: case -1
                    } else if(xIndex < yIndex) {
                        return -1;
                    // sort for search index: case 0
                    } else {
                        // sort same index search alphabatically: case 1
                        if( x.name.toLowerCase() > y.name.toLowerCase() ) {
                            return 1;
                        // sort same index search alphabatically: case -1
                        } else if( x.name.toLowerCase() < y.name.toLowerCase() ) {
                            return -1;
                        // sort same index search alphabatically: case 0
                        } else {
                            return 0;
                        }
                    }
                });
            } else {
                that.suggestions = that.options.companies;
                that.suggestions.sort(function(x,y){
                    // sort same index search alphabatically: case 1
                    if( x.name.toLowerCase() > y.name.toLowerCase() ) {
                        return 1;
                    // sort same index search alphabatically: case -1
                    } else if( x.name.toLowerCase() < y.name.toLowerCase() ) {
                        return -1;
                    // sort same index search alphabatically: case 0
                    } else {
                        return 0;
                    }
                });
            }
        },
        noSuggestions: function() {
             var that = this,
                 container = that.listContainer.find('.checkbox-dd-list'),
                 noSuggestionsContainer = $(that.noSuggestionsContainer);

            // Some explicit steps. Be careful here as it easy to get
            // noSuggestionsContainer removed from DOM if not detached properly.
            noSuggestionsContainer.detach();
            container.empty(); // clean suggestions if any
            container.append(noSuggestionsContainer);

            //container.show();
            that.listContainer.css('height', noSuggestionsContainer.outerHeight());

            that.visible = true;
        },

        setSelectedServices: function(selectedServices) {
            this.options.selectedServices = selectedServices;
            this.refresh();
        },

        setCompanyServices: function(companyServices) {
            this.options.companyServices = companyServices;
            this.refresh();
        },

        dispose: function () {
            var that = this;
            that.buttonElement.off('.servicesmoving').removeData('servicesmoving');
        }
    };

    // Create chainable jQuery plugin:
    $.fn.servicesmoving = function (options, args) {
        var dataKey = 'servicesmoving';
        // If function invoked without argument return
        // instance of the first matched element:
        if (arguments.length === 0) {
            return this.first().data(dataKey);
        }

        return this.each(function () {
            var buttonElement = $(this),
                instance = buttonElement.data(dataKey);

            if (typeof options === 'string') {
                if (instance && typeof instance[options] === 'function') {
                    instance[options](args);
                }
            } else {
                // If instance already exists, destroy it:
                if (instance && instance.dispose) {
                    instance.dispose();
                }
                instance = new ServicesMoving(this, options);
                buttonElement.data(dataKey, instance);
            }
        });
    };
}));