export function removeActiveClass() {
  const frames = document.body.querySelectorAll('.frame-item');
  Array.from(frames).forEach((el) => {
    if (el.classList.contains('active')) {
      el.classList.remove('active');
    }
  });
}

export function draw(index, model) {
  const canvas = document.body.querySelector(`#canvas${index}`);
  const frame = model.getFrame(index);
  if (canvas.getContext) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (frame.img.src) {
      const newImg = document.createElement('img');
      newImg.src = frame.img.src;
      newImg.onload = () => {
        // no longer need to read the blob so it's revoked
        ctx.drawImage(newImg, 0, 0, canvas.clientWidth, canvas.clientHeight);
      };
    }
  }
}

export function updateMainCanvas(index, view, model) {
  const { canvas } = view;
  const frame = model.getFrame(index);

  if (canvas.getContext) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (frame.img.src) {
      const newImg = document.createElement('img');
      newImg.src = frame.img.src;
      newImg.onload = () => {
        // no longer need to read the blob so it's revoke
        ctx.drawImage(newImg, 0, 0, canvas.clientWidth, canvas.clientHeight);
      };
    }
  }
}

export function renderNewFrame(index, view) {
  // refreshActionBar();
  const { frameContainer } = view;
  const divAddNewFrame = document.body.querySelector('.add-item');

  const frame = document.createElement('div');
  frame.classList.add('frame-item');
  frame.innerHTML += `<canvas class="canvas-frame" width="96" height="96"
id="canvas${index}"></canvas>`;
  // check if other frames is active and remove
  removeActiveClass();
  frame.classList.add('active');
  frame.setAttribute('draggable', true);
  frame.id = `${index}`;
  const btnDelete = document.createElement('button');
  btnDelete.classList.add('btn-delete');
  btnDelete.classList.add('hidden');
  const btnCopy = document.createElement('button');
  btnCopy.classList.add('btn-copy');
  btnCopy.classList.add('hidden');
  btnCopy.style.marginLeft = '5px';
  const btnMove = document.createElement('button');
  btnMove.classList.add('btn-move');
  btnMove.classList.add('hidden');
  btnMove.style.marginLeft = '5px';
  frame.appendChild(btnDelete);
  frame.appendChild(btnCopy);
  frame.appendChild(btnMove);
  frameContainer.insertBefore(frame, divAddNewFrame);
  // draw(index, model);
}

export function addActiveFrame(frame, view, model) {
  // refreshActionBar();
  removeActiveClass();
  frame.classList.add('active');
  const index = parseInt(document.body.querySelector('.frame-item.active').id, 10);
  // draw(index, model);
  updateMainCanvas(index, view, model);
}

export function renderDuplicateFrame(id, view, model) {
  const frame = document.getElementById(`${id}`);
  const frameDuplicate = frame.cloneNode(true);
  frameDuplicate.classList.remove('active');
  frameDuplicate.id = `${id + 1}`;
  frameDuplicate.firstElementChild.id = `canvas${id + 1}`;
  const frameContainer = document.body.querySelector('.container-frames');
  frameContainer.insertBefore(frameDuplicate, frame.nextSibling);
  addActiveFrame(frameDuplicate, view, model);
  draw(id + 1, model);
  updateMainCanvas(id + 1, view, model);
}

// document.body.addEventListener('load', draw(0));

// document.querySelector('div.container').addEventListener('click', (e) => {
// });
