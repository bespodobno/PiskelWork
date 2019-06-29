import { removeActiveClass, draw, updateMainCanvas } from './renderView';

let dragSrcEl = null;
let frameModelDragged = null;
let model;
let view;
let frames;
let elementEnter;

function handleDragStart() {
  // Target (this) element is the source node.
  this.style.opacity = '0.4';
  const frameIndex = this.id;
  frameModelDragged = model.getFrame(frameIndex);

  dragSrcEl = this;
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault(); // Necessary. Allows us to drop.
  }

  return false;
}

function handleDragEnter(e) {
  // this / e.target is the current hover target.
  if (elementEnter !== this) {
    this.classList.add('over');
    if (elementEnter) elementEnter.classList.remove('over');
    elementEnter = this;
    e.stopPropagation();
  }
}

function handleDrop(e) {
  // this/e.target is current target element.

  if (e.stopPropagation) {
    e.stopPropagation(); // Stops some browsers from redirecting.
  }

  // Don't do anything if dropping the same cell we're dragging.
  if (dragSrcEl !== this) {
    dragSrcEl.style.opacity = '1';
    const imgDragged = frameModelDragged.getImage();
    const frameIndex = this.id;
    const frameModelDropped = model.getFrame(frameIndex);
    const imgDropped = frameModelDropped.getImage();

    frameModelDragged.setImage(imgDropped);
    frameModelDropped.setImage(imgDragged);
    // remove active class and set it to dropped frame
    removeActiveClass();
    this.classList.add('active');
    // перерисовать frames и если надо main canvas
    draw(dragSrcEl.id, model);
    draw(frameIndex, model);
    updateMainCanvas(frameIndex, view, model);
    model.activeFrame = frameIndex;
    // if (frameIndex !== model.activeFrame) { // проверить
    //   updateMainCanvas(frameIndex, view, model);
    //   console.log('update main frame');
    // }
  }

  return false;
}

function handleDragEnd() {
  // this/e.target is the source node.
  [].forEach.call(frames, (frame) => {
    frame.classList.remove('over');
  });
}


export function addMoveEventListener(frameContainer, viewApp, modelApp) {
  model = modelApp;
  view = viewApp;
  frames = frameContainer.children;
  Array.from(frames).forEach((frame) => {
    if (frame.classList.contains('frame-item')) {
      frame.addEventListener('dragstart', handleDragStart, false);
      frame.addEventListener('dragenter', handleDragEnter, false);
      frame.addEventListener('dragover', handleDragOver, false);
      // frame.addEventListener('dragleave', handleDragLeave, false);
      frame.addEventListener('drop', handleDrop, false);
      frame.addEventListener('dragend', handleDragEnd, false);
    }
  });
}

export function removeMoveEventListener(frameContainer) {
  frames = frameContainer.children;
  Array.from(frames).forEach((frame) => {
    if (frame.classList.contains('frame-item')) {
      frame.removeEventListener('dragstart', handleDragStart, false);
      frame.removeEventListener('dragenter', handleDragEnter, false);
      frame.removeEventListener('dragover', handleDragOver, false);
      // frame.removeEventListener('dragleave', handleDragLeave, false);
      frame.removeEventListener('drop', handleDrop, false);
      frame.removeEventListener('dragend', handleDragEnd, false);
    }
  });
}
