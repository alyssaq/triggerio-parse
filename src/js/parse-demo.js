// Constants used for configuration
var config = {
  parseAppId: 'wmPoE4R7d53hyURxAF70Xt2EFj0IJGu1gv2pixtt',
  parseRestKey: 'OmQTFXOOAmCFPMiCtF2oMetMLZQSgPfggGbD30AT',
  streamName: 'alyssa'
};

// Step 1: Capture an image
var sendSMS = function() {
  forge.sms.send({
    body: "Hello, World!",
    to: ["83288147"]
  }, function () {
    alert("Message sent");
  });
};

// Step 1: Capture an image
var capturePhoto = function() {
  forge.file.getImage({width: 500, height: 500}, function (file) {
    forge.file.URL(file, 
      function (url) {
        $('#photo-container').prepend($('<img>').attr('src', url));
      }, function(err) {
        forge.logging.error("Could not get image file: " +err);
      });
    uploadPhotoFile(file);
  });
};

// Step 2: Upload the image file to Parse
var uploadPhotoFile = function(file) {
  forge.request.ajax({
    url: 'https://api.parse.com/1/files/' + (new Date()).getTime() + '.jpg',
    headers: {
      'X-Parse-Application-Id': config.parseAppId,
      'X-Parse-REST-API-Key': config.parseRestKey
    },
    type: 'POST',
    files: [file],
    fileUploadMethod: 'raw',
    dataType: 'json',

    success: function (data) {
      uploadPhotoMetadata(data);
    },
    error: function () {
      forge.logging.error("Problem uploading the photo");

      alert('Problem uploading the photo');
    }
  });
};

// Step 3: Upload image metadata to Parse
var uploadPhotoMetadata = function(data) {
  forge.request.ajax({
    url: 'https://api.parse.com/1/classes/Photo',
    headers: {
      'X-Parse-Application-Id': config.parseAppId,
      'X-Parse-REST-API-Key': config.parseRestKey
    },
    type: 'POST',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify({
      file: {
        '__type': 'File',
        name: data.name
      },
      stream: config.streamName
    }),
    success: function (file) {
      // Upload complete - do nothing
    },
    error: function () {
      forge.logging.error("Problem uploading the metadata");
      alert('Problem uploading the metadata');
    }
  });
};

// Get images from Parse
var getPhotos = function() {
  forge.request.ajax({
    url: 'https://api.parse.com/1/classes/Photo',
    headers: {
      'X-Parse-Application-Id': config.parseAppId,
      'X-Parse-REST-API-Key': config.parseRestKey
    },
    type: 'GET',
    dataType: 'json',
    data: {
      'where': '{"stream": "' + config.streamName + '"}',
      'order': '-createdAt'
    },
    success: function (data) {
      $('#photo-container').children().remove();
      data.results.forEach(function (photo) {
        $('#photo-container').append($('<img>').attr('src', photo.file.url));
      })
    },
    error: function () {
      alert('Problem reading photos');
    }
  });
};


$(document).ready(function() {
  // Setup 'sensible' click/touch handling
  var clickEvent = 'ontouchend' in document.documentElement ? 'tap' : 'click';
  if (clickEvent == 'tap') {
    forge.logging.info("clickEvent is tap");
    var currentTap = true;
    $('*').on('touchstart', function (e) {
      forge.logging.info("!!touchstart is tap");
      currentTap = true;
      e.stopPropagation();
    });
    $('*').on('touchmove', function (e) {
      forge.logging.info("!!touchmove is tap");
      currentTap = false;
    });
    $('*').on('touchend', function (e) {
      forge.logging.info("!!touchend is tap");
      if (currentTap) {
        $(e.currentTarget).trigger('tap');
      }
      e.stopPropagation();
    });
  } else {
    forge.logging.info("clickEvent is: " + clickEvent);
  }


  $('#upload-photo').bind(clickEvent, capturePhoto);
  getPhotos();
  $('#send-sms').bind(clickEvent, sendSMS);
  forge.event.messagePushed.addListener(function (msg) {
    alert("AQ Parse says: " + msg.alert);
  });
});