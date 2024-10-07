import * as THREE from "three";

const fileLoader = new THREE.FileLoader()

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
light.position.x = 1
light.position.y = 0
light.position.z = 2;
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(ambientLight);

const geometry = new THREE.SphereGeometry(1, 32, 16);
const texture = new THREE.TextureLoader().load("assets/earth.jpg")
const material = new THREE.MeshPhongMaterial({
  // color: 0x0000ff,
  // emissive: 0x000011,
  map: texture
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

camera.position.z = 5;

const planeGeometry = new THREE.PlaneGeometry(6, 3, 10, 10)
const planeMaterial = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 1.0 },
    resolution: { value: new THREE.Vector2() },
  },

  vertexShader: fileLoader.load() fs.readFile("assets/shaders/mobius-zoom.vert", ),
  fragmentShader: fs.readFile("assets/shaders/mobius-zoom.frag"),
});

const plane = new THREE.Mesh(planeGeometry,planeMaterial);

plane.position.x = 5

scene.add(plane)

//console.log(planeGeometry.attributes.uv)

const clock = new THREE.Clock()

// for (var i = 0; i < uvAttribute.count; i++) {
//   var u = uvAttribute.getX(i);
//   var v = uvAttribute.getY(i);

//   // do something with uv

//   // write values back to attribute

//   uvAttribute.setXY(i, u, v);
// }

function animate() {

  //sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.01;
  //light.position.x = 2 * Math.sin(clock.getElapsedTime());
  //light.position.z = 2 * Math.cos(clock.getElapsedTime());

  renderer.render(scene, camera);
}
