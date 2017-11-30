const {desktopCapturer} = require('electron');
let desktopSharing = false;
let localStream;
let source;


function selectSource() {
  desktopCapturer.getSources({ types:['screen'] }, function(error, sources) {
      source = sources[0];
  });

}

function toggle() {
  if (!desktopSharing) {
    onAccessApproved(source.id);
  } else {
    desktopSharing = false;

    if (localStream)
      localStream.getTracks()[0].stop();
    localStream = null;

    document.querySelector('button').innerHTML = "Enable Capture";
  }
}

function onAccessApproved(desktop_id) {
  if (!desktop_id) {
    console.log('Desktop Capture access rejected.');
    return;
  }
  desktopSharing = true;
  document.querySelector('button').innerHTML = "Disable Capture";
  console.log("Desktop sharing started.. desktop_id:" + desktop_id);
  navigator.webkitGetUserMedia({
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: desktop_id,
        minWidth: 1280,
        maxWidth: 1280,
        minHeight: 720,
        maxHeight: 720
      }
    }
  }, gotStream, getUserMediaError);

  function gotStream(stream) {
    localStream = stream;
    document.querySelector('video').src = URL.createObjectURL(stream);
    makeScreenShot();
    stream.onended = function() {
      if (desktopSharing) {
        toggle();
      }
    };
  }

  function makeScreenShot() {
    console.log('beginscreen');
    let video = document.querySelector('video');
    let canvas = document.createElement('canvas');
    video.onloadedmetadata = function () {
      canvas.width = this.videoWidth;
      canvas.height = this.videoHeight;
      let ctx = canvas.getContext('2d');
      // Draw video on canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      let url = canvas.toDataURL('image/png');
      var data = url.replace(/^data:image\/\w+;base64,/, "");
      var buf = new Buffer(data, 'base64');
      require("fs").writeFile("out.png", buf, 'base64', function(err) {
        console.log(err);
      });
    }
  }

  function getUserMediaError(e) {
    console.log('getUserMediaError: ' + JSON.stringify(e, null, '---'));
  }
}

document.addEventListener("DOMContentLoaded", function(event) {
  selectSource();
});

document.querySelector('button').addEventListener('click', function(e) {
  toggle();
});
