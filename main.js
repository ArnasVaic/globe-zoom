import * as THREE from "three";
import mobiusZoomVertex from "./public/shaders/mobius-zoom.vert"
import mobiusZoomFragment from "./public/shaders/mobius-zoom.frag"

import earthTexture from "/textures/earth.jpg"
import { uniform, uniforms } from "three/webgpu";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const raycaster = new THREE.Raycaster();

const pointer = new THREE.Vector2();

const light = new THREE.PointLight(0xffffff, 1, 100)
light.position.x = 1
light.position.y = 0
light.position.z = 2;
const ambientLight = new THREE.AmbientLight(0x404040);

window.addEventListener( 'pointermove', onPointerMove );
window.addEventListener('click', onClick);
window.addEventListener("resize", OnResize);
window.addEventListener("keydown", onKeyDown);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setAnimationLoop(render)

document.body.appendChild(renderer.domElement);

const sphereGeometry = new THREE.SphereGeometry(1, 32, 16);
const texture = new THREE.TextureLoader().load("./public/textures/earth.jpg")
const material = new THREE.MeshPhongMaterial({ map: texture });


const cameraPolarAngle = new THREE.Vector2();

camera.position.z = 5;

const planeGeometry = new THREE.PlaneGeometry(6, 3, 10, 10)
const planeMaterial = new THREE.ShaderMaterial({
  glslVersion: THREE.GLSL3,
  vertexShader: mobiusZoomVertex,
  fragmentShader: mobiusZoomFragment,
});

planeMaterial.uniforms.uHit = new THREE.Uniform(new THREE.Vector3(0, 0, 0));
planeMaterial.uniforms.uTexture = { value: new THREE.TextureLoader().load(earthTexture) }
planeMaterial.uniforms.uResolution = new THREE.Uniform(new THREE.Vector2(window.innerWidth, window.innerHeight))

// const plane = new THREE.Mesh(planeGeometry,planeMaterial);

const sphere = new THREE.Mesh(sphereGeometry, planeMaterial);

const cylinderGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1, 8);
const cylinder = new THREE.Mesh(cylinderGeometry, material);

scene.add(cylinder);
scene.add(light);
scene.add(ambientLight);
//scene.add(plane)
scene.add(sphere);

function render() {

  //sphere.rotation.x += 0.01;
  //sphere.rotation.y += 0.01;

  camera.position.x = 3 * Math.sin(cameraPolarAngle.x) // * Math.cos(cameraPolarAngle.x);
  camera.position.z = 3 * Math.cos(cameraPolarAngle.x);

  camera.lookAt(new THREE.Vector3(0, 0, 0));

  //light.position.x = 2 * Math.sin(clock.getElapsedTime());
  //light.position.z = 2 * Math.cos(clock.getElapsedTime());

	// calculate objects intersecting the picking ray
	//const intersects = raycaster.intersectObjects( plane );

  renderer.render(scene, camera);
}

function onPointerMove( event ) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function onKeyDown(event) {
  switch (event.key) {
    case "ArrowLeft":
      // Left pressed
      cameraPolarAngle.x = cameraPolarAngle.x + 0.05;
      //cameraPolarAngle.x = Math.min(2 * Math.PI - 0.01, cameraPolarAngle.x);
      break;
    case "ArrowRight":
      // Right pressed
      cameraPolarAngle.x = cameraPolarAngle.x - 0.05;
      //cameraPolarAngle.x = Math.max(0.01, cameraPolarAngle.x);
      break;
    case "ArrowUp":
      // Up pressed
      cameraPolarAngle.y = cameraPolarAngle.y + 0.05;
      break;
    case "ArrowDown":
      // Down pressed
      cameraPolarAngle.y = cameraPolarAngle.y - 0.05;
      break;
  }
}

function onClick( event ) {
  raycaster.setFromCamera( pointer, camera );
  const hits = raycaster.intersectObject( sphere );

  if(0 != hits.length) {
    // on plane there will be only one hit
    let hit = hits[0]
    let ray = raycaster.ray.clone()
    let hitPosition = ray.direction.multiplyScalar(hit.distance).add(ray.origin);
    console.log(hitPosition)

    cylinder.rotation.x = 3.14;
    cylinder.position.copy(hitPosition.multiplyScalar(2));
    cylinder.lookAt(new THREE.Vector3(0,0,0))

    planeMaterial.uniforms.uHit = new THREE.Uniform(hitPosition);
  }
}

function OnResize() {
  let uResolution = new THREE.Vector2(window.innerWidth, window.innerHeight)
  uResolution = planeMaterial.uniforms.uResolution = new THREE.Uniform(uResolution);
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
