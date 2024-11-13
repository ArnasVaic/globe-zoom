import * as THREE from "three";
import mobiusZoomVertex from "./public/shaders/mobius-zoom.vert"
import mobiusZoomFragment from "./public/shaders/mobius-zoom.frag"

import earthTexture from "/textures/mesh.jpg"

let scene, camera, renderer, sphere;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const clock = new THREE.Clock();

let theta = 0;
let phi = 0;

function init() {
  // Set up scene, camera, and renderer
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Load texture
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(
    earthTexture
  );

  // Create a sphere with custom shader material
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      u_time: { value: 0 },
      u_zoom: { value: 0 },
      u_texture: { value: texture },
      u_clickUv: { value: new THREE.Vector2(0.5, 0.5) }, // Start zoom at center by default
    },
    vertexShader: mobiusZoomVertex,
    fragmentShader: mobiusZoomFragment
  });
  sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  camera.position.z = 3;

  // Handle window resize
  window.addEventListener("resize", onWindowResize, false);
  // Add click event
  window.addEventListener("click", onSphereClick, false);
  // Add on key down event
  window.addEventListener("keydown", onKeyDown);
  animate();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onSphereClick(event) {
  // Get mouse position in normalized device coordinates (-1 to +1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Raycast to find intersected point
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(sphere);

  if (intersects.length > 0) {
    const intersect = intersects[0];
    const uv = intersect.uv; // Get the UV coordinates of the intersected point

    // Update shader uniforms for the click position and zoom
    const material = sphere.material;
    material.uniforms.u_clickUv.value.copy(uv);
    material.uniforms.u_zoom.value = 1; // Zoom in on click

    // Reset zoom after a short delay
  }
}

function onKeyDown(event) {
  switch (event.key) {
    case "ArrowLeft":
      // Left pressed
      phi += 0.05;
      break;
    case "ArrowRight":
      // Right pressed
      phi -= 0.05;
      break;
    case "ArrowUp":
      // Left pressed
      theta += 0.05;
      break;
    case "ArrowDown":
      // Right pressed
      theta -= 0.05;
      break;
    case "Escape":
      const material = sphere.material;
      material.uniforms.u_zoom.value = 0.0; // Reset zoom
      break;
  }
}

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  sphere.material.uniforms.u_time.value += delta; // Update time uniform
  sphere.rotation.x = theta;
  sphere.rotation.y = phi;
  renderer.render(scene, camera);
}

init();