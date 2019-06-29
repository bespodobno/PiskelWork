import GIF from './gif';
import Worker from './gif.worker';

export default class ExportAnimation {
  constructor() {
    // Create a capturer that exports an animated GIF
    // Notices you have to specify the path to the gif.worker.js
    this.gif = new GIF({
      workers: 2,
      quality: 10,
      workerScript: Worker,
    });
  }

  render(imageElementArray) {
    // or a canvas element
    imageElementArray.forEach((imageElement) => {
      this.gif.addFrame(imageElement, { delay: 200, copy: true });
    });

    this.gif.on('finished', (blob) => {
      window.open(URL.createObjectURL(blob));
    });

    this.gif.render();
  }
}
