export default function animationPreviewWorker(view, model) {
  const canvasPreview = document.body.querySelector('#canvas-preview');
  const rangeFps = document.body.querySelector('#fps');
  let timerId;
  let indexFrame = 0;

  async function drawPreview(index) {
    const frame = await model.getFrame(index);
    if (canvasPreview.getContext) {
      const ctx = canvasPreview.getContext('2d');
      ctx.clearRect(0, 0, canvasPreview.width, canvasPreview.height);
      if (frame.img.src) {
        const newImg = document.createElement('img');
        newImg.src = frame.img.src;

        newImg.onload = () => {
          // no longer need to read the blob so it's revoked
          ctx.drawImage(newImg, 0, 0, canvasPreview.clientWidth, canvasPreview.clientHeight);
        };
      }
    }
  }

  document.querySelector('#btn-preview-popup').addEventListener('click', () => {
    document.querySelector('.container-preview-canvas').requestFullscreen();
    document.querySelector('.container-preview-canvas').onfullscreenchange = () => {
      if (document.querySelector('.container-preview-canvas') === document.fullscreenElement) {
        canvasPreview.width = window.innerHeight;
        canvasPreview.height = window.innerHeight;
      } else {
        canvasPreview.width = 200;
        canvasPreview.height = 200;
      }
    };
  });

  canvasPreview.addEventListener('load', drawPreview(model.activeFrame));

  view.frameContainer.addEventListener('click', () => {
    drawPreview(model.activeFrame);
  });


  // view.canvas.addEventListener('click', () => {
  //   drawPreview(model.activeFrame);
  // });


  function changeFrames() {
    const framesAmount = model.getLength();
    if (indexFrame === framesAmount) indexFrame = 0;
    drawPreview(indexFrame);
    indexFrame += +1;
  }

  rangeFps.addEventListener('input', () => {
    clearInterval(timerId);
    const span = document.querySelector('#spanFps');
    const fps = rangeFps.value;
    span.innerHTML = fps;
    // fpsGlobal = fps;
    if (fps > 0) {
      // timerId = setInterval(changeFrames, 1000 / fps);
      timerId = setTimeout(function tick() {
        requestAnimationFrame(changeFrames);
        // Drawing code goes here
        timerId = setTimeout(tick, 1000 / fps);
      }, 1000 / fps);
    }
  });
}
