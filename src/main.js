import * as THREE from 'three';
import vertexShader from "./assets/shaders/mobius-zoom.vert"
import fragmentShader from "./assets/shaders/mobius-zoom.frag"
import earth from "./assets/textures/earth.jpg"

let scene, camera, renderer, sphere, clock;

let zoom_factor = 1
const cursor = new THREE.Vector2(0.5, 0.5);
const pole = new THREE.Vector2(0, Math.PI/2);

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
            u_cursor: { value: new THREE.Vector2(0.5, 0.5) },
            u_texture: { value: texture },
            u_time: { value: 0 },
            u_zoom_factor: { value: zoom_factor },
            u_new_pole: { value: pole }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        glslVersion: THREE.GLSL3,
    });

    sphere = new THREE.Mesh(geometry, material);
    sphere.rotateX(Math.PI / 2)
    scene.add(sphere);

    // Event Listeners
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('mousemove', onMouseMove);

    clock.start()
    animate();
}

// Key press event handler
function onKeyDown(event) {
    let speed = 0.05

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    switch (event.key) {
        case 'ArrowRight':
            pole.x += speed;
            break;
        case 'ArrowLeft':
            pole.x -= speed;
            break;
        case 'ArrowUp':
            pole.y -= speed;
            break;
        case 'ArrowDown':
            pole.y += speed;
            break;
        case 'w':
            zoom_factor += speed;
            break;
        case 's':
            zoom_factor -= speed;
            break;
    }
    pole.y = clamp(pole.y, 0.0001, Math.PI - 0.0001)
    sphere.material.uniforms.u_new_pole.value = pole
    zoom_factor = clamp(zoom_factor, 1/4, 4)
    sphere.material.uniforms.u_zoom_factor.value = zoom_factor
}

// Key release event handler
function onKeyUp(event) {
    if (event.key === 'w') {
        // stretchFactor = 1.0;  // Reset the stretch factor
        // sphere.material.uniforms.stretchFactor.value = stretchFactor;
    }
}

function onMouseMove(event) {
    // Convert mouse position to normalized device coordinates (-1 to 1)
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  
    // Convert to UV coordinates (0 to 1)
    cursor.set((mouseX + 1) / 2, (mouseY + 1) / 2);
  
    // Update the uniform
    sphere.material.uniforms.u_cursor.value = cursor;
}

// Animation loop
function animate() {
    sphere.material.uniforms.u_time.value = clock.getElapsedTime();

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

init();
