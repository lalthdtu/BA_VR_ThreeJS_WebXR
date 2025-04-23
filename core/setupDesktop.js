import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import * as THREE from "three";

export function setupDesktopControls(camera, domElement) {
  const controls = new PointerLockControls(camera, domElement);

  const moveState = {
    forward: false,
    backward: false,
    left: false,
    right: false,
  };

  const velocity = new THREE.Vector3();
  const direction = new THREE.Vector3();
  const moveSpeed = 0.25;
  const damping = 10.0;

  const updateMovement = (deltaTime) => {
    if (!controls.isLocked) {
      velocity.x = 0;
      velocity.z = 0;
      return;
    }

    velocity.x -= velocity.x * damping * deltaTime;
    velocity.z -= velocity.z * damping * deltaTime;

    direction.z = Number(moveState.forward) - Number(moveState.backward);
    direction.x = Number(moveState.right) - Number(moveState.left);
    direction.normalize();

    if (moveState.forward || moveState.backward) velocity.z -= direction.z * moveSpeed * deltaTime;
    if (moveState.left || moveState.right) velocity.x -= direction.x * moveSpeed * deltaTime;

    controls.moveRight(-velocity.x);
    controls.moveForward(-velocity.z);
  };

  return { controls, moveState, updateMovement };
}
