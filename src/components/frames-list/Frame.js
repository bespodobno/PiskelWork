export default class Frame {
  constructor(img, size) {
    this.img = img;
    this.size = size;
  }

  getImage() {
    return this.img;
  }

  setImage(image) {
    this.img = image;
  }

  getSize() {
    return this.size;
  }

  setSize(size) {
    this.size = size;
  }
}
