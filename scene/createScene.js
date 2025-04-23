// --- START OF FILE createScene.js ---

import * as THREE from "three";

export function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x222222);

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 1.6, 3);

  const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
  scene.add(light);

  const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
  scene.add(ambientLight);

  const planeGeo = new THREE.PlaneGeometry(100, 100);
  const planeMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8 });
  const ground = new THREE.Mesh(planeGeo, planeMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const cubeGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const cubeMat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(cubeGeo, cubeMat);
  cube.position.set(0, 1.6 - 0.25, -2);
  cube.castShadow = true;
  scene.add(cube);

  return { scene, camera, ground, cube };
}
