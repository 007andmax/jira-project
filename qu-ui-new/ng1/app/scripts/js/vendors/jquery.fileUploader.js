(function ($) {
  // global functions

  $.fileUploader = function (container, options) {
    var base = this;

    base.$container = $(container); // target container jquery element
    base.container = container; // target container dom element
    base.$container.data("fileUploader", base); // target frame jquery element

    base.namespace = 'fileUploader';

    base.init = function () {

      // check if XHR2 is available
      base.xhr = new XMLHttpRequest();
      if (!base.xhr.upload) {
        return base.cancelUpload(base.options.messages.uploadNotSupported);
      }

      // extend default optoins with user specified options
      base.options = $.extend({}, $.fileUploader.defaultOptions, options);

      // setup html elements
      base.$container.append('<input type="file" class="upload_file_input" accept="' + base.options.accpetType + '" style="display:none" />');
      base.$inputFile = base.$container.children('input[type="file"]');
      base.inputFile = base.$inputFile[0];

      // handle file select
      base.inputFile.addEventListener("change", FileSelectHandler, false);

      // handle file drop
      base.container.addEventListener("dragover", FileDragHover, false);
      base.container.addEventListener("dragleave", FileDragHover, false);
      base.container.addEventListener("drop", FileSelectHandler, false);
      base.container.addEventListener("click", function () {
        base.$inputFile.click()
      }, false);
      base.container.style.display = "block";
    };

    base.destroy = function () {
      base.$container.removeData("fileUploader"); // remove data
    };

    base.validateFileExtensions = function (file) {
      if (base.options.allowedExtensions.length) {
        if (file.name.indexOf('.') == -1 || base.options.allowedExtensions.indexOf(file.name.split('.').pop()) == -1) {
          return base.cancelUpload(base.options.messages.extensionNotAllowed);
        }
      }
      base.validateFileSize(file);
    }

    base.validateFileSize = function (file) {
      if (base.options.maxUploadSize > 0) {
        if (file.size > base.options.maxUploadSize) {
          return base.cancelUpload(base.options.messages.fileSizeExceeded);
        }
      }

      // initiate validateImageDimensions if needed
      if (base.options.minImageWidth > 0 || base.options.minImageHeight > 0) {
        return base.validateImageDimensions(file);
      }

      base.startUpload(file);
    }

    base.validateImageDimensions = function (file) {
      // load image and parse dimensions
      var reader = new FileReader();
      reader.onload = function (evt) {
        var image = new Image();
        image.onload = function (evt) {
          var width = this.width;
          var height = this.height;

          // validate dimensions
          if (width < base.options.minImageWidth || height < base.options.minImageHeight) {
            return base.cancelUpload(base.options.messages.minDimensionsError);
          }
          base.startUpload(file);
        };
        image.src = evt.target.result;
      };
      reader.readAsDataURL(file);
    }

    base.cancelUpload = function (message) {
      base.options.onFailure.call(base.container, message);
    }

    base.startUpload = function (file) {

      // trigger callback for starting upload
      base.options.onStart.call(base.container);

      var fd = new FormData();
      if (base.xhr.upload) {

        // progress bar
        base.xhr.upload.addEventListener("progress", function (e) {
          base.options.onProgress.call(base.container, parseInt(e.loaded / e.total * 100));
        }, false);

        // file received/failed
        base.xhr.onreadystatechange = function (e) {
          if (base.xhr.readyState == 4) {
            if (base.xhr.status == 200) {
              base.options.onSuccess.call(base.container, $.parseJSON(base.xhr.response));
            } else {
              base.options.onFailure.call(base.container, 'Uploading failed');
            }
          }

          //load file more than once
          base.inputFile.value = '';
        };

        // start upload
        base.xhr.open("POST", base.options.uploadUrl, true);
        fd.append(base.options.uploadName, file);
        base.xhr.send(fd);

      }
    }

    // file drag hover
    function FileDragHover(e) {
      e.stopPropagation();
      e.preventDefault();
      e.target.className = (e.type == "dragover" ? "hover" : "");
    }

    // file selection
    function FileSelectHandler(e) {
      // cancel event and hover styling
      FileDragHover(e);

      // trigger callback for selection
      base.options.onSelect.call(base.container);

      // fetch FileList object
      var file = (e.target.files && e.target.files[0]) || e.dataTransfer.files[0];

      // process all File objects
      base.validateFileExtensions(file);
    }

    base.init();
  };

  $.fileUploader.defaultOptions = {
    uploadUrl: '',
    uploadName: 'uploaded_file',
    maxUploadSize: 4 * 1024 * 1024,
    accpetType: '',
    allowedExtensions: [],
    minImageWidth: 244,
    minImageHeight: 244,
    messages: {
      uploadNotSupported: 'Uploading not supported in this browser',
      extensionNotAllowed: 'Selected file type is not allowed',
      fileSizeExceeded: 'File size is larger than allowed size',
      minDimensionsError: 'Image dimensions are smaller than allowed minimum dimensions'
    },
    onSelect: function () {
    },
    onStart: function () {
    },
    onProgress: function () {
    },
    onSuccess: function () {
    },
    onFailure: function () {
    }
  };

  $.fn.fileUploader = function (options) {
    return this.each(function () {
      (new $.fileUploader(this, options));
    });
  };

  $.fn.getfileUploader = function () {
    return this.data("fileUploader");
  };
})(jQuery);
