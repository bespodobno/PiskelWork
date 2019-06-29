/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
import Frame from '../frames-list/Frame';

export default class AppModel {
  constructor() {
    this.activeFrame = 0; // number
    this.frames = [];
    this.width = 32;
    this.height = 32;
  }

  createFrame(image) {
    const frame = new Frame({ img: image }, { width: 32, height: 32 });
    this.frames.push(frame);
  }

  updateFrame(index, image) {
    // delete url for previous???
    this.getFrame(index).setImage(image);
  }

  getIndex(frame) {
    return this.frames.indexOf(frame);
  }

  removeFrame(index) {
    if (index !== -1) {
      this.frames.splice(index, 1);
    }
  }

  getFrame(index) {
    return this.frames[index];
  }

  insertFrame(index) {
    const item = Object.assign({}, this.getFrame(index));
    this.frames.splice(index, 0, item);
  }

  getLength() {
    return this.frames.length;
  }

  // getImage(index) {
  //   return this.getFrame(index).img;
  // }
}
