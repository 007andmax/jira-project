/*
 * jWindowCrop v1.0.0
 *
 * Copyright (c) 2012 Tyler Brown
 * Licensed under the MIT license.
 *
 */

(function ($) {
  function fillContainer(val, targetLength, containerLength) {

    if (targetLength <= containerLength) {
      if (val + targetLength < containerLength - (244 - targetLength)) {
        val = containerLength - 244;
      }
      if (val > 244 - targetLength) {
        val = 244 - targetLength;
      }
    } else {
      if (val + targetLength < containerLength) val = containerLength - targetLength;
      if (val > 0) val = 0;
    }

    return val;
  }

  $.jWindowCrop = function (container, options) {
    var base = this;
    var startZoom = 0;

    base.$container = $(container); // target container jquery element
    base.container = container; // target container dom element
    base.$container.data("jWindowCrop", base); // target frame jquery element

    base.namespace = 'jWindowCrop';
    base.originalWidth = 0;
    base.isDragging = false;

    base.init = function () {

      base.$container.addClass('jwc_container').css({'margin': '0px auto', 'overflow': 'hidden'});

      // extend default optoins with user specified options
      base.options = $.extend({}, $.jWindowCrop.defaultOptions, options);
      if (base.options.zoomSteps < 2) base.options.zoomSteps = 2;

      // setup html elements
      base.$container.append('<div class="jwc_outer">');
      base.$outer = base.$container.children(':first');
      base.$outer.append('<div class="jwc_middle">');
      base.$middle = base.$outer.children(':first');
      base.$middle.append('<div class="jwc_frame" />');
      base.$frame = base.$middle.children(':first');
      base.$frame.append('<img class="jwc_image" src="' + base.options.imageSource + '" alt="" style="display:none">'); // hide image until loaded
      base.$image = base.$frame.children(':first');

      base.$frame.append('<div class="jwc_loader">' + base.options.loadingText + '</div>');
      base.$frame.append('<div class="jwc_controls" style="display:' + (base.options.showControlsOnStart ? 'block' : 'none') + ';"><span>click to drag</span><a href="#" class="jwc_zoom_in"></a><a href="#" class="jwc_zoom_out"></a></div>');
      base.$frame.css({
        'position': 'relative',
        'width': base.options.cropBoxWidth,
        'height': base.options.cropBoxHeight
      });
      base.$image.css({'position': 'absolute', 'top': '0px', 'left': '0px'});
      base.$frame.append('<div class="jwc_cropbox" style="width:' + (base.options.cropBoxWidth) + 'px; height:' + (base.options.cropBoxHeight) + 'px;"></div>');
      base.$cropbox = base.$frame.find('.jwc_cropbox');

      // setup external controls
      base.$rangeSelect = base.options.rangeSelectElement == '' ? null : $(base.options.rangeSelectElement);
      base.$rangeIncrease = base.options.rangeIncrease == '' ? null : $(base.options.rangeIncreaseElement);
      base.$rangeDecrease = base.options.rangeDecrease == '' ? null : $(base.options.rangeDecreaseElement);

      initializeDimensions();

      // setup external controls handlers
      if (base.$rangeSelect.length) {
        base.$rangeSelect.on('input.' + base.namespace, handleRangeSelect);

        base.rangeIncreaseInterval = 1;
        base.rangedecreaseInterval = 1;

        if (base.$rangeIncrease.length) {
          base.$rangeIncrease.on('click.' + base.namespace, handleRangeIncrease);
          base.$rangeIncrease.on('mousedown.' + base.namespace, function () {
            base.rangeIncreaseInterval = setInterval(handleRangeIncrease, 100);
          });
          base.$rangeIncrease.on('mouseup.' + base.namespace + ' mouseleave.' + base.namespace, function () {
            clearInterval(base.rangeIncreaseInterval);
          });
        }
        if (base.$rangeDecrease.length) {
          base.$rangeDecrease.on('click.' + base.namespace, handleRangeDecrease);
          base.$rangeDecrease.on('mousedown.' + base.namespace, function () {
            base.rangeDecreaseInterval = setInterval(handleRangeDecrease, 100);
          });
          base.$rangeDecrease.on('mouseup.' + base.namespace + ' mouseleave.' + base.namespace, function () {
            clearInterval(base.rangeDecreaseInterval);
          });
        }
      }

      // setup mourewheel and drag handlers
      base.$frame.find('.jwc_zoom_in').on('click.' + base.namespace, base.zoomIn);
      base.$frame.find('.jwc_zoom_out').on('click.' + base.namespace, base.zoomOut);
      base.$container.bind('wheel.' + base.namespace + ' mousewheel.' + base.namespace, handleMouseWheel);

      base.$frame.on('mouseenter.' + base.namespace, handleMouseEnter);
      base.$frame.on('mouseleave.' + base.namespace, handleMouseLeave);
      base.$image.on('load.' + base.namespace, handeImageLoad);
      base.$cropbox.on('mousedown.' + base.namespace + ' touchstart.' + base.namespace, handleMouseDown);
      base.$image.on('mousedown.' + base.namespace + ' touchstart.' + base.namespace, handleMouseDown);
      $(document).on('mousemove.' + base.namespace + ' touchmove.' + base.namespace, handleMouseMove);
      $(document).on('mouseup.' + base.namespace + ' touchend.' + base.namespace, handleMouseUp);
    };

    base.destroy = function () {
      base.$image.removeData("jWindowCrop"); // remove data
      $(document).unbind(); // remove body binds
      base.$image.unbind(); // remove image binds
      base.$frame.unbind(); // remove frame binds
      base.$frame.find('.jwc_zoom_out').unbind(); // remove zoom triggers
      base.$frame.find('.jwc_zoom_in').unbind();  // remove zoom triggers
      $('.jwc_loader').remove();   // remove the added text
      $('.jwc_controls').remove(); // remove the added controls
      base.$image.removeAttr('style'); // undo the style
      base.$image.unwrap(); // undo the wrap
    };

    base.setZoom = function (percent) {
      // limit zoom to bounds
      if (percent >= base.options.maxZoom) {
        percent = base.options.maxZoom;
      } else if (percent < base.minPercent) {
        percent = base.minPercent;
      }
      // set zoom on image
      base.$image.width(Math.round(base.originalWidth * percent));
      base.workingPercent = percent;
      focusOnCenter();
      updateResult();
    };
    base.zoomIn = function () {
      var zoomIncrement = (1.0 - base.minPercent) / (base.options.zoomSteps - 1);
      base.setZoom(base.workingPercent + zoomIncrement);
      return false;
    };
    base.zoomOut = function () {
      var zoomIncrement = (1.0 - base.minPercent) / (base.options.zoomSteps - 1);
      base.setZoom(base.workingPercent - zoomIncrement);
      return false;
    };

    function initializeDimensions() {
      if (base.originalWidth == 0) {
        base.originalWidth = base.$image.width();
        base.originalHeight = base.$image.height();
      }
      if (base.originalWidth > 0) {
        // calculate minimum zoom based on image and cropbox dimensions
        var widthRatio = base.options.cropBoxWidth / base.originalWidth;
        var heightRatio = base.options.cropBoxHeight / base.originalHeight;
        //base.minPercent = (widthRatio >= heightRatio) ? widthRatio : heightRatio;
        if (widthRatio >= heightRatio) {
          base.minPercent = (base.originalWidth < base.options.cropBoxWidth) ? (base.options.cropBoxWidth / base.originalWidth) : widthRatio;
        }

        if (base.options.startWith != null) {
          startZoom = base.options.cropBoxWidth / base.options.startWith.w;
          base.focalPoint = {
            'x': base.options.startWith.x + Math.floor(parseInt(base.options.cropBoxWidth / startZoom) / 2),
            'y': base.options.startWith.y + Math.ceil(parseInt(base.options.cropBoxHeight / startZoom) / 2)
          };
          base.focalPoint = {
            'x': base.options.startWith.x + Math.round(base.options.startWith.w / 2),
            'y': base.options.startWith.y + Math.round(base.options.startWith.h / 2)
          };
        } else {
          base.focalPoint = {'x': Math.round(base.originalWidth / 2), 'y': Math.round(base.originalHeight / 2)};
        }

        var minCropBoxSize = base.options.cropBoxHeight < base.options.cropBoxWidth ? base.options.cropBoxHeight : base.options.cropBoxWidth;
        var maxOriginSize = base.originalHeight < base.originalWidth ? base.originalWidth : base.originalHeight;

        startZoom = minCropBoxSize / maxOriginSize;

        base.setZoom(startZoom);
        base.$image.fadeIn('fast'); //display image now that it has loaded
      }
      if (base.$rangeSelect.length) base.$rangeSelect.prop({
        'min': Math.floor(startZoom * 100),
        'max': Math.ceil((startZoom + 1) * 100)
      }).val(Math.floor(startZoom * 100));
    }

    function storeFocalPoint() {
      var x = (parseInt(base.$image.css('left')) * -1 + base.options.cropBoxWidth / 2) / base.workingPercent;
      var y = (parseInt(base.$image.css('top')) * -1 + base.options.cropBoxHeight / 2) / base.workingPercent;
      base.focalPoint = {'x': Math.round(x), 'y': Math.round(y)};
    }

    function focusOnCenter() {
      var left = fillContainer((Math.round((base.focalPoint.x * base.workingPercent) - base.options.cropBoxWidth / 2) * -1), base.$image.width(), base.options.cropBoxWidth);
      var top = fillContainer((Math.round((base.focalPoint.y * base.workingPercent) - base.options.cropBoxHeight / 2) * -1), base.$image.height(), base.options.cropBoxHeight);
      base.$image.css({'left': (left.toString() + 'px'), 'top': (top.toString() + 'px')})
      storeFocalPoint();
    }

    function updateResult() {
      base.result = {
        cropX: Math.floor(parseInt(base.$image.css('left')) / base.workingPercent * -1),
        cropY: Math.floor(parseInt(base.$image.css('top')) / base.workingPercent * -1),
        cropW: Math.round(base.options.cropBoxWidth / base.workingPercent),
        cropH: Math.round(base.options.cropBoxHeight / base.workingPercent),
        sizeW: base.options.cropBoxWidth,
        sizeH: base.options.cropBoxHeight,
        mustStretch: (base.workingPercent > 1)
      };
      base.options.onChange.call(base.container, base.result);
    }

    function handeImageLoad() {
      base.options.onImageLoad.call(base.container);
      initializeDimensions();
    }

    function handleMouseDown(event) {
      event.preventDefault(); //some browsers do image dragging themselves
      base.isDragging = true;
      base.dragMouseCoords = {
        x: event.pageX || event.originalEvent.touches[0].pageX,
        y: event.pageY || event.originalEvent.touches[0].pageY
      };
      base.dragImageCoords = {x: parseInt(base.$image.css('left')), y: parseInt(base.$image.css('top'))}
    }

    function handleMouseUp() {
      base.isDragging = false;
    }

    function handleMouseMove(event) {
      if (base.isDragging) {
        var xDif = (event.pageX || event.originalEvent.touches[0].pageX) - base.dragMouseCoords.x;
        var yDif = (event.pageY || event.originalEvent.touches[0].pageY) - base.dragMouseCoords.y;
        var newLeft = fillContainer((base.dragImageCoords.x + xDif), base.$image.width() - 1, base.options.cropBoxWidth);
        var newTop = fillContainer((base.dragImageCoords.y + yDif), base.$image.height() - 1, base.options.cropBoxHeight);
        base.$image.css({'left': (newLeft.toString() + 'px'), 'top': (newTop.toString() + 'px')});
        storeFocalPoint();
        updateResult();
      }
    }

    function handleMouseEnter() {
      if (base.options.smartControls) base.$frame.find('.jwc_controls').fadeIn('fast');
    }

    function handleMouseLeave() {
      if (base.options.smartControls) base.$frame.find('.jwc_controls').fadeOut('fast');
    }

    function handleRangeSelect() {
      base.setZoom($(this).val() / 100 > startZoom ? $(this).val() / 100 : startZoom);
    }

    function handleRangeIncrease() {
      base.$rangeSelect.val(parseInt(base.$rangeSelect.val()) + 4).trigger('input.' + base.namespace);
    }

    function handleRangeDecrease() {
      base.$rangeSelect.val(parseInt(base.$rangeSelect.val()) - 4).trigger('input.' + base.namespace);
    }

    function handleMouseWheel(e) {
      var delta, rangeSelectChange, zoomIncrement;

      if (e.originalEvent.wheelDelta !== undefined) delta = e.originalEvent.wheelDelta;
      else delta = e.originalEvent.deltaY * -1;

      if (delta > 0) {
        rangeSelectChange = 2;
        zoomIncrement = 2;
      }
      else {
        rangeSelectChange = -2;
        zoomIncrement = -2;
      }
      if (base.$rangeSelect.length) base.$rangeSelect.val(parseInt(base.$rangeSelect.val()) + rangeSelectChange).trigger('input.' + base.namespace);
      else base.setZoom(base.workingPercent + (zoomIncrement / 100));
      e.preventDefault();
    }

    base.init();
  };

  $.jWindowCrop.defaultOptions = {
    cropBoxWidth: 100,
    cropBoxHeight: 100,
    maxZoom: 1,
    zoomSteps: 50,
    imageSource: '',
    loadingText: 'Loading...',
    smartControls: false,
    showControlsOnStart: false,
    rangeSelectElement: '',
    rangeIncreaseElement: '',
    rangeDecreaseElement: '',

    startWith: null,
    onImageLoad: function () {
    },
    onChange: function () {
    }
  };

  $.fn.jWindowCrop = function (options) {
    return this.each(function () {
      (new $.jWindowCrop(this, options));
    });
  };

  $.fn.getjWindowCrop = function () {
    return this.data("jWindowCrop");
  };
})(jQuery);
