import * as THREE from "three";

export function setupRenderer(container = document.body) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.xr.enabled = true;

  container.appendChild(renderer.domElement);
  return renderer;
}
