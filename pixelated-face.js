// Grab the canvas and video elements from webpage
// and initialize the canvas context

const webcamVideo = document.querySelector('.webcam');
const videoCanvas = document.querySelector('.video');
const ctxVideoCanvas = videoCanvas.getContext('2d');
const faceCanvas = document.querySelector('.face');
const ctxFaceCanvas = faceCanvas.getContext('2d');
const SIZE = 10;
const SCALE = 1.1;
// Create new face detector using Chrome API

const faceDetector = new FaceDetector();

// Write a function to populate video from facecam into page

async function getWebcamVideo() {
  const webcamStream = await navigator.mediaDevices.getUserMedia({
    video: { width: 640, height: 480 },
  });
  webcamVideo.srcObject = webcamStream;
  await webcamVideo.play();
  videoCanvas.width = webcamVideo.videoWidth;
  videoCanvas.height = webcamVideo.videoHeight;
  faceCanvas.width = webcamVideo.videoWidth;
  faceCanvas.height = webcamVideo.videoHeight;
}

async function detectFaces() {
  const faces = await faceDetector.detect(webcamVideo);
  requestAnimationFrame(detectFaces);
  faces.forEach(drawFace);
  faces.forEach(censorFace);
}

function drawFace(face) {
  const { width, height, top, left } = face.boundingBox;
  ctxVideoCanvas.clearRect(0, 0, videoCanvas.width, videoCanvas.height);
  ctxVideoCanvas.strokeStyle = '#ffc600';
  ctxVideoCanvas.lineWidth = 2;
  ctxVideoCanvas.strokeRect(left, top, width * SCALE, height * SCALE);
}

function censorFace({ boundingBox: face }) {
  ctxFaceCanvas.imageSmoothingEnabled = false;
  ctxFaceCanvas.clearRect(0, 0, faceCanvas.width, faceCanvas.height);
  ctxFaceCanvas.drawImage(
    // 5 sourceargs
    webcamVideo,
    face.x,
    face.y,
    face.width,
    face.height,
    // 4 location args
    face.x,
    face.y,
    SIZE,
    SIZE
  );

  const width = face.width * SCALE;
  const height = face.height * SCALE;

  ctxFaceCanvas.drawImage(
    faceCanvas,
    face.x,
    face.y,
    SIZE,
    SIZE,
    face.x,
    face.y,
    width,
    height
  );
}
getWebcamVideo().then(detectFaces);
