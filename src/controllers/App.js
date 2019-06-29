import AppModel from '../components/model/AppModel';
import AppView from '../screens/preview/AppView';
import { deleteFrame, duplicateFrame, addItemFrame } from '../components/frames-list/index';
import { addActiveFrame } from '../components/frames-list/renderView';
import { addMoveEventListener, removeMoveEventListener } from '../components/frames-list/drag';
import animationPreviewWorker from '../screens/preview/index';
import ExportAnimation from '../screens/export/ExportAnimation';

require('../screens/canvas/reset.css');
require('../screens/canvas/styles.css');

export default class App {
  constructor() {
    this.model = new AppModel();
    this.view = new AppView();
  }

  start() {
    this.model.createFrame(this.view.getCurrentImg());

    this.view.defineColortoPicker();

    this.view.canvas.addEventListener('click', this.handlerCanvasClick.bind(this));

    this.view.toolbarBasic.addEventListener('click', this.handlerToolbarClick.bind(this));

    this.view.toolbarPenSize.addEventListener('click', this.handlerChangePenSize.bind(this));

    this.view.toolbarColorInput.addEventListener('click', this.handlerChangeInputColor.bind(this));

    this.view.picker1.onDone = (color) => {
      document.querySelector('#color-input1').style.backgroundImage = 'none';
      document.querySelector('#color-input1').style.background = color.rgbString;
      this.view.selectedColor = color.rgbString;
    };
    this.view.picker2.onDone = (color) => {
      document.querySelector('#color-input2').style.backgroundImage = 'none';
      document.querySelector('#color-input2').style.background = color.rgbaString;
    };
    this.view.frameContainer.addEventListener('mouseover', this.handlerFrameContainerMouseOver.bind(this));

    this.view.frameContainer.addEventListener('mouseout', this.handlerFrameContainerMouseOut.bind(this));

    this.view.frameContainer.addEventListener('click', this.handlerFrameContainerClick.bind(this));

    this.view.previewContainer.addEventListener('mouseover', () => {
      document.querySelector('.btn-preview-size').classList.toggle('hidden');
      document.querySelector('.btn-preview-popup').classList.toggle('hidden');
    });

    this.view.previewContainer.addEventListener('mouseout', () => {
      document.querySelector('.btn-preview-size').classList.toggle('hidden');
      document.querySelector('.btn-preview-popup').classList.toggle('hidden');
    });

    addMoveEventListener(this.view.frameContainer, this.view, this.model);

    animationPreviewWorker(this.view, this.model);

    this.view.drawWithPen();
    document.querySelector('.button-item.export-tool').addEventListener('click', this.handlerExportToolClick.bind(this));
  }

  handlerCanvasClick(e) {
    // const point = e.target;
    switch (this.view.activeTool) {
      case 'pen':
        this.view.drawWithPen();
        this.model.updateFrame(this.model.activeFrame, this.view.getCurrentImg());
        break;

      case 'paint-bucket':
        // global.console.log('paint-backet');
        this.view.drawWithPaintBucket(e);
        this.model.updateFrame(this.model.activeFrame, this.view.getCurrentImg());
        break;

      case 'color-picker':
        this.view.pickColorWithColorPicker(e);
        break;
      case 'eraser':
        this.view.drawWithPen();
        this.model.updateFrame(this.model.activeFrame, this.view.getCurrentImg());
        break;

      default:
        global.console.warn('unsupported action');
        break;
    }
  }

  handlerToolbarClick(e) {
    switch (e.target.id) {
      case 'pen':
        this.view.activeTool = 'pen';
        this.view.highlightButton(e.target);
        break;
      case 'mirror-pen':
        this.view.activeTool = 'mirror-pen';
        this.view.highlightButton(e.target);
        break;
      case 'paint-bucket':
        this.view.activeTool = 'paint-bucket';
        this.view.highlightButton(e.target);
        break;
      case 'color-swap':
        this.view.activeTool = 'color-swap';
        this.view.highlightButton(e.target);
        break;
      case 'eraser':
        this.view.activeTool = 'eraser';
        this.view.highlightButton(e.target);
        break;
      case 'stroke':
        this.view.activeTool = 'stroke';
        this.view.highlightButton(e.target);
        break;
      case 'rectangle-tool':
        this.view.activeTool = 'rectangle-tool';
        this.view.highlightButton(e.target);
        break;
      case 'circle-tool':
        this.view.activeTool = 'circle-tool';
        this.view.highlightButton(e.target);
        break;
      case 'move-tool':
        this.view.activeTool = 'move-tool';
        this.view.highlightButton(e.target);
        break;
      case 'shape-section':
        this.view.activeTool = 'shape-section';
        this.view.highlightButton(e.target);
        break;
      case 'shape-tool':
        this.view.activeTool = 'shape-tool';
        this.view.highlightButton(e.target);
        break;
      case 'lasso-tool':
        this.view.activeTool = 'lasso-tool';
        this.view.highlightButton(e.target);
        break;
      case 'lighten-tool':
        this.view.activeTool = 'lighten-tool';
        this.view.highlightButton(e.target);
        break;
      case 'dithering-tool':
        this.view.activeTool = 'dithering-tool';
        this.view.highlightButton(e.target);
        break;
      case 'color-picker':
        this.view.activeTool = 'color-picker';
        this.view.highlightButton(e.target);
        break;
      default:
        console.warn('unsupported action');
        break;
    }
  }

  handlerChangePenSize(e) {
    const penSize = e.target.getAttribute('data-size') || e.target.parentNode.getAttribute('data-size');
    switch (penSize) {
      case '1':
        this.view.penSize = 1;
        this.view.highlightPenSize(penSize);
        break;
      case '2':
        this.view.penSize = 2;
        this.view.highlightPenSize(penSize);
        break;
      case '3':
        this.view.penSize = 3;
        this.view.highlightPenSize(penSize);
        break;
      case '4':
        this.view.penSize = 4;
        this.view.highlightPenSize(penSize);
        break;
      default:
        console.warn('unsupported action');
        break;
    }
  }

  handlerChangeInputColor(e) {
    try {
      switch (e.target.id) {
        case 'color-input2':
          this.view.selectedColor = e.target.style.backgroundColor;
          break;
        case 'color-input1':
          this.view.selectedColor = e.target.style.backgroundColor;
          break;
        case 'swap-color':
          this.swapColorPicker();
          break;
        default:
          console.warn('unsupported action');
          break;
      }
    } catch (error) {
      console.log(error);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  swapColorPicker() {
    const temp1 = document.querySelector('#color-input1').style.backgroundColor;
    const temp2 = document.querySelector('#color-input2').style.backgroundColor;
    document.querySelector('#color-input2').style.backgroundColor = temp1;
    document.querySelector('#color-input1').style.backgroundColor = temp2;
    this.view.selectedColor = temp2;
    if (temp1 === 'transparent') {
      document.querySelector('#color-input2').style.backgroundImage = 'url("https://i.imgur.com/JFVR2Q1.png")';
      document.querySelector('#color-input1').style.backgroundImage = 'none';
    } else if (temp2 === 'transparent') {
      document.querySelector('#color-input1').style.backgroundImage = 'url("https://i.imgur.com/JFVR2Q1.png")';
      document.querySelector('#color-input2').style.backgroundImage = 'none';
    }
  }

  handlerFrameContainerMouseOver(e) {
    if (this.view.currentFrame) {
      return;
    }
    let { target } = e;
    while (target !== this) {
      if (e.target.classList.contains('canvas-frame')) break; //  frame-item
      if (!target) break;
      target = target.parentNode;
    }
    if (target === this || !target) return;

    this.view.currentFrame = target;
    const btns = target.parentNode.querySelectorAll('.hidden'); //  addparentnode
    Array.from(btns).map(el => el.classList.remove('hidden'));
  }

  handlerFrameContainerMouseOut(e) {
    if (!this.view.currentFrame) {
      return;
    }

    let { relatedTarget } = e;
    if (relatedTarget) {
      while (relatedTarget) {
        if (relatedTarget === this.view.currentFrame.parentNode) return;
        relatedTarget = relatedTarget.parentNode;
      }
    }
    const btns = this.view.currentFrame.parentNode.children;
    Array.from(btns).forEach((el) => {
      if (!el.classList.contains('canvas-frame')) {
        el.classList.add('hidden');
      }
    });

    this.view.currentFrame = null;
  }

  handlerFrameContainerClick(e) {
    if (e.target.classList.contains('btn-delete')) {
      deleteFrame(e, this.view, this.model);
    } else if (e.target.classList.contains('btn-copy')) {
      duplicateFrame(e, this.view, this.model);
    } else if (e.target.parentNode.classList.contains('frame-item')) {
      this.model.activeFrame = e.target.parentNode.id;
      addActiveFrame(e.target.parentNode, this.view, this.model);
      // render from frame to canvas
    } else if (e.target.classList.contains('add-item')
      || e.target.classList.contains('btn-add-item')) {
      addItemFrame(this.view, this.model);
      removeMoveEventListener(this.view.frameContainer);
      addMoveEventListener(this.view.frameContainer, this.view, this.model);
    }
  }

  handlerExportToolClick() {
    const exportAnimation = new ExportAnimation();
    console.log(this.model.frames);
    exportAnimation.render(this.model.frames);
  }
}
