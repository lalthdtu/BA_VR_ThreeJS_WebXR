export class UIManager {
  constructor() {
    this.recordIndicator = document.getElementById("record-indicator");
    this.sampleRateDisplay = document.getElementById("sample-rate");
    this.toastElement = document.getElementById("toast");
    this.instructionsElement = document.getElementById("instructions");

    if (!this.recordIndicator || !this.sampleRateDisplay || !this.toastElement || !this.instructionsElement) {
      console.warn("UI Manager: One or more required DOM elements not found.");
    }
  }

  updateRecordIndicator(isRecording) {
    if (!this.recordIndicator) return;
    this.recordIndicator.style.borderColor = isRecording ? "red" : "white";
    this.recordIndicator.textContent = isRecording ? "R — Recording..." : "R — Record";
    document.body.style.cursor = isRecording ? "crosshair" : "default";
  }

  updateSampleRate(rate) {
    if (!this.sampleRateDisplay) return;
    this.sampleRateDisplay.textContent = `Sample Rate: ${rate}ms`;
  }

  showToast(message, duration = 1500) {
    if (!this.toastElement) return;
    this.toastElement.textContent = message;
    this.toastElement.style.opacity = 1;
    setTimeout(() => (this.toastElement.style.opacity = 0), duration);
  }

  setInstructions(text) {
    if (!this.instructionsElement) return;
    this.instructionsElement.innerHTML = text.replace(/\n/g, "<br>");
  }

  setDesktopInstructions() {
    this.setInstructions("Click to look around\nWASD to move\nR to Record\nWheel to change rate");
  }

  setVRInstructions() {
    this.setInstructions("Enter VR\nTrigger to Record\nR key fallback");
  }
}
