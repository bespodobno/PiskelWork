/* eslint-disable array-callback-return */
/* eslint-disable prefer-template */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
import Picker from 'vanilla-picker';

export default class AppView {
  constructor() {
    this.canvas = document.querySelector('#canvas-main');
    this.toolbarBasic = document.querySelector('#container-tools');
    this.toolbartransform = document.querySelector('#containers-transform');
    this.toolbarPenSize = document.querySelector('.container-pen-size');
    this.toolbarColorInput = document.querySelector('.container-color-input');
    this.picker1 = new Picker({ parent: document.querySelector('#color-input1'), popup: 'top' });
    this.picker2 = new Picker({ parent: document.querySelector('#color-input2'), popup: 'top' });
    this.frameContainer = document.body.querySelector('.container-frames');
    this.previewContainer = document.body.querySelector('.container-preview-canvas');
    this.currentFrame = null;
    this.activeTool = 'pen';
    this.selectedColor = '';
    this.penSize = 4;
  }

  defineColortoPicker() {
    this.selectedColor = '#000000';
    document.querySelector('#color-input1').style.backgroundColor = '#000000';
    document.querySelector('#color-input2').style.backgroundColor = '#00FFFF00';
  }

  renderFrame() {
    console.log('we render Frame in AppView');
    const { canvas } = this;
    canvas.toBlob((blob) => {
      const newImg = document.createElement('img');
      const url = URL.createObjectURL(blob);
      newImg.src = url;
      // check which frame is active
      const index = parseInt(document.body.querySelector('.frame-item.active').id, 10);
      const canvasFrame = document.querySelector(`#canvas${index}`);
      const canvasPreview = document.body.querySelector('#canvas-preview');

      if (canvasFrame.getContext && canvasPreview.getContext) {
        const ctx = canvasFrame.getContext('2d');
        const ctxPreview = canvasPreview.getContext('2d');
        ctx.clearRect(0, 0, canvasFrame.width, canvasFrame.height);
        ctxPreview.clearRect(0, 0, canvasPreview.width, canvasPreview.height);
        newImg.onload = () => {
          // no longer need to read the blob so it's revoked
          // URL.revokeObjectURL(url);
          ctx.drawImage(newImg, 0, 0, canvasFrame.clientWidth, canvasFrame.clientHeight);
          ctxPreview.drawImage(newImg, 0, 0, canvasPreview.clientWidth, canvasPreview.clientHeight);
        };
      }
    });
  }

  getCurrentImg() {
    const { canvas } = this;
    const newImg = document.createElement('img');
    let url;
    canvas.toBlob((blob) => {
      url = URL.createObjectURL(blob);
      newImg.src = url;
    });
    return newImg;
  }

  // eslint-disable-next-line class-methods-use-this
  highlightButton(button) {
    const buttons = this.toolbarBasic.querySelectorAll('.button-item');
    if (Array.from(buttons).includes(button)) {
      Array.from(buttons).forEach((btn) => {
        btn.classList.remove('active');
      });
      button.classList.add('active');
    }
  }

  // eslint-disable-next-line class-methods-use-this
  highlightPenSize(penSize) {
    const divs = this.toolbarPenSize.querySelectorAll('.pen-size-option');

    Array.from(divs).forEach((el) => {
      el.classList.remove('selected');
    });
    //    <div class="pen-size-option selected" data-size="4">
    this.toolbarPenSize.querySelector(`[data-size="${penSize}"]`).classList.add('selected');
  }

  drawWithPen() {
    const { canvas } = this;
    const context = canvas.getContext('2d');
    context.fillStyle = document.querySelector('.color-input.active').style.background;
    context.lineWidth = this.penSize * 10;
    const renderFrame = this.renderFrame.bind(this);
    let { penSize } = this;
    const mouse = { x: 0, y: 0 };
    let draw = false;

    function handlerDrawWithPenMouseMove(e) {
      if (draw === true) {
        if (document.querySelector('.button-item.active').classList.contains('pen')) {
          context.fillRect(mouse.x, mouse.y, penSize * 10, penSize * 10);
        } else if (document.querySelector('.button-item.active').classList.contains('eraser')) {
          // context.globalCompositeOperation = 'destination-out';
          context.clearRect(mouse.x, mouse.y, penSize * 10, penSize * 10);
          // context.globalCompositeOperation = 'source-over';
        }
        mouse.x = e.pageX - canvas.offsetLeft;
        mouse.y = e.pageY - canvas.offsetTop;
      }
    }

    function handlerDrawWithPenMouseUp() {
      if (draw) renderFrame();
      draw = false;
    }

    function handleMouseOut() {
      if (draw) renderFrame();
      draw = false;
    }

    function handlerDrawWithPenMouseDown(e) {
      // проверить button pressed и pensize
      context.fillStyle = document.querySelector('.color-input.active').style.background;
      penSize = document.querySelector('.pen-size-option.selected').getAttribute('data-size').valueOf();
      mouse.x = e.pageX - canvas.offsetLeft;
      mouse.y = e.pageY - canvas.offsetTop;
      draw = true;
      if (document.querySelector('.button-item.active').classList.contains('pen')) {
        context.fillRect(mouse.x, mouse.y, penSize * 10, penSize * 10);
      } else if (document.querySelector('.button-item.active').classList.contains('eraser')) {
        // context.globalCompositeOperation = 'destination-out';
        context.clearRect(mouse.x, mouse.y, penSize * 10, penSize * 10);
        // context.globalCompositeOperation = 'source-over';
      } else {
        canvas.removeEventListener('mousedown', handlerDrawWithPenMouseDown);
        canvas.removeEventListener('mousemove', handlerDrawWithPenMouseMove);
        canvas.removeEventListener('mouseup', handlerDrawWithPenMouseUp);
        canvas.removeEventListener('mouseout', handleMouseOut);
      }
    }
    canvas.addEventListener('mousedown', handlerDrawWithPenMouseDown);
    canvas.addEventListener('mousemove', handlerDrawWithPenMouseMove);
    canvas.addEventListener('mouseup', handlerDrawWithPenMouseUp);
    canvas.addEventListener('mouseout', handleMouseOut);
  }

  drawWithPaintBucket(e) {
    // console.log(e.pageX);
    if (this.activeTool !== 'paint-bucket') return;

    const { canvas } = this;
    const ctx = canvas.getContext('2d');
    const mouse = { x: 0, y: 0 };
    mouse.x = Math.ceil(e.pageX - canvas.offsetLeft);
    mouse.y = Math.ceil(e.pageY - canvas.offsetTop);


    let color = 0xff0000ff;

    color = AppView.convertColor(this.selectedColor);

    function getPixel(pixelData, x, y) {
      if (x < 0 || y < 0 || x >= pixelData.width || y >= pixelData.height) {
        return -1; // impossible color
      }
      return pixelData.data[y * pixelData.width + x];
    }

    function floodFill(ctx, x, y, fillColor) {
      // read the pixels in the canvas
      const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

      // make a Uint32Array view on the pixels so we can manipulate pixels
      // one 32bit value at a time instead of as 4 bytes per pixel
      const pixelData = {
        width: imageData.width,
        height: imageData.height,
        data: new Uint32Array(imageData.data.buffer),
      };

      // get the color we're filling
      const targetColor = getPixel(pixelData, x, y);

      // check we are actually filling a different color
      if (targetColor !== fillColor) {
        const pixelsToCheck = [x, y];
        while (pixelsToCheck.length > 0) {
          const y = pixelsToCheck.pop();
          const x = pixelsToCheck.pop();

          const currentColor = getPixel(pixelData, x, y);
          if (currentColor === targetColor) {
            pixelData.data[y * pixelData.width + x] = fillColor;
            pixelsToCheck.push(x + 1, y);
            pixelsToCheck.push(x - 1, y);
            pixelsToCheck.push(x, y + 1);
            pixelsToCheck.push(x, y - 1);
          }
        }

        // put the data back
        ctx.putImageData(imageData, 0, 0);
      }
    }
    floodFill(ctx, mouse.x, mouse.y, color);// 0xff0000ff
    this.renderFrame();
  }

  static convertColor(color) {
    let r = '00';
    let g = '00';
    let b = '00';
    let a = 'ff';
    if (color.indexOf('#') !== -1) {
      if (color.length === 4) {
        r = '' + color[1] + color[1];
        g = '' + color[2] + color[2];
        b = '' + color[3] + color[3];
      } if (color.length === 7) {
        r = '' + color[1] + color[2];
        g = '' + color[3] + color[4];
        b = '' + color[5] + color[6];
      } if (color.length === 9) {
        r = '' + color[1] + color[2];
        g = '' + color[3] + color[4];
        b = '' + color[5] + color[6];
        a = '' + color[7] + color[8];
      }
    }
    if (color.indexOf('rgba') !== -1) {
      // убрать скобки
      const arr = color.slice(5, -1).split(',');

      r = (+arr[0]).toString(16);
      g = (+arr[1]).toString(16);
      b = (+arr[2]).toString(16);
      a = Math.round(arr[3] * 255).toString(16);

      return parseInt('0x' + a + b + g + r, 16);
    } if (color.indexOf('rgb') !== -1) {
      const arr = color.slice(4, -1).split(',');
      r = (+arr[0]).toString(16);
      g = (+arr[1]).toString(16);
      b = (+arr[2]).toString(16);
      a = Math.round(255).toString(16);
      if (r.length === 1) r = '0' + r;

      if (g.length === 1) g = '0' + g;

      if (b.length === 1) b = '0' + b;

      if (a.length === 1) a = '0' + a;
    }
    return parseInt('0x' + a + b + g + r, 16);
  }

  pickColorWithColorPicker(e) {
    if (this.activeTool !== 'color-picker') return;

    const { canvas } = this;
    const ctx = canvas.getContext('2d');
    const mouse = { x: 0, y: 0 };
    mouse.x = Math.ceil(e.pageX - canvas.offsetLeft);
    mouse.y = Math.ceil(e.pageY - canvas.offsetTop);
    const pixelData = ctx.getImageData(mouse.x, mouse.y, 1, 1).data;
    if ((pixelData[0] === 0) && (pixelData[1] === 0) && (pixelData[2] === 0)
      && (pixelData[3] === 0)) {
      // Do something if the pixel is transparent
      this.picker1.setColor('#00FFFF00', true);
      // document.querySelector('#color-input1').style.background = '#00FFFF00';
      document.querySelector('#color-input1').style.background = 'url("https://i.imgur.com/JFVR2Q1.png")';
      return;
    }
    function rgbToHex(r, g, b) {
      // eslint-disable-next-line no-bitwise
      return ((r << 16) | (g << 8) | b).toString(16);
    }
    // Convert it to HEX if you want using the rgbToHex method.
    const hex = '#' + ('000000' + rgbToHex(pixelData[0], pixelData[1], pixelData[2])).slice(-6);
    // console.log(hex);
    this.picker1.setColor(hex, true);
    document.querySelector('#color-input1').style.backgroundImage = 'none';
    document.querySelector('#color-input1').style.background = hex;
  }
}
