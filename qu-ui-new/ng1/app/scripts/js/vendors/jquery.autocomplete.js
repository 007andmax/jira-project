/**
*  Ajax Autocomplete for jQuery, version %version%
*  (c) 2015 Tomas Kirda
*
*  Ajax Autocomplete for jQuery is freely distributable under the terms of an MIT-style license.
*  For details, see the web site: https://github.com/devbridge/jQuery-Autocomplete
*/

/*jslint  browser: true, white: true, plusplus: true, vars: true */
/*global define, window, document, jQuery, exports, require */

// Expose plugin as an AMD module if AMD loader is present:
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

    function Autocomplete(el, options) {
        var noop = function () { },
            that = this,
            defaults = {
                ajaxSettings: {},
                autoSelectFirst: false,
                appendTo: document.body,
                serviceUrl: null,
                lookup: null,
                onSelect: null,
                onHover: null,
                width: 'auto',
                maxWidth: 0,
                minWidth: 0,
                minChars: 1,
                maxHeight: 300,
                listMarginTop: 0,
                listPaddingTop: 0,
                listPaddingBottom: 0,
                deferRequestBy: 0,
                params: {},
                formatResult: Autocomplete.formatResult,
                delimiter: null,
                zIndex: 9999,
                type: 'GET',
                noCache: false,
                onSearchStart: noop,
                onSearchComplete: noop,
                onSearchError: noop,
                preserveInput: true,
                tabDisabled: false,
                dataType: 'text',
                currentRequest: null,
                triggerSelectOnValidInput: false,
                preventBadQueries: true,
                lookupFilter: function (suggestion, originalQuery, queryLowerCase) {
                    return suggestion.value.toLowerCase().indexOf(queryLowerCase) !== -1;
                },
                paramName: 'query',
                transformResult: function (response) {
                    return typeof response === 'string' ? $.parseJSON(response) : response;
                },
                showNoSuggestionNotice: false,
                noSuggestionNotice: 'No results',
                showNoDataNotice: true,
                noDataNotice: 'Sorry, No data available.',
                orientation: 'bottom',
                forceFixPosition: false,
                useCustomScroller: true,
                sortByRank: true,
                showAllOnFocus: true,
                preserveLastSelected: false,
                lastSelected: '',
                lastSelectedScrollTop: 0,
                preserveLastHovered: false,
                lastHovered: '',
                flipHighlighting: true,

                preventSelection: false,
                onSelectAction: null,
                onChangeSelect: null,
                alwaysShow: false,
                classes: {
                    containerClass: 'autocomplete-suggestions',
                    suggestion:     'autocomplete-suggestion',
                    selected:       'autocomplete-selected',
                    lastSelected:   'autocomplete-last-selected',
                    lastHovered:    'autocomplete-selected',
                    nano:           'nano',
                    nanoContent:    'nano-content',
                }
            };

        // Shared variables:
        that.element = el;
        that.el = $(el);
        that.suggestions = [];
        that.badQueries = [];
        that.selectedIndex = -1;
        that.lastSelectedIndex = -1;
        that.lastHoveredIndex = -1;
        that.currentValue = that.element.value;
        that.intervalId = 0;
        that.cachedResponse = {};
        that.onChangeInterval = null;
        that.onChange = null;
        that.isLocal = false;
        that.container = null;
        that.suggestionsContainer = null;
        that.noSuggestionsContainer = null;
        that.noDataAvailable = false;
        that.options = $.extend({}, defaults, options);
        that.classes = $.extend({}, defaults.classes, options.classes);

        that.hint = null;
        that.hintValue = '';
        that.selection = null;
        that.scrollElement = null;

        that.lastSelected   = that.options.lastSelected;
        that.lastHovered    = that.options.lastHovered;
        that.lastSelectedScrollTop = that.options.lastSelectedScrollTop;

        that.disableMouseHover = false;
        that.disableMouseHoverTimeout = null;

        that.listWidth = 0;
        that.listWidthCalculated = false;

        // Initialize and set options:
        that.initialize();
        that.setOptions(options);
    }

    Autocomplete.utils = utils;

    $.Autocomplete = Autocomplete;

    Autocomplete.formatResult = function (suggestion, currentValue, flipHighlighting) {
        var pattern = '(' + utils.escapeRegExChars(currentValue) + ')',
        formattedSuggestion;

        if( currentValue !== '' ) {
            formattedSuggestion = suggestion.value
            .replace(new RegExp(pattern, 'gi'), (flipHighlighting?'<\/strong>$1<strong>':'<strong>$1<\/strong>'))
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/&lt;(\/?strong)&gt;/g, '<$1>');

            if(flipHighlighting) {
                formattedSuggestion = '<strong>'+formattedSuggestion+'<\/strong>';
            };

        } else {
            return suggestion.value;
        }
        return formattedSuggestion;
    };

    Autocomplete.sortResult = function(suggestions, query) {
        return suggestions.sort(function(x,y){
            var xIndex = x.value.toLowerCase().indexOf(query);
            var yIndex = y.value.toLowerCase().indexOf(query);

            // sort for search index: case 1
            if(xIndex > yIndex) {
                return 1;

            // sort for search index: case -1
            } else if(xIndex < yIndex) {
                return -1;
            // sort for search index: case 0
            } else {
                // sort same index search alphabatically: case 1
                if( x.value.toLowerCase() > y.value.toLowerCase() ) {
                    return 1;
                // sort same index search alphabatically: case -1
                } else if( x.value.toLowerCase() < y.value.toLowerCase() ) {
                    return -1;
                // sort same index search alphabatically: case 0
                } else {
                    return 0;
                }
            }
        });
    };

    Autocomplete.getHtmlWidth = function(html) {
        var o = $(html)
            .css({'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden'})
            .appendTo($('body')),
        w = o.width();
        o.remove();
        return w;
    };

    Autocomplete.isElementInViewport = function(element) {
        if (element.offsetHeight < element.scrollHeight ||
            element.offsetWidth < element.scrollWidth) {

            return true;
            // your element have overflow
        } else {

            return false;
            // your element doesn't have overflow
        }


        //special bonus for those using jQuery
        if (typeof jQuery === "function" && el instanceof jQuery) {
            el = el[0];
        }

        var rect = el.getBoundingClientRect();

        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
        );
    };

    Autocomplete.prototype = {

        killerFn: null,

        initialize: function () {
            var that = this,
                suggestionSelector = '.' + that.classes.suggestion,
                selected = that.classes.selected,
                options = that.options,
                container;

            // Remove autocomplete attribute to prevent native suggestions:
            that.element.setAttribute('autocomplete', 'off');

            that.killerFn = function (e) {
                if ($(e.target).closest('.' + that.classes.containerClass).length === 0) {
                    that.killSuggestions();
                    that.disableKillerFn();
                }
            };

            // html() deals with many types: htmlString or Element or Array or jQuery
            that.noSuggestionsContainer = $('<div class="autocomplete-no-suggestion"></div>')
                                          .html(options.noSuggestionNotice).get(0);
            that.noDataContainer = $('<div class="autocomplete-no-data"></div>')
                                          .html(options.noDataNotice).get(0);

            that.suggestionsContainer = Autocomplete.utils.createNode(that.classes.containerClass);

            container = $(that.suggestionsContainer);
            container.attr('tabindex', '-1');
            container.appendTo(options.appendTo);


            // Only set width if it was provided:
            if (options.width !== 'auto') {
                container.width(options.width);
            }

            // Listen for mouse over event on suggestions list:
            container.on('mousemove.autocomplete', suggestionSelector, function () {

                if( $(this).data('index') == that.lastHoveredIndex) {
                    return;
                }

                if( that.disableMouseHover ) {
                    that.disableMouseHover = false;
                    clearTimeout(that.disableMouseHoverTimeout);
                    return;
                }

                that.activate($(this).data('index'));
                // if ($.isFunction(that.options.onChangeSelect)) {
                //     that.options.onChangeSelect.call(that.element, that.suggestions[$(this).data('index')]);
                // }
            });

            // Deselect active element when mouse leaves suggestions container:
            container.on('mouseout.autocomplete', function () {
                //that.selectedIndex = -1;
                container.children('.' + selected).removeClass(selected);
            });

            // Listen for click event on suggestions list:
            container.on('click.autocomplete', suggestionSelector, function (e) {
                container.focus();

                that.adjustScroll($(this).data('index'), false, true);

                if ($.isFunction(that.options.onSelectAction)) {
                    that.options.onSelectAction.call(that.element, $(this), that.suggestions[$(this).data('index')]);
                }

                if( !that.options.preventSelection ) {
                    that.select($(this).data('index'));
                } else {
                    return false;
                }
            });

            that.fixPositionCapture = function () {
                if (that.visible) {
                    that.fixPosition();
                }
            };

            $(window).on('resize.autocomplete', that.fixPositionCapture);

            container.on('keydown.autocomplete', function (e) { that.onKeyPress(e); });

            that.el.on('keydown.autocomplete', function (e) { that.onKeyPress(e); });
            that.el.on('keyup.autocomplete', function (e) { that.onKeyUp(e); });
            that.el.on('blur.autocomplete', function () { that.onBlur(); });
            that.el.on('focus.autocomplete', function () { that.onFocus(); });
            that.el.on('change.autocomplete', function (e) { that.onKeyUp(e); });
            that.el.on('input.autocomplete', function (e) { that.onKeyUp(e); });

            that.container = container;
        },

        onFocus: function () {
            var that = this;
            that.fixPosition();

            if($.isFunction(that.options.onFocus)) {
                that.options.onFocus.call(that.container, that.getItemBySelectedIndex());
            }

            if (!that.options.alwaysShow && that.options.minChars === 0 && (that.options.showAllOnFocus || that.el.val().length === 0) ) {
                that.onValueChange(that.options.showAllOnFocus);
            }
        },

        onBlur: function () {
            var that = this;
            if( !that.options.alwaysShow && that.options.preserveLastSelected ) {
                that.el.val(that.lastSelected);
            }
            this.enableKillerFn();
        },

        abortAjax: function () {
            var that = this;
            if (that.currentRequest) {
                that.currentRequest.abort();
                that.currentRequest = null;
            }
        },

        setOptions: function (suppliedOptions) {
            var that = this,
                options = that.options;

            $.extend(options, suppliedOptions);

            that.isLocal = $.isArray(options.lookup);

            if (that.isLocal) {
                options.lookup = that.verifySuggestionsFormat(options.lookup);
                if( options.lookup.length == 0 ) {
                    that.noDataAvailable = true;
                }
            }

            options.orientation = that.validateOrientation(options.orientation, 'bottom');

            // Adjust height, width and z-index:
            $(that.suggestionsContainer).css({
                //'max-height': options.maxHeight + 'px',
                'width': options.width + 'px',
                'z-index': options.zIndex
            });

            that.lastSelected   = options.lastSelected;
            that.lastHovered    = options.lastHovered;
        },


        clearCache: function () {
            this.cachedResponse = {};
            this.badQueries = [];
        },

        clear: function () {
            this.clearCache();
            this.currentValue = '';
            this.suggestions = [];
        },

        disable: function () {
            var that = this;
            that.disabled = true;
            clearInterval(that.onChangeInterval);
            that.abortAjax();
        },

        enable: function () {
            this.disabled = false;
        },

        fixPosition: function () {
            // Use only when container has already its content

            var that = this,
                $container = $(that.suggestionsContainer),
                containerParent = $container.parent().get(0);
            // Fix position automatically when appended to body.
            // In other cases force parameter must be given.
            if (containerParent !== document.body && !that.options.forceFixPosition) {
                return;
            }

            // Choose orientation
            var orientation = that.options.orientation,
                containerHeight = $container.outerHeight(),
                height = that.el.outerHeight(),
                offset = that.el.offset(),
                styles = { 'top': offset.top, 'left': offset.left };

            if (orientation === 'auto') {
                var viewPortHeight = $(window).height(),
                    scrollTop = $(window).scrollTop(),
                    topOverflow = -scrollTop + offset.top - containerHeight,
                    bottomOverflow = scrollTop + viewPortHeight - (offset.top + height + containerHeight);

                orientation = (Math.max(topOverflow, bottomOverflow) === topOverflow) ? 'top' : 'bottom';
            }

            if (orientation === 'top') {
                styles.top += -containerHeight;
            } else {
                styles.top += height + that.options.listMarginTop;
            }

            // If container is not positioned to body,
            // correct its position using offset parent offset
            if(containerParent !== document.body) {
                var opacity = $container.css('opacity'),
                    parentOffsetDiff;

                    if (!that.visible){
                        $container.css('opacity', 0).show();
                    }

                parentOffsetDiff = $container.offsetParent().offset();
                styles.top -= parentOffsetDiff.top;
                styles.left -= parentOffsetDiff.left;

                if (!that.visible){
                    $container.css('opacity', opacity).hide();
                }
            }

            // -2px to account for suggestions border.
            if (that.options.minWidth == 0 && that.options.maxWidth == 0 && that.options.width === 'auto') {
                styles.width = (that.el.outerWidth() - 2) + 'px';
            }

            $container.css(styles);
        },

        enableKillerFn: function () {
            var that = this;
            if( that.options.alwaysShow ) {
                return;
            }
            $(document).on('click.autocomplete', that.killerFn);
        },

        disableKillerFn: function () {
            var that = this;
            if( that.options.alwaysShow ) {
                return;
            }
            $(document).off('click.autocomplete', that.killerFn);
        },

        killSuggestions: function () {
            var that = this;
            that.stopKillSuggestions();
            that.intervalId = window.setInterval(function () {
                that.hide();
                that.stopKillSuggestions();
            }, 50);
        },

        stopKillSuggestions: function () {
            window.clearInterval(this.intervalId);
        },

        isCursorAtEnd: function () {
            var that = this,
                valLength = that.el.val().length,
                selectionStart = that.element.selectionStart,
                range;

            if (typeof selectionStart === 'number') {
                return selectionStart === valLength;
            }
            if (document.selection) {
                range = document.selection.createRange();
                range.moveStart('character', -valLength);
                return valLength === range.text.length;
            }
            return true;
        },

        onKeyPress: function (e) {
            var that = this;
            clearTimeout(that.disableMouseHoverTimeout);
            that.disableMouseHover = true;
            that.disableMouseHoverTimeout = setTimeout(function(){
                that.disableMouseHover = false;
            }, 200);

            // If suggestions are hidden and user presses arrow down, display suggestions:
            if (!that.disabled && !that.visible && e.which === keys.DOWN && that.currentValue) {
                that.suggest();
                return;
            }

            if (that.disabled || !that.visible) {
                return;
            }

            switch (e.which) {
                case keys.ESC:
                    that.el.val(that.lastSelected).blur();
                    that.hide();
                    break;
                case keys.RIGHT:
                    if (that.hint && that.options.onHint && that.isCursorAtEnd()) {
                        that.selectHint();
                        break;
                    }
                    return;
                case keys.TAB:
                    if ($.isFunction(that.options.onTab)) {
                        that.options.onTab.call(that.container);
                        return;
                    }
                    if (that.hint && that.options.onHint) {
                        that.selectHint();
                        return;
                    }
                    if (that.selectedIndex === -1) {
                        that.disableKillerFn();
                        that.hide();
                        return;
                    }
                    if (!that.options.preventSelection) {
                        that.select(that.selectedIndex);
                    }
                    if (that.options.tabDisabled === false) {
                        return;
                    }
                    break;
                case keys.RETURN:

                    if (that.selectedIndex !== -1 && that.selectedIndex == that.lastSelectedIndex && $.isFunction(that.options.onDoubleEnter)) {
                        that.options.onDoubleEnter.call(that.element, $(that.getItemBySelectedIndex()), that.suggestions[that.selectedIndex]);
                        return;
                    }

                    if (that.selectedIndex !== -1 && $.isFunction(that.options.onSelectAction)) {
                        that.options.onSelectAction.call(that.element, $(that.getItemBySelectedIndex()), that.suggestions[that.selectedIndex]);
                        return;
                    }

                    if( !that.options.preventSelection ) {
                        if (that.selectedIndex === -1) {
                            that.el.blur();
                            that.hide();
                            return;
                        }

                        that.select(that.selectedIndex);
                        that.el.blur();
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

        onKeyUp: function (e) {
            var that = this;

            if (that.disabled) {
                return;
            }

            switch (e.which) {
                case keys.UP:
                case keys.DOWN:
                    return;
            }

            clearInterval(that.onChangeInterval);

            if (that.currentValue !== that.el.val()) {
                that.findBestHint();
                if (that.options.deferRequestBy > 0) {
                    // Defer lookup in case when value changes very quickly:
                    that.onChangeInterval = setInterval(function () {
                        that.onValueChange();
                    }, that.options.deferRequestBy);
                } else {
                    that.onValueChange();
                }
            }
        },

        onValueChange: function (showAll) {
            var that = this,
                options = that.options,
                value = that.el.val(),
                query = that.getQuery(value);

            if (that.selection && that.currentValue !== query) {
                that.selection = null;
                (options.onInvalidateSelection || $.noop).call(that.element);
            }

            clearInterval(that.onChangeInterval);
            that.currentValue = value;
            that.selectedIndex = -1;

            // Check existing suggestion for the match before proceeding:
            if (options.triggerSelectOnValidInput && that.isExactMatch(query)) {
                that.select(0);
                return;
            }

            if (query.length < options.minChars) {
                that.hide();
            } else {
                that.getSuggestions(query, showAll);
            }
        },

        isExactMatch: function (query) {
            var suggestions = this.suggestions;

            return (suggestions.length === 1 && suggestions[0].value.toLowerCase() === query.toLowerCase());
        },

        getQuery: function (value) {
            var delimiter = this.options.delimiter,
                parts;

            if (!delimiter) {
                return value;
            }
            parts = value.split(delimiter);
            return $.trim(parts[parts.length - 1]);
        },

        getSuggestionsLocal: function (query, showAll) {
            var that = this,
                options = that.options,
                queryLowerCase = query.toLowerCase(),
                filter = options.lookupFilter,
                limit = parseInt(options.lookupLimit, 10),
                data;

            if(showAll) {
                query = '';
                queryLowerCase = '';
                that.disableKillerFn();
            }

            data = {
                suggestions: $.grep(options.lookup, function (suggestion) {
                    return filter(suggestion, query, queryLowerCase);
                })
            };

            if( query != '' && that.options.sortByRank ) {
                data.suggestions = Autocomplete.sortResult(data.suggestions, queryLowerCase);
                //data.suggestions.sort(Autocomplete.sortResult);
            }

            if (limit && data.suggestions.length > limit) {
                data.suggestions = data.suggestions.slice(0, limit);
            }

            return data;
        },

        getSuggestions: function (q, showAll) {
            var response,
                that = this,
                options = that.options,
                serviceUrl = options.serviceUrl,
                params,
                cacheKey,
                ajaxSettings;

            options.params[options.paramName] = q;
            params = options.ignoreParams ? null : options.params;

            if (options.onSearchStart.call(that.element, options.params) === false) {
                return;
            }
            if( showAll ) {
                q = '';
            }
            if ($.isFunction(options.lookup)){
                options.lookup(q, function (data) {

                    data.suggestions = Autocomplete.sortResult(data.suggestions, q.toLowerCase());
                    that.suggestions = data.suggestions;
                    that.suggest();
                    options.onSearchComplete.call(that.element, q, data.suggestions);
                });
                return;
            }

            if (that.isLocal) {
                response = that.getSuggestionsLocal(q, showAll);
            } else {
                if ($.isFunction(serviceUrl)) {
                    serviceUrl = serviceUrl.call(that.element, q);
                }
                cacheKey = serviceUrl + '?' + $.param(params || {});
                response = that.cachedResponse[cacheKey];
            }

            if (response && $.isArray(response.suggestions)) {
                that.suggestions = response.suggestions;
                that.suggest(showAll);
                options.onSearchComplete.call(that.element, q, response.suggestions);
            } else if (!that.isBadQuery(q)) {
                that.abortAjax();

                ajaxSettings = {
                    url: serviceUrl,
                    data: params,
                    type: options.type,
                    dataType: options.dataType
                };

                $.extend(ajaxSettings, options.ajaxSettings);

                that.currentRequest = $.ajax(ajaxSettings).done(function (data) {
                    var result;
                    that.currentRequest = null;
                    result = options.transformResult(data, q);
                    that.processResponse(result, q, cacheKey);
                    options.onSearchComplete.call(that.element, q, result.suggestions);
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    options.onSearchError.call(that.element, q, jqXHR, textStatus, errorThrown);
                });
            } else {
                options.onSearchComplete.call(that.element, q, []);
            }
        },

        isBadQuery: function (q) {
            if (!this.options.preventBadQueries){
                return false;
            }

            var badQueries = this.badQueries,
                i = badQueries.length;

            while (i--) {
                if (q.indexOf(badQueries[i]) === 0) {
                    return true;
                }
            }

            return false;
        },

        hide: function () {
            var that = this,
                container = $(that.suggestionsContainer);

            if ($.isFunction(that.options.onHide) && that.visible) {
                that.options.onHide.call(that.element, container);
            }

            if( that.options.alwaysShow ) {
                return;
            }

            that.visible = false;
            that.selectedIndex = -1;
            clearInterval(that.onChangeInterval);
            $(that.suggestionsContainer).hide();
            that.signalHint(null);
        },

        suggest: function (showAll) {
            if (this.suggestions.length === 0) {
                if (this.options.showNoSuggestionNotice || that.options.showNoDataNotice) {
                    this.noSuggestions();
                } else {
                    this.hide();
                }
                return;
            }

            var that = this,
                options = that.options,
                groupBy = options.groupBy,
                formatResult = options.formatResult,
                formattedResult = '',
                value = that.getQuery(that.currentValue),
                className = that.classes.suggestion,
                classSelected = that.classes.selected,
                classLastSelected = that.classes.lastSelected,
                suggestionClasses = '',
                container = $(that.suggestionsContainer),
                noSuggestionsContainer = $(that.noSuggestionsContainer),
                noDataContainer = $(that.noDataContainer),
                beforeRender = options.beforeRender,
                html = '',
                category,
                formatGroup = function (suggestion, index) {
                    var currentCategory = suggestion.data[groupBy];

                    if (category === currentCategory){
                        return '';
                    }

                    category = currentCategory;

                    return '<div class="autocomplete-group"><strong>' + category + '</strong></div>';
                },
                suggestionsCount = that.suggestions.length,
                listPaddingStyle = "",
                currentListWidth = 0,
                contentHeight = that.options.listPaddingTop+that.options.listPaddingBottom;
            if (options.triggerSelectOnValidInput && that.isExactMatch(value)) {
                that.select(0);
                return;
            }

            // Build suggestions inner HTML:
            $.each(that.suggestions, function (i, suggestion) {
                if (groupBy){
                    html += formatGroup(suggestion, value, i);
                }

                formattedResult = formatResult(suggestion, (showAll?'':value), options.flipHighlighting);

                suggestionClasses = className;

                if( that.options.preserveLastSelected && suggestion.value == that.lastSelected ){
                    suggestionClasses += ' ' + classLastSelected;
                    that.selectedIndex = that.lastSelectedIndex = i;
                } else if( that.options.preserveLastHovered && suggestion.value == that.lastHovered ){
                    suggestionClasses += ' ' + classSelected;
                    that.selectedIndex = that.lastHoveredIndex = i;
                }

                listPaddingStyle = "";
                if(i == 0 && that.options.listPaddingTop) {
                    listPaddingStyle = 'style="margin-top:'+that.options.listPaddingTop+'px"'
                } else if( i == suggestionsCount-1 && that.options.listPaddingBottom ) {
                    listPaddingStyle = 'style="margin-bottom:'+that.options.listPaddingBottom+'px"'
                }


                if( $.isFunction(that.options.formatItem) ) {
                    html += '<div '+listPaddingStyle+' class="' + suggestionClasses + '" data-index="' + i + '">' +
                            that.options.formatItem.call(that.element, formattedResult, suggestion) +
                            '</div>';
                } else {
                    html += '<div '+listPaddingStyle+' class="' + suggestionClasses + '" data-index="' + i + '">' + formattedResult + '</div>';
                }

                if( that.options.width === 'auto' && !that.listWidthCalculated) {

                    if( $.isFunction(that.options.calculateWidth) ) {
                        currentListWidth = that.options.calculateWidth.call(that.element, formattedResult, suggestion);
                    } else {
                        currentListWidth = Autocomplete.getHtmlWidth('<div class="autocomplete-suggestions"><div class="' + suggestionClasses + '">'+ formattedResult + '</div></div>');
                    }

                    if (currentListWidth > that.listWidth ) {
                        that.listWidth = currentListWidth;
                    }
                }

            });
            if( that.options.width === 'auto') {
                that.listWidthCalculated = true;
            }
            this.adjustContainerWidth();

            noSuggestionsContainer.detach();

            if (that.options.useCustomScroller) {
                container.html('<div class="'+that.classes.nano+'"><div class="'+that.classes.nanoContent+'">'+html+'</div></div>');
                container.css('overflow','hidden');

                if( that.options.width === 'auto' ) {
                    if( that.options.minWidth && that.listWidth < that.options.minWidth) {
                        container.css('width',that.options.minWidth);
                    } else if( that.options.maxWidth && that.listWidth > that.options.maxWidth) {
                        container.css('width',that.options.maxWidth);
                    } else {
                        container.css('width',that.listWidth);
                    }
                }
            } else {
                container.html(html);
            }

            if ($.isFunction(beforeRender)) {
                beforeRender.call(that.element, container);
            }

            that.fixPosition();
            container.show();

            if (that.options.useCustomScroller) {
                container.closest('.dropdown-menu, .uib-dropdown-menu').css('display', 'block');
                setTimeout(function () {
                  container.find('.'+that.classes.suggestion).each(function(){
                    contentHeight += $(this).outerHeight();
                  });
                  container.closest('.dropdown-menu, .uib-dropdown-menu').css('display', '');

                  if( contentHeight < that.options.maxHeight ) {
                    container.css('height', contentHeight);
                  } else {
                    container.css('height', that.options.maxHeight);
                  }
                  that.scrollElement = container.find("."+that.classes.nano).nanoScroller({flashDelay: 1000, tabIndex: -1});
                }, 0);
            }

            if( that.options.preserveLastSelected && that.lastSelectedIndex !== -1 && (value == '' || showAll ) ) {
                that.adjustScroll(that.lastSelectedIndex, false);
            } else if( that.options.preserveLastHovered && that.lastHoveredIndex !== -1 && (value == '' || showAll ) ) {
                that.adjustScroll(that.lastHoveredIndex, false);
            }

            // Select first value by default:
            if (options.autoSelectFirst) {
                that.selectedIndex = 0;
                container.scrollTop(0);
                container.children('.' + className).first().addClass(classSelected);
            }

            that.visible = true;
            that.findBestHint();
        },

        noSuggestions: function() {
             var that = this,
                 container = $(that.suggestionsContainer),
                 noSuggestionsContainer = that.noDataAvailable?$(that.noDataContainer): $(that.noSuggestionsContainer);

            this.adjustContainerWidth();

            // Some explicit steps. Be careful here as it easy to get
            // noSuggestionsContainer removed from DOM if not detached properly.
            noSuggestionsContainer.detach();
            container.empty(); // clean suggestions if any
            container.append(noSuggestionsContainer);

            that.fixPosition();

            container.show();
            container.css('height', noSuggestionsContainer.outerHeight());

            that.visible = true;
        },

        adjustContainerWidth: function() {
            var that = this,
                options = that.options,
                width,
                container = $(that.suggestionsContainer);

            // If width is auto, adjust width before displaying suggestions,
            // because if instance was created before input had width, it will be zero.
            // Also it adjusts if input width has changed.
            // -2px to account for suggestions border.
            // if (options.width === 'auto') {
            //     width = that.el.outerWidth() - 2;
            //     container.width(width > 0 ? width : 300);
            // }
        },

        findBestHint: function () {
            var that = this,
                value = that.el.val().toLowerCase(),
                bestMatch = null;

            if (!value) {
                return;
            }

            $.each(that.suggestions, function (i, suggestion) {
                var foundMatch = suggestion.value.toLowerCase().indexOf(value) === 0;
                if (foundMatch) {
                    bestMatch = suggestion;
                }
                return !foundMatch;
            });

            that.signalHint(bestMatch);
        },

        signalHint: function (suggestion) {
            var hintValue = '',
                that = this;
            if (suggestion) {
                hintValue = that.currentValue + suggestion.value.substr(that.currentValue.length);
            }
            if (that.hintValue !== hintValue) {
                that.hintValue = hintValue;
                that.hint = suggestion;
                (this.options.onHint || $.noop)(hintValue);
            }
        },

        verifySuggestionsFormat: function (suggestions) {
            // If suggestions is string array, convert them to supported format:
            if (suggestions.length && typeof suggestions[0] === 'string') {
                return $.map(suggestions, function (value) {
                    return { value: value, data: null };
                });
            }

            return suggestions;
        },

        validateOrientation: function(orientation, fallback) {
            orientation = $.trim(orientation || '').toLowerCase();

            if($.inArray(orientation, ['auto', 'bottom', 'top']) === -1){
                orientation = fallback;
            }

            return orientation;
        },

        processResponse: function (result, originalQuery, cacheKey) {
            var that = this,
                options = that.options;

            result.suggestions = that.verifySuggestionsFormat(result.suggestions);

            // Cache results if cache is not disabled:
            if (!options.noCache) {
                that.cachedResponse[cacheKey] = result;
                if (options.preventBadQueries && result.suggestions.length === 0) {
                    that.badQueries.push(originalQuery);
                }
            }

            // Return if originalQuery is not matching current query:
            if (originalQuery !== that.getQuery(that.currentValue)) {
                return;
            }

            that.suggestions = result.suggestions;
            that.suggest();
        },

        activate: function (index) {
            var that = this,
                activeItem,
                selected = that.classes.selected;

            $(that.suggestionsContainer).find('.' + selected).removeClass(selected);

            that.selectedIndex = index;
            that.lastHoveredIndex = index;
            that.lastHovered = that.suggestions[that.selectedIndex].value;

            activeItem = that.getItemBySelectedIndex();

            if( activeItem ) {
                $(activeItem).addClass(selected);

                if ($.isFunction(that.options.onChangeSelect)) {
                    that.options.onChangeSelect.call(that.element, that.suggestions[that.selectedIndex]);
                }

                return activeItem;
            }

            return null;
        },
        getItemBySelectedIndex: function() {
            var that = this,
            items = $(that.suggestionsContainer).find('.' + that.classes.suggestion),
            activeItem;

            if (that.selectedIndex !== -1 && items.length > that.selectedIndex) {
                activeItem = items.get(that.selectedIndex);
                return activeItem;
            }
            return null;
        },

        selectHint: function () {
            var that = this,
                i = $.inArray(that.hint, that.suggestions);

            that.select(i);
        },

        select: function (i) {
            var that = this;
            that.hide();
            that.onSelect(i);
        },

        moveUp: function () {
            var that = this;

            if (that.selectedIndex === -1) {
                return;
            }

            if (that.selectedIndex === 0) {
                $(that.suggestionsContainer).children().first().removeClass(that.classes.selected);
                that.selectedIndex = -1;
                that.el.val(that.currentValue);
                that.findBestHint();
                return;
            }

            that.adjustScroll(that.selectedIndex - 1, true);
        },

        moveDown: function () {
            var that = this;

            if (that.selectedIndex === (that.suggestions.length - 1)) {
                return;
            }

            that.adjustScroll(that.selectedIndex + 1, true);
        },

        adjustScroll: function (index, activate, animate) {
            var that = this,
                activeItem;

            if( that.lastSelectedScrollTop ) {
                that.scrollElement.nanoScroller({scrollTop: that.lastSelectedScrollTop});
                that.lastSelectedScrollTop = 0;
                activate = false;
                animate = true;
            }

            if(activate) {
                activeItem = that.activate(index);
            } else {
                activeItem = $(that.suggestionsContainer).find('.' + that.classes.suggestion).get(index);
            }

            if (!activeItem) {
                return;
            }

            var offsetTop,
                upperBound,
                lowerBound,
                heightDelta = $(activeItem).outerHeight();

            offsetTop = activeItem.offsetTop;

            if (that.options.useCustomScroller) {
                upperBound = $(that.suggestionsContainer).find('.'+that.classes.nanoContent).scrollTop();
            } else {
                upperBound = $(that.suggestionsContainer).scrollTop();
            }

            lowerBound = upperBound + that.options.maxHeight - heightDelta;

            if ((offsetTop+that.options.listPaddingTop) < (upperBound+20)) {

                offsetTop -= that.options.listPaddingTop;
                if (that.options.useCustomScroller) {
                    if( animate ) {
                        that.scrollElement.find('.'+that.classes.nanoContent).stop().animate({
                            'scrollTop': offsetTop
                        }, 100, 'swing');
                    } else {
                        that.scrollElement.nanoScroller({ scrollTop: offsetTop, flash: true});
                    }

                    that.scrollElement.nanoScroller({flash: true});
                } else {
                    $(that.suggestionsContainer).scrollTop(offsetTop);
                }

            } else if ((offsetTop+that.options.listPaddingBottom) > lowerBound) {

                offsetTop += that.options.listPaddingTop;
                if (that.options.useCustomScroller) {
                    if(animate) {
                        that.scrollElement.find('.'+that.classes.nanoContent).stop().animate({
                            'scrollTop': offsetTop - that.options.maxHeight + heightDelta
                        }, 100, 'swing');
                    } else {
                        that.scrollElement.nanoScroller({ scrollTop: offsetTop - that.options.maxHeight + heightDelta,flash: true});
                    }

                    that.scrollElement.nanoScroller({flash: true});
                } else {
                    $(that.suggestionsContainer).scrollTop(offsetTop - that.options.maxHeight + heightDelta);
                }
            }

            if(activate) {
                if (!that.options.preserveInput) {
                    that.el.val(that.getValue(that.suggestions[index].value));
                }
                that.signalHint(null);
            }
        },

        onSelect: function (index) {
            var that = this,
                onSelectCallback = that.options.onSelect,
                suggestion = that.suggestions[index],
                lastSelected = that.classes.lastSelected,
                activeItem = that.getItemBySelectedIndex();

            that.currentValue = that.getValue(suggestion.value);
            that.lastSelected = that.currentValue;
            if (that.options.useCustomScroller) {
              that.lastSelectedScrollTop = that.scrollElement.find('.'+that.classes.nanoContent).scrollTop();
            } else {
              $(that.suggestionsContainer).scrollTop();
            }

            $(that.suggestionsContainer).find('.' + lastSelected).removeClass(lastSelected);
            $(activeItem).addClass(lastSelected);

            if (that.currentValue !== that.el.val() /*&& !that.options.preserveInput*/) {
                that.el.val(that.currentValue);
            }

            that.signalHint(null);
            if( !that.options.alwaysShow ) {
                that.suggestions = [];
            }

            that.selection = suggestion;

            if ($.isFunction(onSelectCallback)) {
                onSelectCallback.call(that.element, suggestion);
            }
        },

        getValue: function (value) {
            var that = this,
                delimiter = that.options.delimiter,
                currentValue,
                parts;

            if (!delimiter) {
                return value;
            }

            currentValue = that.currentValue;
            parts = currentValue.split(delimiter);

            if (parts.length === 1) {
                return value;
            }

            return currentValue.substr(0, currentValue.length - parts[parts.length - 1].length) + value;
        },

        dispose: function () {
            var that = this;
            that.el.off('.autocomplete').removeData('autocomplete');
            that.disableKillerFn();
            $(window).off('resize.autocomplete', that.fixPositionCapture);
            $(that.suggestionsContainer).remove();
        },

        resetSelection: function() {
            var that = this;
            that.lastHoveredIndex = -1;
            that.lastSelectedIndex = -1;
            that.lastSelectedIndex = -1;
            that.lastSelected = '';

            //$(that.suggestionsContainer).find('.' + that.classes.selected).removeClass(that.classes.selected);
            $(that.suggestionsContainer).find('.' + that.classes.lastSelected).removeClass(that.classes.lastSelected);
        }
    };

    // Create chainable jQuery plugin:
    $.fn.autocomplete = $.fn.devbridgeAutocomplete = function (options, args) {
        var dataKey = 'autocomplete';
        // If function invoked without argument return
        // instance of the first matched element:
        if (arguments.length === 0) {
            return this.first().data(dataKey);
        }

        return this.each(function () {
            var inputElement = $(this),
                instance = inputElement.data(dataKey);

            if (typeof options === 'string') {
                if (instance && typeof instance[options] === 'function') {
                    instance[options](args);
                }
            } else {
                // If instance already exists, destroy it:
                if (instance && instance.dispose) {
                    instance.dispose();
                }
                instance = new Autocomplete(this, options);
                inputElement.data(dataKey, instance);
            }
        });
    };
}));
