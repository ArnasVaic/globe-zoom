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

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setAnimationLoop(render)

document.body.appendChild(renderer.domElement);

const sphereGeometry = new THREE.SphereGeometry(1, 32, 16);
const texture = new THREE.TextureLoader().load("./public/textures/earth.jpg")
const material = new THREE.MeshPhongMaterial({ map: texture });
const sphere = new THREE.Mesh(sphereGeometry, material);

camera.position.z = 5;

const planeGeometry = new THREE.PlaneGeometry(6, 3, 10, 10)
const planeMaterial = new THREE.ShaderMaterial({
  glslVersion: THREE.GLSL3,
  vertexShader: mobiusZoomVertex,
  fragmentShader: mobiusZoomFragment,
});

planeMaterial.uniforms.uTexture = { value: new THREE.TextureLoader().load(earthTexture) }
planeMaterial.uniforms.uResolution = new THREE.Uniform(new THREE.Vector2(window.innerWidth, window.innerHeight))

const plane = new THREE.Mesh(planeGeometry,planeMaterial);


plane.position.x = 0

scene.add(light);
scene.add(ambientLight);
scene.add(plane)
//scene.add(sphere);

function render() {

  //sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.01;
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

function onClick( event ) {
  raycaster.setFromCamera( pointer, camera );
  const hits = raycaster.intersectObject( plane );

  if(0 != hits.length) {
    // on plane there will be only one hit
    let hit = hits[0]
    let ray = raycaster.ray.clone()
    let hitPosition = ray.direction.multiplyScalar(hit.distance).add(ray.origin);
    // plane hit coords are in range [-0.5; 0.5]
    let hitPlaneLocalCoords = hitPosition.multiply( new THREE.Vector3(1 / 6, 1 / 3, 0));
    planeMaterial.uniforms.uPlaneHitCoord = new THREE.Uniform(
      hitPlaneLocalCoords
    );
  }
}

function OnResize() {
  let uResolution = new THREE.Vector2(window.innerWidth, window.innerHeight)
  uResolution = planeMaterial.uniforms.uResolution = new THREE.Uniform(uResolution);
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
