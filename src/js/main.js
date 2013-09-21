forge.logging.info("Added js/main.js!");
// Constants used for configuration
var config = {
  parseAppId: '<AppId>',
  parseRestKey: '<RestKey>',
  streamName: 'alyssa'
};

// Create an SMS with default message
var sendSMS = function() {
  forge.sms.send({
    body: "Hello, World!",
    to: ["88888888"]
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
      currentTap = true;
      e.stopPropagation();
    });
    $('*').on('touchmove', function (e) {
      currentTap = false;
    });
    $('*').on('touchend', function (e) {
      if (currentTap) {
        $(e.currentTarget).trigger('tap');
      }
      e.stopPropagation();
    });
  } else {
    forge.logging.info("clickEvent is: " + clickEvent);
  }

  new FastButton(document.getElementById('#send-sms'), sendSMS);

  $('#send-sms').bind(clickEvent, sendSMS);
  $('#upload-photo').bind(clickEvent, capturePhoto);
  getPhotos();
  forge.event.messagePushed.addListener(function (msg) {
    alert("AQ Parse says: " + msg.alert);
  });
});
