import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);
const light = new THREE.PointLight(0xffffff, 1, 100)
scene.add(light);

const geometry = new THREE.SphereGeometry(1, 32, 16);
const material = new THREE.MeshPhongMaterial({
  color: 0x0000ff,
  emissive: 0x000011
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

camera.position.z = 5;

const clock = new THREE.Clock()

function animate() {
  sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.01;
  light.position.x = 2 * Math.sin(clock.getElapsedTime());
  light.position.z = 2 * Math.cos(clock.getElapsedTime());

  renderer.render(scene, camera);
}
