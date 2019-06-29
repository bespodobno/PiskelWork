/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
import {
  renderNewFrame, addActiveFrame, renderDuplicateFrame, updateMainCanvas,
} from './renderView';

export function addItemFrame(view, model) {
  // create new frame
  model.createFrame(null);
  // render new matrix in  frames
  renderNewFrame(model.getLength() - 1, view);
  // set canvas to default
  const { canvas } = view;
  if (canvas.getContext) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  model.activeFrame = model.getLength() - 1;
  updateMainCanvas(model.getLength() - 1, view, model);
}

function updateIdFrames() {
  Array.from(document.body.querySelectorAll('.frame-item')).map((el, i) => {
    el.id = `${i}`;
    el.firstElementChild.id = `canvas${i}`;
  });
}

export function deleteFrame(e, view, model) {
  if (document.body.querySelectorAll('.frame-item').length === 1) return;
  // find frame
  const item = e.target.parentNode;
  // update model
  model.removeFrame(parseInt(item.id, 10));
  const frame = item.previousElementSibling || item.nextElementSibling; // fall
  // delete frame from frames in view
  view.frameContainer.removeChild(item);
  // update id in html
  updateIdFrames();
  // set active prev frame or forward
  addActiveFrame(frame, view, model);
  // updateMainCanvas
  const index = parseInt(document.body.querySelector('.frame-item.active').id, 10);
  updateMainCanvas(index, view, model);
  model.activeFrame = index;
}

export function duplicateFrame(e, view, model) {
  // find frame
  const item = e.target.parentNode;
  // console.log(item);
  const index = parseInt(item.id, 10);
  // update model
  model.insertFrame(index);
  // add frame to frames
  renderDuplicateFrame(index, view, model);
  model.activeFrame = index + 1;
  // update id in html
  updateIdFrames();
  updateMainCanvas(index + 1, view, model);
}
