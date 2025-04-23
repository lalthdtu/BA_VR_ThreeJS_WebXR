import * as THREE from "three";
import { UIManager } from "./UIManager.js";
import { createScene } from "./scene/createScene.js";
import { setupRenderer } from "./core/setupRenderer.js";
import { setupDesktopControls } from "./core/setupDesktop.js";
import { setupVR } from "./core/setupVR.js";

class App {
  constructor() {
    this.uiManager = new UIManager();
    this.clock = new THREE.Clock();
    this.scene = null;
    this.camera = null;
    this.renderer = null;

    this.desktopControls = null;
    this.desktopMoveState = null;
    this.desktopUpdateMovement = null;
    this.vrControllers = {};

    this.isRecording = false;
    this.recordedPositions = [];
    this.recordInterval = null;
    this.sampleRate = 100;
    this.allPaths = [];

    this.animate = this.animate.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleKeyup = this.handleKeyup.bind(this);
    this.handleWheel = this.handleWheel.bind(this);
    this.handleVRSelectStart = this.handleVRSelectStart.bind(this);
    this.toggleRecording = this.toggleRecording.bind(this);
  }

  async init() {
    const { scene, camera } = createScene();
    this.scene = scene;
    this.camera = camera;

    this.renderer = setupRenderer(document.body);

    this.uiManager.updateSampleRate(this.sampleRate);

    await this.setupMode();

    this.addEventListeners();

    this.renderer.setAnimationLoop(this.animate);
  }

  async detectXR() {
    try {
      return navigator.xr && (await navigator.xr.isSessionSupported("immersive-vr"));
    } catch (e) {
      console.warn("navigator.xr unavailable or isSessionSupported failed:", e);
      return false;
    }
  }

  async setupMode() {
    const vrSupported = await this.detectXR();

    if (vrSupported && this.renderer.xr) {
      this.uiManager.setVRInstructions();
      const { controller1, controller2 } = setupVR(this.renderer, this.scene);
      this.vrControllers.controller1 = controller1;
      this.vrControllers.controller2 = controller2;
      if (controller1) controller1.addEventListener("selectstart", this.handleVRSelectStart);
      if (controller2) controller2.addEventListener("selectstart", this.handleVRSelectStart);
      if (!this.scene.children.includes(this.camera)) {
        this.scene.add(this.camera);
      }
    } else {
      console.log("VR not supported or XR context failed, setting up Desktop controls.");
      this.uiManager.setDesktopInstructions();
      const { controls, moveState, updateMovement } = setupDesktopControls(this.camera, this.renderer.domElement);
      this.desktopControls = controls;
      this.desktopMoveState = moveState;
      this.desktopUpdateMovement = updateMovement;
      if (!this.scene.children.includes(this.desktopControls.getObject())) {
        this.scene.add(this.desktopControls.getObject());
      }
      this.renderer.domElement.addEventListener("click", () => {
        if (this.desktopControls && !this.desktopControls.isLocked) {
          this.desktopControls.lock();
        }
      });
    }
  }

  addEventListeners() {
    window.addEventListener("resize", this.handleResize);
    document.addEventListener("keydown", this.handleKeydown);
    document.addEventListener("keyup", this.handleKeyup);
    this.renderer.domElement.addEventListener("wheel", this.handleWheel, { passive: false });
  }

  handleResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  handleKeydown(event) {
    if (this.desktopControls && this.desktopMoveState) {
      switch (event.code) {
        case "KeyW":
        case "ArrowUp":
          this.desktopMoveState.forward = true;
          break;
        case "KeyS":
        case "ArrowDown":
          this.desktopMoveState.backward = true;
          break;
        case "KeyA":
        case "ArrowLeft":
          this.desktopMoveState.left = true;
          break;
        case "KeyD":
        case "ArrowRight":
          this.desktopMoveState.right = true;
          break;
      }
    }
    if (event.code === "KeyR" && !event.repeat) {
      this.toggleRecording();
    }
  }

  handleKeyup(event) {
    if (this.desktopControls && this.desktopMoveState) {
      switch (event.code) {
        case "KeyW":
        case "ArrowUp":
          this.desktopMoveState.forward = false;
          break;
        case "KeyS":
        case "ArrowDown":
          this.desktopMoveState.backward = false;
          break;
        case "KeyA":
        case "ArrowLeft":
          this.desktopMoveState.left = false;
          break;
        case "KeyD":
        case "ArrowRight":
          this.desktopMoveState.right = false;
          break;
      }
    }
  }

  handleWheel(event) {
    if (event.ctrlKey || event.metaKey) return;
    event.preventDefault();

    const delta = Math.sign(event.deltaY);
    const step = 50;

    const oldSampleRate = this.sampleRate;
    this.sampleRate = THREE.MathUtils.clamp(this.sampleRate + delta * step, 50, 1000);

    if (oldSampleRate !== this.sampleRate) {
      this.uiManager.updateSampleRate(this.sampleRate);
      this.uiManager.showToast(`Sample Rate: ${this.sampleRate}ms`, 1200);

      if (this.isRecording) {
        this.stopRecording(false);
        this.startRecording(false);
      }
    }
  }

  handleVRSelectStart() {
    this.toggleRecording();
  }

  toggleRecording() {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }

  startRecording(showToast = true) {
    if (this.isRecording) return;

    this.isRecording = true;
    this.recordedPositions = [];

    if (this.recordInterval) {
      clearInterval(this.recordInterval);
      this.recordInterval = null;
    }

    this.recordInterval = setInterval(() => {
      const currentPosition = this.camera.getWorldPosition(new THREE.Vector3());
      this.recordedPositions.push(new THREE.Vector3(currentPosition.x, 0, currentPosition.z));
    }, this.sampleRate);

    this.uiManager.updateRecordIndicator(this.isRecording);
    if (showToast) {
      this.uiManager.showToast("Recording started...", 1500);
    }
    console.log("Recording started. Sample rate:", this.sampleRate, "ms");
  }

  stopRecording(draw = true) {
    if (!this.isRecording) return;

    this.isRecording = false;
    if (this.recordInterval) {
      clearInterval(this.recordInterval);
      this.recordInterval = null;
    }

    this.uiManager.updateRecordIndicator(this.isRecording);

    if (draw && this.recordedPositions.length > 1) {
      this.uiManager.showToast("Recording stopped. Path saved.", 1500);
      this.drawPath();
      console.log("All Recorded Paths:", this.allPaths);
    } else if (draw) {
      this.uiManager.showToast("Recording stopped. Not enough points to draw path.", 1500);
    } else {
      console.log("Recording interval stopped (e.g., for rate change).");
    }

    console.log("Recording stopped. Points recorded:", this.recordedPositions.length);
  }

  drawPath() {
    if (this.recordedPositions.length < 2) {
      console.warn("Not enough points to draw a path.");
      return;
    }

    const pathCopy = this.recordedPositions.map((p) => p.clone());
    this.allPaths.push(pathCopy);

    const liftedPoints = pathCopy.map((p) => new THREE.Vector3(p.x, 0.01, p.z));
    const geometry = new THREE.BufferGeometry().setFromPoints(liftedPoints);

    const colorStart = new THREE.Color().setHSL(Math.random(), 0.8, 0.6);
    const colorEnd = new THREE.Color().setHSL(Math.random(), 0.8, 0.6);
    const colors = [];
    const numPoints = liftedPoints.length;

    const divisor = numPoints > 1 ? numPoints - 1 : 1;
    for (let i = 0; i < numPoints; i++) {
      const t = i / divisor;
      const color = colorStart.clone().lerp(colorEnd, t);
      colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.LineBasicMaterial({ vertexColors: true, linewidth: 2 });
    const line = new THREE.Line(geometry, material);
    this.scene.add(line);
  }

  animate() {
    const deltaTime = this.clock.getDelta();

    if (this.desktopControls && this.desktopUpdateMovement) {
      this.desktopUpdateMovement(deltaTime);
    }

    this.renderer.render(this.scene, this.camera);
  }
}

async function startApp() {
  try {
    const app = new App();
    await app.init();
    console.log("Application initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize the application:", error);
    document.body.innerHTML = `<div style="color: red; font-family: sans-serif; padding: 20px;">
            <h2>Application Error</h2>
            <p>Could not initialize the experience. Please ensure your browser supports WebGL and WebXR if applicable.</p>
            <pre>${error.message}</pre>
        </div>`;
  }
}

startApp();
