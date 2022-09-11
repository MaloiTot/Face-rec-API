const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {
  const canvas1 = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas1)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas1, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas1.getContext('2d').clearRect(0, 0, canvas1.width, canvas1.height)
    faceapi.draw.drawFaceExpressions(canvas1, resizedDetections)
    faceapi.draw.drawDetections(canvas1, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas1, resizedDetections)
  
}, 100)
})