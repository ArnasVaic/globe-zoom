import * as THREE from 'three';
import vertexShader from "./assets/shaders/mobius-zoom.vert"
import fragmentShader from "./assets/shaders/mobius-zoom.frag"
import earth from "./assets/textures/earth.jpg"

let scene, camera, renderer, sphere, clock;

let zoom = 1
const pole_0 = new THREE.Vector2(0.0, 0.0001) 
const pole = pole_0;

// Initialize the scene
function init() {
    // Scene, Camera, Renderer
    clock = new THREE.Clock();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Camera position
    camera.position.z = 3;

    // Sphere with Shader Material
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const texture = new THREE.TextureLoader().load(earth);
    const material = new THREE.ShaderMaterial({
        uniforms: {
            u_texture: { value: texture },
            u_time: { value: 0 },
            u_zoom: { value: zoom },
            u_pole: { value: pole }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        glslVersion: THREE.GLSL3,
    });

    sphere = new THREE.Mesh(geometry, material);
    sphere.rotateX(-Math.PI / 2)
    scene.add(sphere);

    // Event Listeners
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('wheel', onScroll);

    clock.start()
    animate();
}

// Key press event handler
function onKeyDown(event) {
    let speed = 0.05

    switch (event.key) {
        case 'ArrowRight':
            sphere.rotation.z -= speed;
            break;
        case 'ArrowLeft':
            sphere.rotation.z += speed;
            break;
        case 'ArrowUp':
            sphere.rotation.x += speed;
            break;
        case 'ArrowDown':
            sphere.rotation.x -= speed;
            break;
        case 'w':
            pole.y -= speed;
            break;
        case 's':
            pole.y += speed;
            break;
        case 'a':
            pole.x -= speed;
            break;
        case 'd':
            pole.x += speed;
            break;
        case 'Escape':
            zoom = 1;
            pole.x = pole_0.x;
            pole.y = pole_0.y;
            sphere.rotation.x = -Math.PI / 2;
            sphere.rotation.z = 0;
            break;
    }

    //pole.y = clamp(pole.y, 0 + 0.0001, Math.PI - 0.0001);
    sphere.material.uniforms.u_pole.value = pole
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function onScroll(event) {
    let speed = 0.001
    zoom -= speed * event.deltaY;
    zoom = clamp(zoom, 1, 3)
    sphere.material.uniforms.u_zoom.value = zoom
}

// Animation loop
function animate() {
    sphere.material.uniforms.u_time.value = clock.getElapsedTime();

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

init();
