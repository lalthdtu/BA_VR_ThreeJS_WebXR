# VR Navigation Path Recorder (Three.js/WebXR) - BA/VR

A simple web application demonstrating path recording and visualization in a 3D environment using Three.js. Supports both Desktop (Mouse/Keyboard) and WebXR (VR) interaction, automatically detecting the best mode available.

## 🚀 Features

*   **Real-time Path Recording:** Capture the user's movement path within the 3D scene.
*   **Path Visualization:** Draw the recorded paths as colored lines on the ground plane. Each path gets a unique color gradient.
*   **Dual Mode:**
    *   **Desktop Mode:** Control movement with WASD/Arrow keys and look around with the mouse (using Pointer Lock).
    *   **VR Mode:** Interact using WebXR-compatible VR headsets and controllers.
*   **Automatic Mode Detection:** Checks for WebXR support and initializes the appropriate controls and UI instructions.
*   **Adjustable Sample Rate (Desktop):** Change the frequency at which position data is recorded using the mouse wheel.
*   **Simple UI:** On-screen display showing recording status, sample rate, and basic controls. Toast notifications provide feedback on actions.
*   **Modular Code:** Project structured with ES Modules for better organization (Scene setup, Renderer, Controls, UI Manager).
*   **Vite Powered:** Uses Vite for fast development and optimized builds.

## 🛠️ Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/lalthdtu/BA_VR_ThreeJS_WebXR
    cd <repository-directory>
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Start the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
4.  **Open your browser:** Navigate to the local URL provided by Vite (usually `http://localhost:5173` or similar).

## 🎮 Usage / Controls

The application will automatically detect if your browser and system support WebXR.

**Desktop Mode:**

*   **Look:** Click on the screen to lock the mouse pointer and look around. Press `ESC` to unlock.
*   **Move:** Use `W`, `A`, `S`, `D` or the Arrow Keys.
*   **Record:** Press the `R` key to start recording your path. Press `R` again to stop recording and draw the path.
*   **Adjust Sample Rate:** Use the Mouse Wheel while the pointer is *not* locked. A lower value (e.g., 50ms) means more frequent samples (smoother path, more data), a higher value (e.g., 1000ms) means less frequent samples. Changes take effect immediately if recording, or on the next recording session.

**VR Mode (WebXR):**

*   **Enter VR:** Click the "Enter VR" button that appears (requires a connected VR headset and compatible browser).
*   **Move:** Movement is typically handled by your VR system's standard locomotion (e.g., joystick on controllers, teleportation - this demo doesn't implement specific VR locomotion, it relies on headset tracking).
*   **Record:** Press the **Trigger button** on either VR controller to start recording. Press the Trigger again to stop recording and draw the path.
*   **Fallback Record:** The `R` key on the physical keyboard can also be used as a fallback to start/stop recording while in VR.

## 📁 Project Structure / Scripts

*   **`index.html`**: The main HTML file, sets up the page structure, canvas container, UI elements, and loads the main JavaScript module.
*   **`main.js`**:
    *   The core application logic and entry point.
    *   Initializes the scene, camera, renderer, and UI manager.
    *   Detects XR support and sets up either Desktop or VR controls accordingly.
    *   Manages the recording state (`isRecording`, `recordedPositions`, `sampleRate`).
    *   Handles event listeners for keyboard input, window resize, VR controller input.
    *   Contains the main animation loop (`animate`).
    *   Draws the recorded paths onto the scene.
*   **`UIManager.js`**:
    *   A class responsible for interacting with the DOM elements in `index.html`.
    *   Updates the recording status indicator, sample rate display, and instruction text.
    *   Shows temporary "toast" messages for user feedback.
*   **`createScene.js`**:
    *   A function that creates and configures the basic Three.js `Scene`.
    *   Sets up the `PerspectiveCamera`, lighting (Hemisphere, Ambient), and initial scene objects (ground plane, cube).
    *   Returns the created scene and camera instances.
*   **`setupRenderer.js`**:
    *   A function that creates and configures the Three.js `WebGLRenderer`.
    *   Sets the size, pixel ratio, and enables XR support (`renderer.xr.enabled = true`).
    *   Appends the renderer's canvas element to the document body.
    *   Returns the configured renderer instance.
*   **`setupDesktop.js`**:
    *   A function responsible for setting up the desktop controls.
    *   Initializes `PointerLockControls` for mouse-look functionality.
    *   Manages the movement state (`moveState`) based on keyboard input.
    *   Provides an `updateMovement` function to calculate and apply camera movement based on the state and delta time, incorporating simple damping.
    *   Returns the controls instance, move state object, and update function.
*   **`setupVR.js`**:
    *   A function responsible for setting up the WebXR environment.
    *   Appends the `VRButton` to the page.
    *   Gets references to the XR controllers and adds them to the scene.
    *   Uses `XRControllerModelFactory` to load and display models for the controllers.
    *   Adds simple line pointers to the controllers for visual feedback.
    *   Returns references to the controllers.
*   **`package.json` / `package-lock.json`**: Define project dependencies (Three.js, Vite) and scripts (`dev`, `build`, `preview`).


## 💡 Technology Stack

*   **Three.js:** Core 3D rendering library.
*   **Vite:** Frontend build tool and development server.
*   **JavaScript (ES Modules):** Application logic.
*   **HTML5 / CSS3:** Structure and basic styling.
*   **WebXR Device API:** For Virtual Reality support.

## 🔮 Potential Future Improvements

*   Save/Load recorded paths (e.g., to LocalStorage or a file).
*   Export path data (JSON, CSV).
*   More complex scene environments.
*   Path editing or smoothing options.
*   UI for selecting, viewing, or deleting multiple recorded paths.
*   Implement specific VR locomotion options (teleport, joystick movement).
